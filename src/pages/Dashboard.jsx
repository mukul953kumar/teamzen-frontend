import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { 
  Users, 
  MessageCircle, 
  FolderOpen, 
  Trophy, 
  TrendingUp,
  Clock,
  Search,
  Plus,
  User,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'

const Dashboard = () => {
  const { user } = useAuth()
  const { actionNotifications, unreadCount, markAsRead } = useNotifications()
  
  // Debug notifications
  console.log('Dashboard - Action Notifications:', actionNotifications)
  console.log('Dashboard - Unread Count:', unreadCount)

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch: refetchDashboard } = useQuery(
    'dashboard',
    async () => {
      if (!user || !user._id) {
        return {
          teams: [],
          projects: [],
          conversations: []
        }
      }
      
      try {
        // Test individual API calls
        console.log('Testing individual APIs...')
        
        const teamsRes = await api.get('/teams/my-teams')
        console.log('Teams API Response:', teamsRes.data)
        
        const projectsRes = await api.get(`/projects/user/${user._id}`)
        console.log('Projects API Response:', projectsRes.data)
        
        const messagesRes = await api.get('/chat/conversations')
        console.log('Messages API Response:', messagesRes.data)
        
        return {
          teams: teamsRes.data.data?.teams || [],
          projects: projectsRes.data.data?.projects || [],
          conversations: messagesRes.data.data?.conversations || []
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error)
        return {
          teams: [],
          projects: [],
          conversations: []
        }
      }
    },
    { 
      enabled: !!user && !!user._id,
      retry: false,
      refetchOnWindowFocus: true,
      cacheTime: 0, // Disable caching
      staleTime: 0 // Always refetch
    }
  )

  // Fetch recommended teammates
  const { data: recommendedData, refetch: refetchTeammates } = useQuery(
    'recommendedTeammates',
    async () => {
      try {
        const response = await api.get('/users/recommended-teammates')
        console.log('Recommended Teammates API Response:', response.data)
        return response.data.data || { recommendedTeammates: [] }
      } catch (error) {
        console.error('Recommended teammates error:', error)
        return { recommendedTeammates: [] }
      }
    },
    { 
      enabled: !!user && !!user._id,
      retry: false,
      refetchOnWindowFocus: true,
      cacheTime: 0,
      staleTime: 0
    }
  )

  // Fetch recent activity
  const { data: activityData, isLoading: activityLoading } = useQuery(
    'recentActivity',
    async () => {
      if (!user || !user._id) {
        return { activities: [] }
      }
      
      try {
        const response = await api.get('/auth/recent-activity')
        return response.data.data || { activities: [] }
      } catch (error) {
        console.error('Recent activity error:', error)
        return { activities: [] }
      }
    },
    {
      enabled: !!user && !!user._id
    }
  )

  const conversations = dashboardData?.conversations || []
  const teams = dashboardData?.teams || []
  const projects = dashboardData?.projects || []

  // Debug logging
  console.log('Dashboard Data:', dashboardData)
  console.log('Projects:', projects)
  console.log('Teams:', teams)

  // Temporary hardcoded test data
  const testProjects = [
    {
      _id: 'test1',
      title: 'Test Project',
      description: 'This is a test project',
      tech_stack: ['React', 'Node.js'],
      year: 2024
    }
  ]

  // Stats for dashboard
  const stats = [
    {
      title: 'My Teams',
      value: teams.length,
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      link: '/teams'
    },
    {
      title: 'Messages',
      value: conversations.length,
      color: 'from-green-500 to-emerald-500',
      icon: MessageCircle,
      link: '/chat'
    },
    {
      title: 'Profile',
      value: '100%',
      color: 'from-purple-500 to-pink-500',
      icon: User,
      link: '/profile'
    },
    {
      title: 'Teams Available',
      value: '12+',
      color: 'from-orange-500 to-red-500',
      icon: Users,
      link: '/teams'
    }
  ]

  const recommendedTeammates = recommendedData?.recommendedTeammates || []
  const recentActivity = activityData?.activities || []
  
  // Debug logging
  console.log('Recommended Data:', recommendedData)
  console.log('Recommended Teammates:', recommendedTeammates)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your teams and projects today.
          </p>
        </div>
        <button
          onClick={() => {
            refetchDashboard()
            refetchTeammates()
          }}
          className="btn-secondary flex items-center"
          title="Refresh dashboard"
        >
          <Search className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} to={stat.link} className="card card-hover group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                {stat.title}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Teams */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">My Teams</h2>
              <Link 
                to="/teams" 
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {dashboardData?.teams?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.teams.slice(0, 3).map((team) => (
                  <div key={team._id} className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{team.team_name}</h3>
                        <p className="text-sm text-gray-400">{team.project_title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {team.current_members}/{team.max_members} members
                      </div>
                      <div className="text-xs text-primary-400">
                        {team.user_role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No teams yet</p>
                <Link to="/teams" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Link>
              </div>
            )}
          </div>

          {/* Recent Teams */}
          <div className="card mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Teams</h2>
              <Link 
                to="/teams" 
                className="text-primary-400 hover:text-primary-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {dashboardData?.teams?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.teams.slice(0, 3).map((team) => (
                  <div key={team._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors border border-primary-400/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-white">{team.team_name}</h3>
                          {team.user_role === 'Leader' && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              Leader
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{team.project_title}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {team.current_members}/{team.max_members} members
                          </span>
                          <span className={`px-2 py-1 rounded-full ${
                            team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                            team.status === 'Full' ? 'bg-red-400/20 text-red-400' :
                            'bg-blue-400/20 text-blue-400'
                          }`}>
                            {team.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Link 
                          to={`/teams/${team._id}`}
                          className="text-primary-400 hover:text-primary-300 text-xs"
                        >
                          View Details
                        </Link>
                        {team.user_role === 'Leader' && (
                          <Link 
                            to={`/chat`}
                            className="text-green-400 hover:text-green-300 text-xs"
                          >
                            Manage Team
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* Team Skills Preview */}
                    {team.required_skills && team.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/10">
                        {team.required_skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                            {skill.skill_name || skill}
                          </span>
                        ))}
                        {team.required_skills.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
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
                <Link to="/teams" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="card border-l-4 border-orange-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold text-white">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-orange-400 text-white text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h2>
              </div>
            </div>
            
            {actionNotifications.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {actionNotifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className="p-3 rounded-lg bg-orange-400/10 border border-orange-400/30 hover:bg-orange-400/20 transition-colors"
                  >
                    <p className="text-sm text-white font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        to={notification.action_url || '/notifications'}
                        onClick={() => markAsRead(notification._id)}
                        className="flex-1 text-center px-3 py-2 bg-orange-400 text-white text-xs rounded-lg hover:bg-orange-500 transition-colors"
                      >
                        Take Action
                      </Link>
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Team invites will appear here
                </p>
              </div>
            )}
          </div>

          {/* Recommended Teammates */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recommended Teammates</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => refetchTeammates()}
                  className="text-gray-400 hover:text-white"
                  title="Refresh recommendations"
                >
                  <Search className="w-4 h-4" />
                </button>
                <Link 
                  to="/teammate-finder" 
                  className="text-primary-400 hover:text-primary-300"
                >
                  <Search className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {recommendedTeammates.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {recommendedTeammates.map((teammate, index) => (
                  <div key={teammate._id || index} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                        {teammate.profile_image ? (
                          <img
                            src={teammate.profile_image}
                            alt={teammate.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          teammate.avatar
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{teammate.name}</h3>
                        <p className="text-sm text-gray-400">{teammate.college}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{teammate.branch} • {teammate.year}yr</span>
                          <span className="text-xs text-primary-400 font-medium">{teammate.match} match</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teammate.skills.slice(0, 2).map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {teammate.skills.length > 2 && (
                            <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                              +{teammate.skills.length - 2}
                            </span>
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
                <p className="text-gray-400 mb-4">No recommended teammates found</p>
                <p className="text-sm text-gray-500">Add more skills to your profile to get better recommendations</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
            
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="small" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  // Map icon strings to actual components
                  const getIcon = (iconName) => {
                    switch (iconName) {
                      case 'Users': return Users
                      case 'MessageCircle': return MessageCircle
                      case 'FolderOpen': return FolderOpen
                      case 'Trophy': return Trophy
                      default: return Clock
                    }
                  }
                  
                  const Icon = getIcon(activity.icon)
                  
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300">{activity.message}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No recent activity</p>
                <p className="text-sm text-gray-500">Start by joining teams or creating projects!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
