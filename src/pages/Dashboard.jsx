import React, { useCallback } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
  XCircle,
  ExternalLink,
  Search
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
  const { actionNotifications, unreadCount, markAsRead } = useNotifications()

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

  const stats = [
    { title: 'My Teams', value: teams.length, color: 'from-blue-500 to-cyan-500', icon: Users, link: '/teams' },
    { title: 'Projects', value: projects.length, color: 'from-violet-500 to-purple-500', icon: FolderOpen, link: '/projects' },
    { title: 'Messages', value: conversations.length, color: 'from-green-500 to-emerald-500', icon: MessageCircle, link: '/chat' },
    { title: 'Find Teammates', value: '→', color: 'from-orange-500 to-red-500', icon: Search, link: '/teammate-finder' },
  ]

  return (
    <div className="space-y-8">
      {/* Header with avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-400">
              {user?.college} • {user?.branch} • Year {user?.year}
            </p>
          </div>
        </div>
        <Link to="/profile" className="btn-secondary hidden md:flex items-center gap-2">
          <User className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} to={stat.link} className="card card-hover group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors text-sm">
                {stat.title}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left - Recent Teams + Projects */}
        <div className="lg:col-span-2 space-y-8">

          {/* Recent Teams */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" /> Recent Teams
              </h2>
              <Link to="/teams" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="medium" /></div>
            ) : teams.length > 0 ? (
              <div className="space-y-4">
                {teams.slice(0, 3).map((team) => (
                  <div key={team._id} className="p-4 rounded-xl glass-3d hover:border-white/20 transition-all duration-300 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{team.team_name}</h3>
                          {team.user_role === 'Leader' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Leader</span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                            team.status === 'Full' ? 'bg-red-400/20 text-red-400' :
                            'bg-blue-400/20 text-blue-400'
                          }`}>{team.status}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{team.project_title}</p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {team.current_members}/{team.max_members} members
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Link to={`/teams/${team._id}`} className="text-primary-400 hover:text-primary-300 text-xs">
                          View Details
                        </Link>
                        {team.user_role === 'Leader' && (
                          <Link to="/chat" className="text-green-400 hover:text-green-300 text-xs">
                            Team Chat
                          </Link>
                        )}
                      </div>
                    </div>
                    {team.required_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-3 border-t border-white/10">
                        {team.required_skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded">
                            {skill.skill_name || skill}
                          </span>
                        ))}
                        {team.required_skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                            +{team.required_skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
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

          {/* Recent Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-400" /> Recent Projects
              </h2>
              <Link to="/projects" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="medium" /></div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project._id} className="p-4 rounded-xl glass-3d hover:border-white/20 transition-all duration-300 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white">{project.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        project.status === 'Completed' ? 'bg-green-400/20 text-green-400' :
                        project.status === 'In Progress' ? 'bg-blue-400/20 text-blue-400' :
                        'bg-gray-400/20 text-gray-400'
                      }`}>{project.status || 'Active'}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                    {project.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 4).map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-400/10 text-purple-300 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                            +{project.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No projects yet</p>
                <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Notifications */}
          <div className="card border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-400 text-white text-xs rounded-full">{unreadCount}</span>
              )}
            </div>

            {actionNotifications.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {actionNotifications.map((notification) => (
                  <div key={notification._id} className="p-3 rounded-lg glass-3d border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                      </div>
                      <button onClick={() => markAsRead(notification._id)} className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    {notification.action_required && (
                      <div className="mt-2">
                        <Link
                          to={notification.action_url || '/teams/invitations'}
                          onClick={() => markAsRead(notification._id)}
                          className="text-xs px-3 py-1.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors inline-block"
                        >
                          Take Action
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No new notifications</p>
              </div>
            )}
          </div>

          {/* Recommended Teammates */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recommended</h2>
              <Link to="/teammate-finder" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                Find More <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {recommendedTeammates.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {recommendedTeammates.map((teammate, index) => (
                  <div key={teammate._id || index} className="p-4 rounded-xl glass-3d hover:border-white/20 transition-all duration-300 border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden flex-shrink-0">
                        {teammate.profile_image ? (
                          <img src={teammate.profile_image} alt={teammate.name} className="w-full h-full object-cover" />
                        ) : (
                          teammate.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">{teammate.name}</h3>
                          <span className="text-xs text-primary-400 font-medium ml-1 flex-shrink-0">{teammate.match}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{teammate.college}</p>
                        <p className="text-xs text-gray-500">{teammate.branch} • Year {teammate.year}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teammate.skills?.slice(0, 2).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded">{skill}</span>
                          ))}
                          {teammate.skills?.length > 2 && (
                            <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">+{teammate.skills.length - 2}</span>
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

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Recent Activity
            </h2>

            {activityLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner size="small" /></div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.icon)
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300">{activity.message}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />{activity.time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No recent activity</p>
                <p className="text-sm text-gray-500">Join teams or create projects to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
