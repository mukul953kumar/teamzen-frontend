import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  MapPin,
  Code,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  UserPlus,
  X,
  Crown
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'

const Teams = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({})
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Fetch all teams
  const { data: teamsData, isLoading, refetch } = useQuery(
    'teams',
    () => api.get('/teams').then(res => res.data),
    { retry: false }
  )

  // Fetch user's teams
  const { data: myTeamsData } = useQuery(
    'myTeams',
    () => api.get('/teams/my-teams').then(res => res.data),
    { retry: false }
  )

  // Fetch user's pending join requests
  const { data: myRequestsData, error: requestsError } = useQuery(
    'myRequests',
    async () => {
      console.log('Fetching my requests...')
      const response = await api.get('/teams/my-requests')
      console.log('My requests response:', response.data)
      return response.data
    },
    { retry: false, enabled: !!user }
  )

  const createTeamMutation = useMutation(
    (teamData) => api.post('/teams/create-team', teamData),
    {
      onSuccess: () => {
        toast.success('Team created successfully!')
        setShowCreateModal(false)
        reset()
        queryClient.invalidateQueries('teams')
        queryClient.invalidateQueries('myTeams')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create team')
      }
    }
  )

  // Join team mutation
  const joinTeamMutation = useMutation(
    (teamId) => api.post(`/teams/${teamId}/join-request`),
    {
      onSuccess: () => {
        toast.success('Join request sent successfully!')
        queryClient.invalidateQueries('teams')
        queryClient.invalidateQueries('myTeams')
        queryClient.invalidateQueries('myRequests')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send join request')
      }
    }
  )

  // Delete team mutation
  const deleteTeamMutation = useMutation(
    (teamId) => api.delete(`/teams/${teamId}`),
    {
      onSuccess: () => {
        toast.success('Team deleted successfully!')
        queryClient.invalidateQueries('teams')
        queryClient.invalidateQueries('myTeams')
        queryClient.invalidateQueries('conversations') // Refresh chat conversations
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete team')
      }
    }
  )

  const onSearch = (data) => {
    setFilters(data)
    refetch()
  }

  const clearFilters = () => {
    reset()
    setFilters({})
    refetch()
  }

  const handleCreateTeam = (data) => {
    // Process required_skills from string to array
    const processedData = {
      ...data,
      required_skills: data.required_skills 
        ? data.required_skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : []
    }
    createTeamMutation.mutate(processedData)
  }

  const handleJoinTeam = (teamId) => {
    if (!user) {
      toast.error('Please login to join a team')
      navigate('/login')
      return
    }
    joinTeamMutation.mutate(teamId)
  }

  const handleDeleteTeam = (teamId, teamName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Delete "{teamName}"? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => { deleteTeamMutation.mutate(teamId); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Cancel</button>
          </div>
        </div>
      ),
      { duration: 10000 }
    )
  }

  const getDeadlineBadge = (deadline) => {
    if (!deadline) return null
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const target = new Date(deadline)
    target.setHours(23, 59, 59, 999)

    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffTime < 0) {
      return (
        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 shadow-sm">
          <XCircle className="w-3 h-3 text-red-400" />
          Closed
        </span>
      )
    }

    if (diffDays <= 1) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse flex items-center gap-1 shadow-md shadow-rose-500/20">
          <Clock className="w-3 h-3 text-rose-400 flex-shrink-0 animate-bounce" />
          🔥 Closes Today!
        </span>
      )
    }

    if (diffDays <= 3) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1 shadow-md shadow-amber-500/15">
          <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
          ⚡ {diffDays} Days Left!
        </span>
      )
    }

    return (
      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
        <Calendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
        {diffDays}d left ({target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
      </span>
    )
  }

  const teams = teamsData?.data?.teams || []
  const myTeams = myTeamsData?.data?.teams || []
  const myRequests = myRequestsData?.data?.joinRequests || []

  console.log('Teams Page Debug:', {
    myRequestsData,
    myRequests,
    myRequestsLength: myRequests.length,
    requestsError,
    user
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Teams</h1>
          <p className="text-xs sm:text-sm text-gray-400">Find and join teams for your projects and hackathons</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Team
        </button>
      </div>

      {/* My Teams Section */}
      {myTeams.length > 0 && (
        <div className="card relative overflow-hidden p-4 sm:p-6">
          <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
          <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">My Teams</h2>
            <span className="text-xs sm:text-sm text-gray-400">{myTeams.length} teams</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {myTeams.map((team) => {
              const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
              return (
                <div key={team._id} className="relative group">
                  <Link to={`/teams/${team._id}`} className="block">
                    <div className="relative rounded-2xl p-4 sm:p-6 transition-all duration-300 overflow-hidden"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}>
                      
                      {/* Top Accent Gradient Line */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #f97316)' }} />
                      
                      {/* Hover Ambient Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2.5 mb-4">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                              {team.team_name?.charAt(0).toUpperCase() || 'T'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-primary-300 transition-colors truncate">
                                {team.team_name}
                              </h3>
                              <p className="text-xs text-gray-400 truncate font-medium">{team.project_title || 'Project'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {(team.user_role === 'Leader' || team.user_role === 'leader') && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold"
                                style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                <span>Leader</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                          {team.description || 'No description provided.'}
                        </p>

                        {/* Capacity Progress Bar */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="text-gray-400 flex items-center gap-1 min-w-0">
                              <Users className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                              <span className="font-medium text-white truncate">{team.current_members || 1} / {team.max_members || 4} Members</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold flex-shrink-0 ${
                              team.status === 'Open' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
                              team.status === 'Full' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            }`}>
                              {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Team Full' : team.status}
                            </span>
                          </div>

                          {/* Progress Track */}
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

                      </div>
                    </div>
                  </Link>

                  {/* Delete button for team leaders */}
                  {(team.user_role === 'Leader' || team.user_role === 'leader') && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteTeam(team._id, team.team_name)
                      }}
                      className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg z-10"
                      title="Delete team"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pending Requests Section */}
      {myRequests.filter(r => r.status === 'Pending').length > 0 && (
        <div className="card relative overflow-hidden p-4 sm:p-6">
          <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
          <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <span>Pending Join Requests</span>
            </h2>
            <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">{myRequests.filter(r => r.status === 'Pending').length} pending</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {myRequests.filter(r => r.status === 'Pending').map((request) => {
              const team = request.team_id
              if (!team) return null
              
              return (
                <div key={request._id} className="relative group">
                  <Link to={`/teams/${team._id}`} className="block">
                    <div className="glass-3d rounded-2xl hover:border-white/20 transition-all duration-300 border border-white/10 p-4 sm:p-6">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors truncate">
                              {team.team_name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 truncate">{team.project_title}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'Pending' ? 'bg-orange-400/20 text-orange-400' :
                              request.status === 'Accepted' ? 'bg-green-400/20 text-green-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      
                        <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2">{team.description}</p>
                      
                        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400 text-xs truncate">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                            team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                            team.status === 'Full' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-blue-400/20 text-blue-400'
                          }`}>
                            {team.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Teams Section */}
      <div className="card relative overflow-hidden p-4 sm:p-6">
        <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
        <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">All Teams</h2>
          <span className="text-xs sm:text-sm text-gray-400">{teams.length} teams available</span>
        </div>
        <div className="relative z-10">
        {/* Search Bar */}
        <form onSubmit={handleSubmit(onSearch)} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input pl-12 w-full"
                placeholder="Search teams..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center justify-center px-6 w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </form>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => {
              const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
              return (
                <div key={team._id} className="relative group rounded-2xl p-4 sm:p-6 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}>

                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }} />

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />

                  <div className="relative z-10">
                    {/* Header Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {team.leader_id?.profile_image ? (
                          <div className="relative flex-shrink-0" title={`Leader: ${team.leader_id?.name || 'Team Leader'}`}>
                            <img
                              src={team.leader_id.profile_image}
                              alt={team.leader_id?.name || team.team_name}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/20 shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500/90 flex items-center justify-center text-[9px] shadow-sm border border-black/40">
                              👑
                            </div>
                          </div>
                        ) : (
                          <div
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md flex-shrink-0 border border-white/10"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                            title={`Leader: ${team.leader_id?.name || 'Team Leader'}`}
                          >
                            {team.team_name?.charAt(0).toUpperCase() || 'T'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-primary-300 transition-colors break-words leading-snug">
                            {team.team_name}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{team.project_title || 'Project'}</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold flex-shrink-0 ${
                        team.status === 'Open' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
                        team.status === 'Full' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}>
                        {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                      </span>
                    </div>

                    {/* Deadline Badge Bar */}
                    {team.deadline && (
                      <div className="mb-3">
                        {getDeadlineBadge(team.deadline)}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                      {team.description || 'No project description provided.'}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="text-gray-400 flex items-center gap-1 min-w-0">
                          <Users className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="font-medium text-white truncate"><span className="text-white font-medium">{team.current_members || 1}</span> / {team.max_members || 4} Members</span>
                        </span>
                        {team.hackathon_name && (
                          <span className="text-[10px] sm:text-[11px] font-semibold text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 truncate max-w-[100px] sm:max-w-[120px] flex-shrink-0">
                            🏆 {team.hackathon_name}
                          </span>
                        )}
                      </div>

                      {/* Progress Track */}
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${memberPercent}%`,
                            background: memberPercent === 100
                              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                              : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    {team.required_skills && team.required_skills.length > 0 && (
                      <div className="mb-4 sm:mb-5">
                        <div className="flex flex-wrap gap-1.5">
                          {team.required_skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium rounded-lg truncate max-w-[110px]"
                              style={{
                                background: 'rgba(99, 102, 241, 0.12)',
                                color: '#a5b4fc',
                                border: '1px solid rgba(99, 102, 241, 0.25)'
                              }}
                            >
                              {typeof skill === 'string' ? skill : skill.skill_name}
                            </span>
                          ))}
                          {team.required_skills.length > 3 && (
                            <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium rounded-lg text-gray-400 bg-white/5 border border-white/10 flex-shrink-0">
                              +{team.required_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="relative z-10 flex items-center gap-2 pt-3 border-t border-white/10">
                    <Link
                      to={`/teams/${team._id}`}
                      className="btn-secondary text-xs py-2 px-2 sm:px-3 flex-1 flex items-center justify-center gap-1 rounded-xl transition-all duration-200 min-w-0"
                    >
                      <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Details</span>
                    </Link>

                    {team.status === 'Open' && !team.is_full && (
                      <button
                        onClick={() => handleJoinTeam(team._id)}
                        disabled={joinTeamMutation.isLoading}
                        className="btn-sunset text-xs py-2 px-2 sm:px-3 flex-1 flex items-center justify-center gap-1 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-orange-500/15 min-w-0"
                      >
                        <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Join Team</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
            <p className="text-gray-400 mb-6">
              {filters.search ? 'Try adjusting your search criteria' : 'Be the first to create a team!'}
            </p>
            {!filters.search && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl card max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Team</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateTeam)} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Enter team name"
                    {...register('team_name', { required: 'Team name is required' })}
                  />
                  {errors.team_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.team_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Enter project title"
                    {...register('project_title', { required: 'Project title is required' })}
                  />
                  {errors.project_title && (
                    <p className="text-red-400 text-sm mt-1">{errors.project_title.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={4}
                  placeholder="Describe your team and project..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Required Skills *
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                  {...register('required_skills', { 
                    required: 'At least one skill is required',
                    validate: (value) => {
                      const skills = value.split(',').map(s => s.trim()).filter(s => s)
                      return skills.length > 0 || 'At least one skill is required'
                    }
                  })}
                />
                {errors.required_skills && (
                  <p className="text-red-400 text-sm mt-1">{errors.required_skills.message}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">Enter skills separated by commas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Members *
                  </label>
                  <input
                    type="number"
                    className="input w-full"
                    min="2"
                    max="10"
                    placeholder="5"
                    {...register('max_members', { required: 'Max members is required' })}
                  />
                  {errors.max_members && (
                    <p className="text-red-400 text-sm mt-1">{errors.max_members.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="input w-full"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('deadline', {
                      validate: (val) => {
                        if (!val) return true
                        const selected = new Date(val)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return selected >= today || 'Deadline date cannot be in the past'
                      }
                    })}
                  />
                  {errors.deadline && (
                    <p className="text-red-400 text-sm mt-1">{errors.deadline.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hackathon
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Hackathon name"
                    {...register('hackathon_name')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTeamMutation.isLoading}
                  className="btn-primary"
                >
                  {createTeamMutation.isLoading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Teams
