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
import { useAuth } from '../contexts/AuthContext'

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

  const teams = teamsData?.data?.teams || []
  const myTeams = myTeamsData?.data?.teams || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
          <p className="text-gray-400">Find and join teams for your projects and hackathons</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Team
        </button>
      </div>

      {/* My Teams Section */}
      {myTeams.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">My Teams</h2>
            <span className="text-sm text-gray-400">{myTeams.length} teams</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map((team) => (
              <div key={team._id} className="relative">
                <Link to={`/teams/${team._id}`} className="block">
                  <div className="card card-hover group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                            {team.team_name}
                          </h3>
                          <p className="text-sm text-gray-400">{team.project_title}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {team.user_role === 'Leader' && (
                            <div className="flex items-center space-x-1">
                              <Crown className="w-4 h-4 text-yellow-400" />
                              <span className="text-xs text-yellow-400">Leader</span>
                            </div>
                          )}
                        </div>
                      </div>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{team.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{team.current_members}/{team.max_members}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
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
                
                {/* Delete button for team leaders */}
                {(team.user_role === 'Leader' || team.user_role === 'leader') && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteTeam(team._id, team.team_name)
                      }}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete team"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Teams Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">All Teams</h2>
          <span className="text-sm text-gray-400">{teams.length} teams available</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit(onSearch)} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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
              className="btn-primary flex items-center justify-center px-6"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </form>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team._id} className="card card-hover">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{team.team_name}</h3>
                      <p className="text-sm text-gray-400">{team.project_title}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                      team.status === 'Full' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-blue-400/20 text-blue-400'
                    }`}>
                      {team.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{team.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">{team.current_members}/{team.max_members}</span>
                    </div>
                    {team.hackathon_name && (
                      <span className="text-xs text-gray-500">{team.hackathon_name}</span>
                    )}
                  </div>

                  {/* Required Skills */}
                  {team.required_skills && team.required_skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {team.required_skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded"
                          >
                            {skill.skill_name}
                          </span>
                        ))}
                        {team.required_skills.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                            +{team.required_skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/teams/${team._id}`}
                      className="btn-outline text-sm px-3 py-1.5 flex-1 flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Link>
                    {team.status === 'Open' && !team.is_full && (
                      <button
                        onClick={() => handleJoinTeam(team._id)}
                        disabled={joinTeamMutation.isLoading}
                        className="btn-primary text-sm px-3 py-1.5 flex-1 flex items-center justify-center"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
          <div className="w-full max-w-2xl card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Team</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateTeam)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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

              <div className="grid md:grid-cols-3 gap-6">
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
                    {...register('deadline')}
                  />
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

              <div className="flex items-center justify-end space-x-4">
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
