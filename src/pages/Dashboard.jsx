import React, { useCallback } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useNotifications } from '../contexts/NotificationContext'
import { 
  Users, 
  MessageCircle, 
  FolderOpen, 
  Trophy, 
  Clock,
  Plus,
  User,
  Bell,
  ExternalLink,
  ChevronRight,
  Sparkles,
  UserCheck,
  Flame,
  Zap,
  HelpCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import AIMatchModal from '../components/AIMatchModal'
import StreakInfoModal from '../components/StreakInfoModal'

const getActivityIcon = (iconName) => {
  switch (iconName) {
    case 'Users': return Users
    case 'MessageCircle': return MessageCircle
    case 'FolderOpen': return FolderOpen
    case 'Trophy': return Trophy
    default: return Clock
  }
}

const Dashboard = () => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const [aiMatchUser, setAiMatchUser] = React.useState(null)
  const [showStreakModal, setShowStreakModal] = React.useState(false)

  const { data: dashboardData, isLoading } = useQuery(
    'dashboard',
    async () => {
      if (!user?._id) return { teams: [], projects: [], conversations: [] }
      try {
        const [teamsRes, projectsRes, messagesRes] = await Promise.all([
          api.get('/teams/my-teams'),
          api.get(`/projects/user/${user._id}`),
          api.get('/chat/conversations')
        ])
        return {
          teams: teamsRes.data.data?.teams || [],
          projects: projectsRes.data.data?.projects || [],
          conversations: messagesRes.data.data?.conversations || []
        }
      } catch {
        return { teams: [], projects: [], conversations: [] }
      }
    },
    { enabled: !!user?._id, retry: false, refetchOnWindowFocus: true, cacheTime: 0, staleTime: 0 }
  )

  const { data: recommendedData } = useQuery(
    'recommendedTeammates',
    async () => {
      try {
        const response = await api.get('/users/recommended-teammates')
        return response.data.data || { recommendedTeammates: [] }
      } catch {
        return { recommendedTeammates: [] }
      }
    },
    { enabled: !!user?._id, retry: false, refetchOnWindowFocus: true, cacheTime: 0, staleTime: 0 }
  )

  const { data: activityData, isLoading: activityLoading } = useQuery(
    'recentActivity',
    async () => {
      if (!user?._id) return { activities: [] }
      try {
        const response = await api.get('/auth/recent-activity')
        return response.data.data || { activities: [] }
      } catch {
        return { activities: [] }
      }
    },
    { enabled: !!user?._id }
  )

  const teams = dashboardData?.teams || []
  const projects = dashboardData?.projects || []
  const conversations = dashboardData?.conversations || []
  const recommendedTeammates = recommendedData?.recommendedTeammates || []
  const recentActivity = activityData?.activities || []

  // Pending join requests across all my teams
  const pendingJoinRequests = teams.reduce((acc, team) => acc + (team.pending_requests || 0), 0)
  // Unread messages count
  const unreadMessages = conversations.filter(c => c.unread_count > 0).length
  // AI skill matches = recommended teammates count
  const skillMatches = recommendedTeammates.length

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* ── Premium Dashboard Header ── */}
      <div className="relative rounded-2xl overflow-hidden mb-2">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-60"
          style={{
            background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 8s ease infinite'
          }}
        />
        {/* Subtle top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }}
        />

        <div className="relative z-10 flex items-center justify-between px-5 py-4 gap-4">
          {/* Left — Avatar + Greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base md:text-lg font-semibold text-white leading-tight truncate">
                  Welcome, {user?.name?.split(' ')[0]} 👋
                </h1>
                {/* Streak & Zen Points Button */}
                <button
                  type="button"
                  onClick={() => setShowStreakModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-orange-400 border border-orange-500/30 hover:bg-amber-500/25 transition-all cursor-pointer shadow-sm"
                  title="Click to view Streak & Zen Points benefits"
                >
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400 flex-shrink-0" />
                  <span>{user?.loginStreak || 1}d Streak</span>
                  <span className="text-[10px] text-gray-400 ml-0.5 font-normal">| ⚡ {user?.zenPoints || 10} Pts</span>
                  <HelpCircle className="w-3 h-3 text-orange-400 ml-0.5 opacity-80 flex-shrink-0" />
                </button>
              </div>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {user?.branch} · Year {user?.year} · {user?.college}
              </p>
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification Bell */}
            <Link
              to="/teams/invitations"
              className="relative p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            {/* Edit Profile */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </Link>

            {/* Mobile profile icon */}
            <Link to="/profile" className="sm:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-200">
              <User className="w-5 h-5 text-gray-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Workspace Overview ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>

        {/* Animated gradient background — same as header */}
        <div className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 8s ease infinite'
          }}
        />
        {/* Top shimmer border — same as header */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }}
        />

        {/* Section header */}
        <div className="relative z-10 px-5 pt-5 pb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Workspace Overview</span>
        </div>

        {/* Row 1 — Pending Join Requests */}
        <Link to="/teams/invitations"
          className="relative z-10 flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors duration-200 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <UserCheck className="w-4 h-4" style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-tight">Pending Join Requests</p>
            <p className="text-xs text-gray-500 mt-0.5">Students want to join your teams.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>
              {pendingJoinRequests}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </Link>

        {/* Divider */}
        <div className="relative z-10 mx-5 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Row 2 — Unread Messages */}
        <Link to="/chat"
          className="relative z-10 flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors duration-200 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.22)' }}>
            <MessageCircle className="w-4 h-4" style={{ color: '#6ee7b7' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-tight">Unread Messages</p>
            <p className="text-xs text-gray-500 mt-0.5">Open your messages to respond.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold flex items-center justify-center"
              style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' }}>
              {unreadMessages}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </Link>

        {/* Divider */}
        <div className="relative z-10 mx-5 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Row 3 — AI Skill Matches */}
        <Link to="/teammate-finder"
          className="relative z-10 flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors duration-200 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.22)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#fdba74' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-tight">AI Skill Matches</p>
            <p className="text-xs text-gray-500 mt-0.5">Students match your skills.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold flex items-center justify-center"
              style={{ background: 'rgba(251,146,60,0.15)', color: '#fdba74' }}>
              {skillMatches}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        </Link>

        {/* Divider */}
        <div className="relative z-10 mx-5 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Row 4 — Projects */}
        <div className="relative z-10 flex items-center gap-4 px-5 py-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)' }}>
            <FolderOpen className="w-4 h-4" style={{ color: '#93c5fd' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-tight">Projects</p>
            <p className="text-xs text-gray-500 mt-0.5">Create or join a project.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/achievements"
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' }}>
              Browse
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>

      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Create Team */}
        <Link to="/teams"
          className="group relative flex items-center gap-3 px-4 py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none"
            style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
          <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">Create Team</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">Start a new team</p>
          </div>
        </Link>

        {/* Find Teammates */}
        <Link to="/teammate-finder"
          className="group relative flex items-center gap-3 px-4 py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none"
            style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
          <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #f97316)' }}>
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">Find Teammates</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">Discover matches</p>
          </div>
        </Link>

      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Left - Recent Teams */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-8 min-w-0">

          {/* Recent Teams */}
          <div className="card relative overflow-hidden p-4 sm:p-6">
            <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl"
              style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
            <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 min-w-0">
                <Users className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="truncate">Recent Teams</span>
              </h2>
              <Link to="/teams" className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm font-medium flex items-center gap-1 flex-shrink-0">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="relative z-10">
            {isLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="medium" /></div>
            ) : teams.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {teams.slice(0, 3).map((team) => {
                  const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
                  return (
                    <div key={team._id} className="relative group rounded-xl p-3.5 sm:p-4 transition-all duration-300 overflow-hidden"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                      {/* Top Accent Gradient Line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #f97316)' }} />
                      
                      {/* Hover Ambient Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />

                      <div className="relative z-10 space-y-3">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {team.leader_id?.profile_image || (team.members && team.members.find(m => m.role === 'Leader')?.profile_image) ? (
                              <div className="relative flex-shrink-0" title={`Leader: ${team.leader_id?.name || 'Leader'}`}>
                                <img
                                  src={team.leader_id?.profile_image || (team.members && team.members.find(m => m.role === 'Leader')?.profile_image)}
                                  alt={team.team_name}
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/20 shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] shadow-sm border border-black/40">
                                  👑
                                </div>
                              </div>
                            ) : (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm flex-shrink-0 border border-white/10"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                {team.team_name?.charAt(0).toUpperCase() || 'T'}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-primary-300 transition-colors break-words leading-tight">
                                {team.team_name}
                              </h3>
                              <p className="text-xs text-gray-400 truncate">{team.project_title || 'Project'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap flex-shrink-0">
                            {team.user_role === 'Leader' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                👑 Leader
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              team.status === 'Open' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
                              team.status === 'Full' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            }`}>
                              {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                            </span>
                          </div>
                        </div>

                        {/* Members Capacity Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="text-gray-400 flex items-center gap-1 min-w-0">
                              <Users className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                              <span className="font-medium text-white truncate"><span className="text-white font-medium">{team.current_members || 1}</span> / {team.max_members || 4} Members</span>
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Link to={`/teams/${team._id}`} className="text-xs font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-0.5">
                                Details <ChevronRight className="w-3 h-3" />
                              </Link>
                              {team.user_role === 'Leader' && (
                                <Link to="/chat" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                                  Chat
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${memberPercent}%`,
                                background: memberPercent === 100
                                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                  : 'linear-gradient(90deg, #6366f1, #3b82f6)'
                              }}
                            />
                          </div>
                        </div>

                        {/* Skills */}
                        {team.required_skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                            {team.required_skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md truncate max-w-[110px]"
                                style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                                {typeof skill === 'string' ? skill : skill.skill_name || skill}
                              </span>
                            ))}
                            {team.required_skills.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md text-gray-400 bg-white/5 border border-white/10 flex-shrink-0">
                                +{team.required_skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No teams yet</p>
                <Link to="/teams" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Team
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-8 min-w-0">

          {/* Recommended Teammates */}
          <div className="card no-horizontal-scroll relative overflow-hidden">
            <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl"
              style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
            <div className="relative z-10 flex items-center justify-between mb-6 gap-2">
              <h2 className="text-base md:text-xl font-semibold text-white">Recommended</h2>
              <Link to="/teammate-finder" className="text-primary-400 hover:text-primary-300 text-xs md:text-sm font-medium flex items-center gap-1 flex-shrink-0">
                Find More <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="relative z-10">
            {recommendedTeammates.length > 0 ? (
              <div className="space-y-3 lg:max-h-96 lg:overflow-y-auto pr-1 custom-scrollbar">
                {recommendedTeammates.map((teammate, index) => (
                  <Link key={teammate._id || index} to={teammate._id ? `/user/${teammate._id}` : '/teammate-finder'}
                    className="block group relative rounded-xl p-3.5 transition-all duration-300 overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                      style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />

                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />

                    <div className="relative z-10 flex items-start gap-3">
                      {/* Avatar with Glow Ring */}
                      <div className="relative flex-shrink-0">
                        {teammate.profile_image ? (
                          <img src={teammate.profile_image} alt={teammate.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-400/50 border border-blue-400/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ring-2 ring-blue-400/50"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                            {teammate.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h3 className="font-bold text-white text-sm group-hover:text-primary-300 transition-colors truncate">
                            {teammate.name}
                          </h3>
                          {teammate.match && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setAiMatchUser({ ...teammate, matchPercentage: parseInt(teammate.match) || 94 })
                              }}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30 flex-shrink-0 hover:bg-green-500/30 transition-all cursor-pointer"
                              title="Click to view AI Compatibility Breakdown"
                            >
                              ⚡ {teammate.match}
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 truncate">{teammate.college || 'KNIT Sultanpur'}</p>
                        <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                          {teammate.branch} · Year {teammate.year}
                        </p>

                        {/* Skill Pills */}
                        {teammate.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {teammate.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-md"
                                style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                                {typeof skill === 'string' ? skill : skill.skill_name || skill}
                              </span>
                            ))}
                            {teammate.skills.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md text-gray-400 bg-white/5 border border-white/10">
                                +{teammate.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No recommendations yet</p>
                <p className="text-sm text-gray-500">Add skills to your profile for better matches</p>
              </div>
            )}
            </div>
          </div>

          {/* Recent Activity — Timeline */}
          <div className="card no-horizontal-scroll relative overflow-hidden">
            <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl"
              style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
            <div className="relative z-10 flex items-center justify-between mb-5">
              <h2 className="text-base md:text-lg font-semibold text-white">Recent Activity</h2>
              <span className="text-xs text-gray-600 uppercase tracking-widest">Timeline</span>
            </div>
            <div className="relative z-10">
            {activityLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="small" /></div>
            ) : recentActivity.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))' }} />

                <div className="space-y-5">
                  {recentActivity.map((activity, index) => {
                    const colors = [
                      { dot: '#a78bfa', glow: 'rgba(139,92,246,0.4)' },
                      { dot: '#60a5fa', glow: 'rgba(59,130,246,0.4)' },
                      { dot: '#34d399', glow: 'rgba(52,211,153,0.4)' },
                      { dot: '#fb923c', glow: 'rgba(251,146,60,0.4)' },
                      { dot: '#f472b6', glow: 'rgba(244,114,182,0.4)' },
                    ]
                    const c = colors[index % colors.length]
                    return (
                      <div key={index} className="flex items-start gap-4 pl-1">
                        {/* Dot */}
                        <div className="relative flex-shrink-0 mt-1.5">
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-black"
                            style={{ backgroundColor: c.dot, boxShadow: `0 0 6px ${c.glow}` }} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          <p className="text-sm text-gray-200 leading-snug">{activity.message}</p>
                          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-8 h-8 rounded-full mx-auto mb-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                <p className="text-gray-500 text-sm">No activity yet</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Match Breakdown Modal */}
      <AIMatchModal
        isOpen={!!aiMatchUser}
        onClose={() => setAiMatchUser(null)}
        candidate={aiMatchUser}
        currentUser={user}
      />

      {/* Daily Streak & Zen Points Info Modal */}
      <StreakInfoModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        user={user}
      />
    </div>
  )
}

export default Dashboard
