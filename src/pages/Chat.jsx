import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom'
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
  ArrowLeft,
  User,
  ShieldCheck,
  ExternalLink,
  Zap,
  Flame,
  FileCode2
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
    <div className="rounded-2xl overflow-hidden my-1.5 text-xs border border-white/15 bg-[#0a0a10] w-full max-w-[440px] shadow-2xl">
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/5 border-b border-white/10 text-gray-300">
        <span className="font-mono font-bold text-[10px] text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-amber-400" />
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-gray-300 hover:text-white transition-colors cursor-pointer bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          <span className="font-medium">{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-emerald-300 font-mono text-[11px] leading-relaxed custom-scrollbar bg-black/60">
        <code>{cleanCode}</code>
      </pre>
    </div>
  )
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'teams', 'direct'
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
  const [searchParams] = useSearchParams()
  const pathParams = useParams()
  const urlUser = searchParams.get('user') || searchParams.get('userId') || pathParams.user

  // Handle URL parameter for direct chat
  useEffect(() => {
    if (!urlUser) return

    const userConversation = conversations.find(conv => 
      (conv.type === 'private' && conv.partner?._id === urlUser) ||
      (conv.type === 'team' && (conv.team_id === urlUser || conv.members?.some(member => member.user_id?._id === urlUser)))
    )

    if (userConversation) {
      setSelectedConversation(userConversation)
    } else {
      // Fetch target user details to start a direct chat if no prior conversation exists
      api.get(`/users/${urlUser}`)
        .then(res => {
          if (res.data?.user) {
            setSelectedConversation({
              type: 'private',
              partner: res.data.user,
              unread_count: 0
            })
          }
        })
        .catch(err => console.error('Error fetching user for chat:', err))
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
      : (conv.partner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         conv.team_name?.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === 'teams') return conv.type === 'team' && matchesSearch
    if (activeTab === 'direct') return conv.type !== 'team' && matchesSearch
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
    <div className="h-full w-full flex-1 flex relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090e] min-h-0"
      style={{
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
      
      {/* Ambient Glow Lighting Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex w-full h-full overflow-hidden">

        {/* Conversations Sidebar */}
        <div className={`${
          selectedConversation ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-80 xl:w-96 border-r border-white/10 flex-col bg-[#0d0d14]/90 backdrop-blur-xl h-full overflow-hidden shrink-0`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>Messages Workspace</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300 border border-white/10">
                {conversations.length} Active
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('teams')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'teams' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Teams ({conversations.filter(c => c.type === 'team').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('direct')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'direct' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Direct ({conversations.filter(c => c.type !== 'team').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Search chats, teams, project titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="medium" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <MessageCircle className="w-10 h-10 text-gray-500 mx-auto opacity-60" />
                <p className="text-xs font-semibold text-gray-400">
                  {searchTerm ? 'No conversations matching search' : 'No active conversations yet'}
                </p>
                <p className="text-[11px] text-gray-500">
                  {searchTerm ? 'Try typing a different keyword' : 'Create or join a team to start chatting!'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isSelected = (selectedConversation?.team_id === conversation.team_id && conversation.type === 'team') ||
                  (selectedConversation?.partner?._id === conversation.partner?._id && conversation.type !== 'team')

                return (
                  <div
                    key={conversation.type === 'team' ? conversation.team_id : conversation.partner._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-white/10 border-orange-500/50 shadow-lg ring-1 ring-orange-500/30'
                        : 'border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {conversation.type === 'team' ? (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white border border-white/20 shadow-md">
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                        ) : conversation.partner?.profile_image ? (
                          <img
                            src={conversation.partner.profile_image}
                            alt={conversation.partner.name}
                            className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
                            {conversation.partner?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Online status indicator */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d0d14]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-white truncate text-xs sm:text-sm flex items-center gap-1.5">
                            <span className="truncate">
                              {conversation.type === 'team' ? conversation.team_name : conversation.partner.name}
                            </span>
                            {conversation.type === 'team' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 flex-shrink-0">
                                TEAM
                              </span>
                            )}
                            {conversation.type === 'team' && conversation.user_role === 'Leader' && (
                              <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            )}
                          </h3>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 font-medium">
                            {conversation.last_message && formatTime(conversation.last_message.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs text-gray-400 truncate leading-relaxed">
                            {conversation.last_message ? (
                              <>
                                {conversation.type === 'team' && conversation.last_message.sender_id && (
                                  <span className="font-bold text-gray-300">
                                    {conversation.last_message.sender_id.name.split(' ')[0]}: 
                                  </span>
                                )}{' '}
                                {conversation.last_message.message}
                              </>
                            ) : (
                              conversation.type === 'team' 
                                ? `Tap to chat with team` 
                                : `Tap to chat with ${conversation.partner.name?.split(' ')[0]}`
                            )}
                          </p>

                          {conversation.unread_count > 0 && (
                            <span className="bg-orange-500 text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 min-w-[18px] text-center shadow-md animate-pulse">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className={`${
          selectedConversation ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col h-full overflow-hidden bg-black/40 backdrop-blur-md`}>
          
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-[#0d0d14]/90 backdrop-blur-xl">
                <div className="flex items-center space-x-3 min-w-0">
                  
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center justify-center shrink-0 active:scale-95 shadow-sm cursor-pointer"
                    onClick={() => setSelectedConversation(null)}
                    title="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>

                  {/* Header Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0 border border-white/20 shadow-md">
                    {selectedConversation.type === 'team' ? (
                      <Hash className="w-5 h-5 text-white" />
                    ) : selectedConversation.partner?.profile_image ? (
                      <img src={selectedConversation.partner.profile_image} alt={selectedConversation.partner.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {selectedConversation.partner?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white flex items-center truncate text-sm sm:text-base gap-1.5">
                      {selectedConversation.type === 'team' ? (
                        <>
                          <Hash className="w-4 h-4 text-orange-400 shrink-0" />
                          <span className="truncate">{selectedConversation.team_name}</span>
                        </>
                      ) : (
                        <span className="truncate">{selectedConversation.partner?.name}</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {selectedConversation.type === 'team' 
                        ? `${selectedConversation.project_title || 'Team Group Workspace'}`
                        : `${selectedConversation.partner?.college || ''} ${selectedConversation.partner?.branch ? '• ' + selectedConversation.partner.branch : ''}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {selectedConversation.type !== 'team' && selectedConversation.partner?._id && (
                    <Link
                      to={`/user/${selectedConversation.partner._id}`}
                      className="btn-secondary text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5 text-orange-400" />
                      <span className="hidden sm:inline">Profile</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setMessage(prev => prev ? `${prev}\n\`\`\`js\n// paste code snippet\n\`\`\`` : '```js\n// paste code snippet\n```')}
                    className="btn-secondary text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 text-amber-400 cursor-pointer"
                    title="Insert Code Snippet"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Code Snippet</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Messages Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="medium" />
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {messages.map((msg, index) => {
                      const isOwn = msg.sender_id._id === localStorage.getItem('userId')
                      const showDate = index === 0 || 
                        formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt)

                      return (
                        <div key={msg._id} className="space-y-2">
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="px-3.5 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-semibold border border-white/10 shadow-sm">
                                {formatDate(msg.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div className={`flex items-end space-x-2.5 max-w-[85%] sm:max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              
                              {/* Avatar for received messages */}
                              {!isOwn && (
                                <div className="flex-shrink-0">
                                  {msg.sender_id.profile_image ? (
                                    <img
                                      src={msg.sender_id.profile_image}
                                      alt={msg.sender_id.name}
                                      className="w-8 h-8 rounded-xl object-cover border border-white/20 shadow-md"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/15">
                                      {msg.sender_id.name?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Message Content Bubble */}
                              <div className="flex flex-col min-w-0">
                                
                                {/* Sender Info in Group Team Chat */}
                                {selectedConversation.type === 'team' && !isOwn && (
                                  <div className="mb-1 px-1 flex items-center gap-1.5">
                                    <span className="text-xs text-orange-400 font-bold">
                                      {msg.sender_id.name}
                                    </span>
                                    {msg.sender_id.college && (
                                      <span className="text-[10px] text-gray-400">
                                        • {msg.sender_id.college}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Code Snippet or Text Bubble */}
                                {msg.message?.startsWith('```') || msg.message?.includes('```') ? (
                                  <CodeSnippetMessage text={msg.message} />
                                ) : (
                                  <div
                                    className={`px-4 py-2.5 rounded-2xl shadow-lg border text-sm leading-relaxed ${
                                      isOwn
                                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white border-orange-400/40 rounded-br-none'
                                        : 'bg-white/10 border-white/15 text-gray-100 backdrop-blur-md rounded-bl-none'
                                    }`}
                                  >
                                    <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                                  </div>
                                )}

                                {/* Timestamp & Read Receipts */}
                                <div className={`flex items-center space-x-1.5 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-[10px] text-gray-400 font-medium">
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
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-xl">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No messages yet</h3>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                      Say hello to start the conversation with your team members!
                    </p>
                  </div>
                )}
              </div>

              {/* Live Typing Indicator */}
              {message.trim().length > 0 && (
                <div className="px-4 py-1.5 text-xs text-orange-400 font-bold flex items-center gap-2 bg-orange-500/10 border-t border-orange-500/20 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span>Drafting message...</span>
                </div>
              )}

              {/* Floating Glass Input Dock */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0d0d14]/95 backdrop-blur-xl shrink-0 z-20">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setMessage(prev => prev ? `${prev}\n\`\`\`js\n// paste code snippet\n\`\`\`` : '```js\n// paste code snippet\n```')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                    title="Insert Code Snippet"
                  >
                    <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <input
                    type="text"
                    className="flex-1 min-w-0 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder={`Message ${selectedConversation.type === 'team' ? 'team members' : selectedConversation.partner?.name?.split(' ')[0] || ''}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!message.trim() || sendMessageMutation.isLoading}
                    className="btn-sunset px-4 py-3 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center justify-center min-w-[44px] shadow-lg hover:scale-105 active:scale-95"
                  >
                    {sendMessageMutation.isLoading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State when no conversation is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 p-0.5 shadow-2xl">
                <div className="w-full h-full rounded-[22px] bg-[#0d0d14] flex items-center justify-center text-orange-400">
                  <MessageCircle className="w-10 h-10" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-black text-white tracking-tight">TeamZen Messages Workspace</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Select a team group or private conversation from the left sidebar to start messaging, share code snippets, and collaborate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-xs">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center">
                  <MessageCircle className="w-5 h-5 text-orange-400 mx-auto" />
                  <p className="font-bold text-white">Direct Chat</p>
                  <p className="text-[10px] text-gray-400">Private student messaging</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center">
                  <Hash className="w-5 h-5 text-purple-400 mx-auto" />
                  <p className="font-bold text-white">Team Groups</p>
                  <p className="text-[10px] text-gray-400">Collaborate with team</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center">
                  <FileCode2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  <p className="font-bold text-white">Code Snippets</p>
                  <p className="text-[10px] text-gray-400">Format & 1-click copy</p>
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
