import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  MessageCircle,
  Trophy,
  Sparkles,
  CheckCircle,
  Send,
  Crown,
  ExternalLink,
  Code,
  Heart,
  Plus,
  Play,
  Pause
} from 'lucide-react'

const demoTabs = [
  {
    id: 'finder',
    label: 'Teammate Finder',
    icon: Search,
    color: '#3b82f6',
    title: 'Discover AI Skill-Matched Teammates',
    description: 'Filter candidates by branch, tech stack, and experience. High-compatibility profiles are highlighted automatically.'
  },
  {
    id: 'teams',
    label: 'Team Management',
    icon: Users,
    color: '#a855f7',
    title: 'Recruit & Manage Project Teams',
    description: 'Track team capacity in real-time, assign leader roles, and manage pending student join requests.'
  },
  {
    id: 'chat',
    label: 'Real-time Chat',
    icon: MessageCircle,
    color: '#10b981',
    title: 'Seamless In-App Team Communication',
    description: 'Discuss project goals, share code snippets, and coordinate hackathon submissions without leaving TeamZen.'
  },
  {
    id: 'projects',
    label: 'Project Showcase',
    icon: Trophy,
    color: '#f97316',
    title: 'Showcase Projects & Achievements',
    description: 'Highlight past hackathon victories, BTech major projects, and verified student achievements.'
  }
]

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState('finder')
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [invitedUser, setInvitedUser] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatList, setChatList] = useState([
    { sender: 'Aryan (React Dev)', text: 'Hey team! Let us finalize our SIH hackathon frontend components today.', time: '10:42 AM', isSelf: false },
    { sender: 'Priya (ML Eng)', text: 'Awesome! I have loaded the Python FastAPI model endpoints.', time: '10:43 AM', isSelf: false }
  ])

  // Autoplay tabs every 5s unless paused
  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = demoTabs.findIndex((t) => t.id === prev)
        const nextIndex = (currentIndex + 1) % demoTabs.length
        return demoTabs[nextIndex].id
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    setChatList((prev) => [
      ...prev,
      { sender: 'You', text: chatMessage, time: 'Just now', isSelf: true }
    ])
    setChatMessage('')
  }

  const currentTabInfo = demoTabs.find((t) => t.id === activeTab)

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#0d0d14' }}>
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(255,107,53,0.06) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-orange-400 border border-orange-500/30 bg-orange-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Product Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            See How <span className="text-sunset">TeamZen Works</span>
          </h2>
          <p className="text-gray-400 text-base">
            Click through the interactive tabs below to experience our core platform features in action.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
          {demoTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setIsAutoPlay(false)
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-lg border border-white/20'
                    : 'text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${tab.color}35, rgba(255,255,255,0.05))` : undefined,
                  boxShadow: isActive ? `0 10px 30px ${tab.color}25` : undefined
                }}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? '#ffffff' : tab.color }} />
                <span>{tab.label}</span>
              </button>
            )
          })}

          {/* Autoplay Pause/Play Toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
            title={isAutoPlay ? 'Pause Auto Tour' : 'Start Auto Tour'}
          >
            {isAutoPlay ? <Pause className="w-4 h-4 text-amber-400 animate-pulse" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Mac-Style Glass Window Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          style={{
            background: 'rgba(15, 15, 23, 0.92)',
            backdropFilter: 'blur(20px)'
          }}>

          {/* Mac Top Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-4 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-gray-400 truncate">
              🔒 teamzen.app/demo/<span className="text-white font-medium">{activeTab}</span>
            </div>

            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest hidden sm:block">
              Live Interactive Demo
            </div>
          </div>

          {/* Interactive Screen Display Area */}
          <div className="p-6 md:p-10 min-h-[420px] flex flex-col justify-center">
            
            {/* Header info for current active feature */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Feature Highlight</span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">{currentTabInfo.title}</h3>
              <p className="text-xs md:text-sm text-gray-400 mt-1">{currentTabInfo.description}</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                
                {/* 1. TEAMMATE FINDER DEMO CARD */}
                {activeTab === 'finder' && (
                  <div className="max-w-xl mx-auto rounded-2xl p-6 relative overflow-hidden border border-white/10"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)' }}>
                    
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                    
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold ring-2 ring-blue-400/50">
                          A
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0d0d14]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-bold text-white">Aryan Sharma</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ⚡ 96% Match
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">KNIT Sultanpur · BTech IT (3rd Year)</p>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {['React.js', 'Node.js', 'Python', 'Tailwind'].map((skill) => (
                            <span key={skill} className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Invite Action */}
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="text-xs text-gray-400">Status: <strong className="text-emerald-400">🟢 Available for SIH</strong></span>
                          <button
                            onClick={() => setInvitedUser(!invitedUser)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              invitedUser
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'btn-sunset'
                            }`}
                          >
                            {invitedUser ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Invitation Sent!</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Invite to Team</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TEAM MANAGEMENT DEMO CARD */}
                {activeTab === 'teams' && (
                  <div className="max-w-xl mx-auto rounded-2xl p-6 relative overflow-hidden border border-white/10 space-y-4"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)' }}>
                    
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base">
                          AI
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">AI Health Predictor</h4>
                          <p className="text-xs text-gray-400">SIH Hackathon 2026 Project</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Leader
                      </span>
                    </div>

                    {/* Member Progress Bar */}
                    <div className="space-y-1.5 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-medium">Team Capacity (3 / 4 Members)</span>
                        <span className="text-emerald-400 font-bold">🟢 Recruiting 1 Dev</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[75%] rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>Required Role: <strong className="text-white">ML / Python Engineer</strong></span>
                      <span className="text-purple-400 hover:underline cursor-pointer">Manage Join Requests (2)</span>
                    </div>
                  </div>
                )}

                {/* 3. REAL-TIME CHAT DEMO */}
                {activeTab === 'chat' && (
                  <div className="max-w-xl mx-auto rounded-2xl p-5 border border-white/10 space-y-4"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    
                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      {chatList.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender}</span>
                          <div className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] ${
                            msg.isSelf
                              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-tr-none'
                              : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-gray-500 mt-0.5">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a team message (interactive)..."
                        className="input text-xs flex-1 py-2"
                      />
                      <button type="submit" className="btn-sunset p-2 rounded-xl text-white">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* 4. PROJECT SHOWCASE DEMO */}
                {activeTab === 'projects' && (
                  <div className="max-w-xl mx-auto rounded-2xl p-6 border border-white/10 space-y-4"
                    style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-400">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">Smart AgriTech IoT</h4>
                          <p className="text-xs text-gray-400">🥇 1st Prize - Hackathon 2026 Winner</p>
                        </div>
                      </div>
                      <a href="#" onClick={(e) => e.preventDefault()} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      AI-powered crop disease detection platform built using Flutter, Node.js, and PyTorch ML models.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-orange-500/15 text-orange-300 border border-orange-500/30">
                        IoT Sensor Integration
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        PyTorch ML
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Verified Student Project
                      </span>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>

    </section>
  )
}

export default InteractiveDemo
