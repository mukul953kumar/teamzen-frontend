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
  Crown,
  Sparkles,
  Trophy,
  Target
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
  const { data: myRequestsData } = useQuery(
    'myRequests',
    async () => {
      const response = await api.get('/teams/my-requests')
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
        queryClient.invalidateQueries('conversations')
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
            <button onClick={() => { deleteTeamMutation.mutate(teamId); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold">Cancel</button>
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
        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 shadow-sm">
          <XCircle className="w-3 h-3 text-red-400" />
          Closed
        </span>
      )
    }

    if (diffDays <= 1) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse flex items-center gap-1 shadow-md shadow-rose-500/20">
          <Clock className="w-3 h-3 text-rose-400 flex-shrink-0 animate-bounce" />
          🔥 Closes Today!
        </span>
      )
    }

    if (diffDays <= 3) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
          ⚡ {diffDays} Days Left!
        </span>
      )
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
        <Calendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
        {diffDays}d left ({target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
      </span>
    )
  }

  const teams = teamsData?.data?.teams || []
  const myTeams = myTeamsData?.data?.teams || []
  const myRequests = myRequestsData?.data?.joinRequests || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* Premium Glassmorphism Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 13, 20, 0.95) 0%, rgba(20, 20, 35, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-orange-400" />
              <span>Project & Hackathon Teams</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Discover active student teams, recruit teammates, or launch your new project.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-sunset flex items-center justify-center text-xs sm:text-sm px-5 py-3 rounded-xl font-bold shadow-lg shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Team
          </button>
        </div>
      </div>

      {/* My Teams Section */}
      {myTeams.length > 0 && (
        <div className="card space-y-5 border border-white/10 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>My Active Teams</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/10">{myTeams.length} Teams</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {myTeams.map((team) => {
              const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
              return (
                <div key={team._id} className="relative group">
                  <Link to={`/teams/${team._id}`} className="block">
                    <div className="relative rounded-2xl p-5 transition-all duration-300 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 space-y-3.5 shadow-xl">
                      
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0 border border-white/20 bg-gradient-to-tr from-orange-500 to-purple-600">
                            {team.team_name?.charAt(0).toUpperCase() || 'T'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors truncate">
                              {team.team_name}
                            </h3>
                            <p className="text-xs text-gray-400 truncate font-medium">{team.project_title || 'Project'}</p>
                          </div>
                        </div>

                        {(team.user_role === 'Leader' || team.user_role === 'leader') && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            👑 Leader
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {team.description || 'No description provided.'}
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-gray-400 font-medium flex items-center gap-1.5 min-w-0">
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-white font-bold">{team.current_members || 1}</span> / {team.max_members || 4} Members
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            team.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            team.status === 'Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                          </span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${memberPercent}%`,
                              background: memberPercent === 100 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #f97316, #6366f1)'
                            }}
                          />
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

      {/* All Available Teams Section */}
      <div className="card space-y-6 border border-white/10 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" /> Explore Teams
            </h2>
            <p className="text-xs text-gray-400">Discover teams looking for students with your skills</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/10">{teams.length} Teams Available</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10 w-full text-xs sm:text-sm"
                placeholder="Search by team name, required skills, or project title..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-sunset text-xs sm:text-sm px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Teams</span>
            </button>
          </div>
        </form>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => {
              const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))
              return (
                <div key={team._id} className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
                  
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {team.leader_id?.profile_image ? (
                          <div className="relative shrink-0" title={`Leader: ${team.leader_id?.name || 'Leader'}`}>
                            <img
                              src={team.leader_id.profile_image}
                              alt={team.leader_id?.name || team.team_name}
                              className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] shadow-sm border border-black">
                              👑
                            </div>
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md shrink-0 border border-white/20 bg-gradient-to-tr from-orange-500 to-purple-600">
                            {team.team_name?.charAt(0).toUpperCase() || 'T'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors leading-snug break-words flex-1">
                              {team.team_name}
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 self-start ${
                              team.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              team.status === 'Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-medium truncate">{team.project_title || 'Academic Project'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Deadline */}
                    {team.deadline && (
                      <div>
                        {getDeadlineBadge(team.deadline)}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {team.description || 'No project description provided.'}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="text-gray-300 font-medium flex items-center gap-1.5 min-w-0">
                          <Users className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-white font-bold">{team.current_members || 1}</span> / {team.max_members || 4} Members
                        </span>
                        {team.hackathon_name && (
                          <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 truncate max-w-[120px]">
                            🏆 {team.hackathon_name}
                          </span>
                        )}
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${memberPercent}%`,
                            background: memberPercent === 100 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #f97316, #6366f1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    {team.required_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {team.required_skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20"
                          >
                            {typeof skill === 'string' ? skill : skill.skill_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <Link
                      to={`/teams/${team._id}`}
                      className="btn-secondary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1 rounded-xl font-semibold min-w-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>

                    {team.status === 'Open' && !team.is_full && (
                      <button
                        onClick={() => handleJoinTeam(team._id)}
                        disabled={joinTeamMutation.isLoading}
                        className="btn-sunset text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1 rounded-xl font-bold shadow-md min-w-0"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Join Team</span>
                      </button>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Users className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No teams matching criteria</h3>
            <p className="text-xs text-gray-400">
              {filters.search ? 'Try searching with different keywords or skills.' : 'Be the first to launch a team on TeamZen!'}
            </p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="w-full max-w-2xl card p-6 space-y-6 border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" /> Create New Team
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateTeam)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Team Name *</label>
                  <input
                    type="text"
                    className="input w-full text-xs sm:text-sm"
                    placeholder="Enter team name"
                    {...register('team_name', { required: 'Team name is required' })}
                  />
                  {errors.team_name && <p className="text-red-400 text-xs mt-1">{errors.team_name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    className="input w-full text-xs sm:text-sm"
                    placeholder="Enter project title"
                    {...register('project_title', { required: 'Project title is required' })}
                  />
                  {errors.project_title && <p className="text-red-400 text-xs mt-1">{errors.project_title.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Description *</label>
                <textarea
                  className="input w-full resize-none text-xs sm:text-sm"
                  rows={3}
                  placeholder="Describe your project, hackathon goals, and what problem you are solving..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Required Skills * (Comma separated)</label>
                <input
                  type="text"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="e.g. React, Node.js, Python, Figma"
                  {...register('required_skills', { required: 'At least one skill is required' })}
                />
                {errors.required_skills && <p className="text-red-400 text-xs mt-1">{errors.required_skills.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Max Members *</label>
                  <input
                    type="number"
                    className="input w-full text-xs sm:text-sm"
                    min="2"
                    max="10"
                    placeholder="4"
                    {...register('max_members', { required: 'Max members is required' })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    className="input w-full text-xs sm:text-sm"
                    {...register('deadline')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Hackathon Name</label>
                  <input
                    type="text"
                    className="input w-full text-xs sm:text-sm"
                    placeholder="e.g. Smart India Hackathon"
                    {...register('hackathon_name')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTeamMutation.isLoading}
                  className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-md"
                >
                  {createTeamMutation.isLoading ? 'Creating Team...' : 'Create Team'}
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
