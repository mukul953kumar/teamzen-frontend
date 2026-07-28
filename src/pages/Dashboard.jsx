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
  UserCheck
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'

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

            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-semibold text-white leading-tight truncate">
                Welcome, {user?.name?.split(' ')[0]} 👋
              </h1>
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
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl"
              style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
            <div className="relative z-10 flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" /> Recent Teams
              </h2>
              <Link to="/teams" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="relative z-10">
            {isLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="medium" /></div>
            ) : teams.length > 0 ? (
              <div className="space-y-4">
                {teams.slice(0, 3).map((team) => (
                  <div key={team._id} className="p-3 md:p-4 rounded-xl glass-3d hover:border-white/20 transition-all duration-300 border border-white/10 no-horizontal-scroll">
                    <div className="space-y-3">
                      {/* Title and badges */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-white text-sm md:text-base flex-1">{team.team_name}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          {team.user_role === 'Leader' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full whitespace-nowrap">Leader</span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                            team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                            team.status === 'Full' ? 'bg-red-400/20 text-red-400' :
                            'bg-blue-400/20 text-blue-400'
                          }`}>{team.status}</span>
                        </div>
                      </div>
                      
                      {/* Project title */}
                      <p className="text-xs md:text-sm text-gray-400">{team.project_title}</p>
                      
                      {/* Members and actions */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3 flex-shrink-0" /> {team.current_members}/{team.max_members}
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                          <Link to={`/teams/${team._id}`} className="text-primary-400 hover:text-primary-300 text-xs whitespace-nowrap">
                            View
                          </Link>
                          {team.user_role === 'Leader' && (
                            <Link to="/chat" className="text-green-400 hover:text-green-300 text-xs whitespace-nowrap">
                              Chat
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {/* Skills */}
                      {team.required_skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
                          {team.required_skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded whitespace-nowrap">
                              {skill.skill_name || skill}
                            </span>
                          ))}
                          {team.required_skills.length > 4 && (
                            <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded whitespace-nowrap">
                              +{team.required_skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
              <div className="space-y-4 lg:max-h-96 lg:overflow-y-auto pr-2 custom-scrollbar">
                {recommendedTeammates.map((teammate, index) => (
                  <div key={teammate._id || index} className="p-3 md:p-4 rounded-xl glass-3d hover:border-white/20 transition-all duration-300 border border-white/10 no-horizontal-scroll">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden flex-shrink-0">
                        {teammate.profile_image ? (
                          <img src={teammate.profile_image} alt={teammate.name} className="w-full h-full object-cover" />
                        ) : (
                          teammate.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-medium text-white text-sm md:text-base flex-1">{teammate.name}</h3>
                          <span className="text-xs text-primary-400 font-medium flex-shrink-0">{teammate.match}</span>
                        </div>
                        <p className="text-xs text-gray-400">{teammate.college}</p>
                        <p className="text-xs text-gray-500">{teammate.branch} • Year {teammate.year}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teammate.skills?.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded">{skill}</span>
                          ))}
                          {teammate.skills?.length > 3 && (
                            <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">+{teammate.skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
    </div>
  )
}

export default Dashboard
