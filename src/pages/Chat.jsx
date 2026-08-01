import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { 
  MessageCircle, 
  Send, 
  Search, 
  Users, 
  CheckCheck,
  MoreVertical,
  Hash,
  Crown,
  Code,
  Copy,
  Check,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { soundManager } from '../services/soundUtils'

// Code Snippet Message Component with syntax formatting & 1-click copy
const CodeSnippetMessage = ({ text }) => {
  const [copied, setCopied] = useState(false)
  const cleanCode = text.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim()
  const matchLang = text.match(/^```([a-z]+)/i)
  const language = matchLang ? matchLang[1].toUpperCase() : 'CODE'

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    toast.success('Code snippet copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden my-1 text-xs border border-white/15 bg-[#0a0a0f] w-full max-w-[420px] shadow-lg">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-gray-400">
        <span className="font-mono font-bold text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1">
          <Code className="w-3.5 h-3.5 text-amber-400" />
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-emerald-300 font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/40">
        <code>{cleanCode}</code>
      </pre>
    </div>
  )
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const messagesEndRef = useRef(null)
  const queryClient = useQueryClient()

  // Fetch conversations
  const { data: conversationsData, isLoading, refetch: refetchConversations } = useQuery(
    'conversations',
    () => api.get('/chat/conversations').then(res => res.data),
    {
      refetchInterval: 5000
    }
  )

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery(
    ['messages', selectedConversation?.type, selectedConversation?.team_id || selectedConversation?.partner?._id],
    async () => {
      if (!selectedConversation) return { data: { messages: [] } }
      
      try {
        if (selectedConversation.type === 'team') {
          const messagesResponse = await api.get(`/chat/team/${selectedConversation.team_id}`)
          return messagesResponse.data
        } else {
          const messagesResponse = await api.get(`/chat/private/${selectedConversation.partner._id}`)
          return messagesResponse.data
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        return { data: { messages: [] } }
      }
    },
    { 
      enabled: !!selectedConversation,
      refetchInterval: 3000
    }
  )

  // Send message mutation
  const sendMessageMutation = useMutation(
    (messageData) => api.post('/chat/send', messageData),
    {
      onSuccess: () => {
        soundManager.playChime()
        queryClient.invalidateQueries('conversations')
        queryClient.invalidateQueries(['messages', selectedConversation?.type, selectedConversation?.team_id || selectedConversation?.partner?._id])
        setMessage('')
        refetchMessages()
        refetchConversations()
      },
      onError: (error) => {
        console.error('Error sending message:', error)
      }
    }
  )

  const conversations = conversationsData?.data?.conversations || []
  const messages = messagesData?.data?.messages || []
  const { user: urlUser } = useParams()

  // Handle URL parameter for direct chat
  useEffect(() => {
    if (urlUser && conversations.length > 0) {
      const userConversation = conversations.find(conv => 
        (conv.type === 'private' && conv.partner._id === urlUser) ||
        (conv.type === 'team' && conv.members?.some(member => member.user_id._id === urlUser))
      )
      if (userConversation) {
        setSelectedConversation(userConversation)
      }
    }
  }, [urlUser, conversations])

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Filter conversations based on search and tab
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.type === 'team' 
      ? (conv.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         conv.project_title?.toLowerCase().includes(searchTerm.toLowerCase()))
      : conv.team_name?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === 'teams') return conv.type === 'team' && matchesSearch
    return matchesSearch
  })

  const sendMessage = () => {
    if (!message.trim() || !selectedConversation) return

    const messageData = {
      message: message.trim(),
      message_type: 'text'
    }

    if (selectedConversation.type === 'team') {
      messageData.team_id = selectedConversation.team_id
    } else {
      messageData.receiver_id = selectedConversation.partner._id
    }

    sendMessageMutation.mutate(messageData)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="h-full flex-1 flex relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{
        backgroundImage: 'url("/images/image3.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="absolute inset-0 bg-black/80 z-0" />
      <div className="relative z-10 flex w-full h-full overflow-hidden">
      {/* Conversations List */}
      <div className={`${
        selectedConversation ? 'hidden md:flex' : 'flex'
      } w-full md:w-80 border-r border-gray-700/80 flex-col bg-black/40 backdrop-blur-md h-full overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center mb-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messages
            </h2>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'teams' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Teams
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm ? 'Try a different search term' : 'Start a new conversation'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.type === 'team' ? conversation.team_id : conversation.partner._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 hover:bg-gray-800 cursor-pointer transition-colors ${
                    selectedConversation?.team_id === conversation.team_id ||
                    selectedConversation?.partner?._id === conversation.partner?._id
                      ? 'bg-gray-800 border-l-4 border-primary-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conversation.type === 'team' ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                      ) : conversation.partner.profile_image ? (
                        <img
                          src={conversation.partner.profile_image}
                          alt={conversation.partner.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {conversation.partner.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {conversation.type === 'team' ? conversation.team_name : conversation.partner.name}
                          {conversation.type === 'team' && conversation.user_role === 'Leader' && (
                            <Crown className="w-3 h-3 text-yellow-500 ml-1 inline" />
                          )}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {conversation.last_message && formatTime(conversation.last_message.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.last_message ? (
                            <>
                              {conversation.type === 'team' && conversation.last_message.sender_id && (
                                <span className="font-medium text-gray-300">
                                  {conversation.last_message.sender_id.name}: 
                                </span>
                              )}{' '}
                              {conversation.last_message.message}
                            </>
                          ) : (
                            conversation.type === 'team' 
                              ? `Start team conversation` 
                              : `Start conversation with ${conversation.partner.name}`
                          )}
                        </p>
                        
                        {conversation.unread_count > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${
        selectedConversation ? 'flex' : 'hidden md:flex'
      } flex-1 flex-col h-full overflow-hidden bg-black/20 backdrop-blur-sm`}>
        
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-gray-700/80 flex items-center justify-between flex-shrink-0 bg-gray-900/60 backdrop-blur-md">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Back button - mobile only */}
                <button
                  type="button"
                  className="md:hidden p-2 rounded-xl bg-gray-800/90 hover:bg-gray-700 text-white transition-colors border border-gray-700 flex items-center justify-center shrink-0 active:scale-95 shadow-sm"
                  onClick={() => setSelectedConversation(null)}
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  {selectedConversation.type === 'team' ? (
                    <Hash className="w-5 h-5 text-white" />
                  ) : selectedConversation.partner?.profile_image ? (
                    <img src={selectedConversation.partner.profile_image} alt={selectedConversation.partner.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {selectedConversation.partner?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white flex items-center truncate text-sm sm:text-base">
                    {selectedConversation.type === 'team' ? (
                      <>
                        <Hash className="w-4 h-4 mr-1 text-primary-400 shrink-0" />
                        <span className="truncate">{selectedConversation.team_name}</span>
                      </>
                    ) : (
                      <span className="truncate">{selectedConversation.partner?.name}</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {selectedConversation.type === 'team' 
                      ? `${selectedConversation.project_title || 'Team Group Chat'}`
                      : `${selectedConversation.partner?.college || ''} ${selectedConversation.partner?.branch ? '• ' + selectedConversation.partner.branch : ''}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="medium" />
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((msg, index) => {
                    const isOwn = msg.sender_id._id === localStorage.getItem('userId')
                    const showDate = index === 0 || 
                      formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt)

                    return (
                      <div key={msg._id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
                          <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar */}
                            {!isOwn && (
                              <div className="flex-shrink-0">
                                {msg.sender_id.profile_image ? (
                                  <img
                                    src={msg.sender_id.profile_image}
                                    alt={msg.sender_id.name}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-400/30"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-lg font-bold text-white">
                                      {msg.sender_id.name?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Message Content */}
                            <div className="flex flex-col">
                              {/* Sender info for team messages */}
                              {selectedConversation.type === 'team' && !isOwn && (
                                <div className="mb-1 px-1">
                                  <span className="text-xs text-gray-400 font-medium">
                                    {msg.sender_id.name}
                                  </span>
                                  {msg.sender_id.college && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      • {msg.sender_id.college}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Message bubble / Code Snippet */}
                              {msg.message?.startsWith('```') || msg.message?.includes('```') ? (
                                <CodeSnippetMessage text={msg.message} />
                              ) : (
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isOwn
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-700 text-white'
                                  }`}
                                >
                                  <p className="text-sm break-words">{msg.message}</p>
                                </div>
                              )}
                              
                              {/* Timestamp and read status */}
                              <div className={`flex items-center space-x-1.5 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[11px] text-gray-400">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isOwn && (
                                  <div className="flex items-center" title={msg.is_read ? 'Read' : 'Delivered'}>
                                    <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-emerald-400' : 'text-gray-400'}`} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                    <p className="text-gray-400">Start the conversation with a message!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Typing Indicator */}
            {message.trim().length > 0 && (
              <div className="px-4 py-1.5 text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-500/10 border-t border-emerald-500/20 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Typing message...</span>
              </div>
            )}

            {/* Message Input Container - Sticky at bottom of chat area */}
            <div className="p-3 sm:p-4 border-t border-gray-700/80 bg-gray-900/95 backdrop-blur-md flex-shrink-0 z-20">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setMessage(prev => prev ? `${prev}\n\`\`\`js\n// paste code here\n\`\`\`` : '```js\n// paste code here\n```')}
                  className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                  title="Insert Code Snippet"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input
                  type="text"
                  className="flex-1 min-w-0 px-3.5 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder={`Message ${selectedConversation.type === 'team' ? 'team' : selectedConversation.partner?.name?.split(' ')[0] || ''}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sendMessageMutation.isLoading}
                  className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center min-w-[42px] min-h-[42px] active:scale-95 shadow-md shadow-primary-500/20"
                >
                  {sendMessageMutation.isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>💬 Chat with team members privately</p>
                <p>👥 Group chat with your entire team</p>
                <p>🎯 Message your team leader directly</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Chat
