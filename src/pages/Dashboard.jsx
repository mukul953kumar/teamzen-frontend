import React from 'react'
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
  HelpCircle,
  ArrowUpRight,
  Target,
  FileCode2,
  Inbox
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import AIMatchModal from '../components/AIMatchModal'
import StreakInfoModal from '../components/StreakInfoModal'
import HackathonWidget from '../components/HackathonWidget'
import { getAcademicStatus } from '../utils/academicUtils'

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
  // AI skill matches count
  const skillMatches = recommendedTeammates.length

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden pb-12 text-slate-100">
      
      {/* ── Developer Studio Welcome Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 p-6 sm:p-8 shadow-2xl bg-slate-950/90 backdrop-blur-2xl space-y-4">
        
        {/* Subtle Ambient Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* User Info & Avatar */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 p-0.5 shadow-xl border border-emerald-500/40">
                <div className="w-full h-full rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center font-mono">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-sm" />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap font-mono">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Welcome back, {user?.name?.split(' ')[0]} 👋
                </h1>

                {/* Streak & Zen Points Button */}
                <button
                  type="button"
                  onClick={() => setShowStreakModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30 hover:bg-amber-900/60 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Click to view Streak & Zen Points benefits"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span>{user?.loginStreak || 1}d Streak</span>
                  <span className="text-[10px] text-slate-400 font-medium">| ⚡ {user?.zenPoints || 10} Pts</span>
                  <HelpCircle className="w-3 h-3 text-amber-400 opacity-80 flex-shrink-0" />
                </button>
              </div>

              {/* Universal Student & Campus Badges */}
              {(() => {
                const academic = getAcademicStatus(user)
                return (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 font-mono">
                    <span className={`px-2.5 py-0.5 rounded border font-bold text-[11px] ${
                      academic.isPassedOut 
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' 
                        : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {user?.branch || 'CSE'} · {academic.yearDisplay}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                      🎓 {user?.college || 'KNIT Sultanpur'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 text-[11px] font-bold">
                      ⚡ {user?.domain || user?.hackathon_interests?.[0] || (user?.skills?.length > 0 ? (typeof user.skills[0] === 'string' ? user.skills[0] : user.skills[0]?.skill_name) : 'Full Stack Engineering')}
                    </span>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="flex items-center gap-3 relative z-10 font-mono">
            <Link
              to="/teammate-finder"
              className="shimmer-btn text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Teammate Finder</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Tactical Developer Control Center ── */}
      <div className="rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-950/90 relative overflow-hidden shadow-2xl space-y-5">
        
        {/* Section Header & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-4 relative z-10 font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight font-sans">Workspace Overview</h2>
              <p className="text-xs text-slate-400">Real-time team activity, messages & quick tools</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">Live Synchronized</span>
          </div>
        </div>

        {/* 4 Interactive Tactical Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10 font-mono">
          
          {/* Stat 1: Pending Join Requests */}
          <Link
            to="/teams/invitations"
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Join Requests</span>
              <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xs">
                <Inbox className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                {pendingJoinRequests}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                pendingJoinRequests > 0 ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {pendingJoinRequests > 0 ? 'Action Needed' : 'Clean'}
              </span>
            </div>
          </Link>

          {/* Stat 2: Unread Messages */}
          <Link
            to="/chat"
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Team Messages</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                {unreadMessages}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                unreadMessages > 0 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {unreadMessages > 0 ? 'New Unread' : 'Up to date'}
              </span>
            </div>
          </Link>

          {/* Stat 3: AI Skill Matches */}
          <Link
            to="/teammate-finder"
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">AI Candidates</span>
              <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 flex items-center justify-center text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                {skillMatches}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                Matched ⚡
              </span>
            </div>
          </Link>

          {/* Stat 4: Active Projects */}
          <Link
            to="/projects"
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between space-y-3 cursor-pointer shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Showcase Projects</span>
              <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 flex items-center justify-center text-xs">
                <FolderOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                {projects.length}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                Published
              </span>
            </div>
          </Link>

        </div>

        {/* Quick Launch Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 relative z-10 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/teams"
              className="px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" /> Create New Team
            </Link>

            <Link
              to="/teammate-finder"
              className="px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 text-slate-200 bg-slate-900 border border-slate-800 hover:border-emerald-500/40"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Find Teammates
            </Link>

            <Link
              to="/projects"
              className="px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 text-slate-200 bg-slate-900 border border-slate-800 hover:border-blue-500/40"
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-400" /> Manage Projects
            </Link>
          </div>

          <Link
            to="/teams/invitations"
            className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Review All Invitations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* ── Active Student Hackathons Widget ── */}
      <HackathonWidget />

      {/* ── Main Content Grid: Recent Teams & Recommended Sidebar ── */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Recent Teams Workspace */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="rounded-2xl relative overflow-hidden p-5 sm:p-6 space-y-5 border border-slate-800 bg-slate-950/90 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4 font-mono">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> Active Workspace Teams
                </h2>
                <p className="text-xs text-slate-400">Teams you own or contribute to</p>
              </div>
              <Link to="/teams" className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                <span>View All Teams</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="medium" /></div>
            ) : teams.length > 0 ? (
              <div className="space-y-4 font-mono">
                {teams.slice(0, 4).map((team) => {
                  const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
                  return (
                    <div key={team._id} className="relative group rounded-xl p-4 transition-all duration-300 overflow-hidden bg-slate-900/80 hover:bg-slate-900 border border-slate-800 space-y-3.5 shadow-lg hover:border-emerald-500/40">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {team.leader_id?.profile_image || (team.members && team.members.find(m => m.role === 'Leader')?.profile_image) ? (
                            <div className="relative flex-shrink-0" title={`Leader: ${team.leader_id?.name || 'Leader'}`}>
                              <img
                                src={team.leader_id?.profile_image || (team.members && team.members.find(m => m.role === 'Leader')?.profile_image)}
                                alt={team.team_name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] shadow-sm border border-slate-950">
                                👑
                              </div>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-base shadow-md flex-shrink-0 border border-slate-700 bg-slate-900">
                              {team.team_name?.charAt(0).toUpperCase() || 'T'}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors truncate">
                              {team.team_name}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">{team.project_title || 'Academic Project'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {team.user_role === 'Leader' && (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                              👑 Leader
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            team.status === 'Open' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' :
                            team.status === 'Full' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30' :
                            'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                          }`}>
                            {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                          </span>
                        </div>
                      </div>

                      {/* Recruitment Capacity Meter */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                            <span>Capacity: <strong className="text-white">{team.current_members || 1}</strong> / {team.max_members || 4} Members</span>
                          </span>
                          <div className="flex items-center gap-3 font-semibold">
                            <Link to={`/teams/${team._id}`} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-0.5">
                              Details <ChevronRight className="w-3 h-3" />
                            </Link>
                            {team.user_role === 'Leader' && (
                              <Link to="/chat" className="text-xs text-emerald-400 hover:text-emerald-300">
                                Chat
                              </Link>
                            )}
                          </div>
                        </div>

                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${memberPercent}%`,
                              background: memberPercent === 100
                                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                : 'linear-gradient(90deg, #f97316, #6366f1)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Skill Tags */}
                      {team.required_skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                          {team.required_skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                              {typeof skill === 'string' ? skill : skill.skill_name || skill}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <Users className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400">You have not joined or created any teams yet</p>
                <Link to="/teams" className="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 font-bold">
                  <Plus className="w-4 h-4" /> Create Your First Team
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Recommended Teammates & Timeline */}
        <div className="space-y-6 min-w-0 font-mono">
          
          {/* Recommended Teammates */}
          <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Recommended Teammates
              </h2>
              <Link to="/teammate-finder" className="text-xs font-bold text-orange-400 hover:text-orange-300">
                View All
              </Link>
            </div>

            {recommendedTeammates.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {recommendedTeammates.map((teammate, index) => (
                  <div key={teammate._id || index}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={teammate._id ? `/user/${teammate._id}` : '/teammate-finder'} className="flex items-center gap-2.5 min-w-0 flex-1 group">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-400 font-bold text-xs flex-shrink-0 border border-emerald-500/30">
                          {teammate.profile_image ? (
                            <img src={teammate.profile_image} alt={teammate.name} className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            teammate.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">{teammate.name}</h4>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <p className="text-[10px] text-slate-400 truncate">{teammate.branch} · Year {teammate.year}</p>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 shrink-0">
                              ⚡ SIH 2026 Ready
                            </span>
                          </div>
                        </div>
                      </Link>

                      {teammate.match && (
                        <button
                          type="button"
                          onClick={() => setAiMatchUser({ ...teammate, matchPercentage: parseInt(teammate.match) || 94 })}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex-shrink-0 hover:bg-emerald-900/80 transition-all cursor-pointer"
                          title="Click to view AI Compatibility Breakdown"
                        >
                          ⚡ {teammate.match}
                        </button>
                      )}
                    </div>

                    {teammate.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/60">
                        {teammate.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 text-[9px] font-semibold rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                            {typeof skill === 'string' ? skill : skill.skill_name || skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 font-mono">
                <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Add skills to get AI match suggestions</p>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Recent Activity
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Timeline</span>
            </div>

            {activityLoading ? (
              <div className="flex justify-center py-6"><LoadingSpinner size="small" /></div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4 relative pl-2">
                <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-slate-800" />
                {recentActivity.slice(0, 5).map((activity, idx) => {
                  const ActivityIcon = getActivityIcon(activity.icon)
                  return (
                    <div key={idx} className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <ActivityIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 leading-snug">{activity.title || activity.message}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{activity.timeAgo || activity.time || 'Recently'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 font-mono">
                No recent activity logged yet
              </div>
            )}
          </div>

        </div>

      </div>

      {/* AI Match Modal */}
      {aiMatchUser && (
        <AIMatchModal
          candidate={aiMatchUser}
          currentUser={user}
          onClose={() => setAiMatchUser(null)}
        />
      )}

      {/* Streak Info Benefits Modal */}
      {showStreakModal && (
        <StreakInfoModal
          user={user}
          onClose={() => setShowStreakModal(false)}
        />
      )}

    </div>
  )
}

export default Dashboard
