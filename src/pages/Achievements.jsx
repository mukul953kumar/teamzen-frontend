import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { 
  Trophy, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Award,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Save,
  Medal,
  Star
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const Achievements = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const queryClient = useQueryClient()

  // Default to showing current user's achievements
  React.useEffect(() => {
    if (user && !filters.user_id) {
      setFilters({ ...filters, user_id: user._id })
    }
  }, [user, filters.user_id])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  // Fetch achievements
  const { data: achievementsData, isLoading, refetch } = useQuery(
    ['achievements', filters],
    () => {
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.year) params.append('year', filters.year)
      if (filters.search) params.append('search', filters.search)
      if (filters.user_id) params.append('user_id', filters.user_id)
      
      return api.get(`/achievements?${params.toString()}`).then(res => res.data.data)
    }
  )

  // Create achievement mutation
  const createAchievementMutation = useMutation(
    (achievementData) => api.post('/achievements', achievementData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('achievements')
        queryClient.invalidateQueries(['userAchievements', user?._id])
        toast.success('Achievement added successfully!')
        setShowCreateModal(false)
        reset()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add achievement')
      }
    }
  )

  // Update achievement mutation
  const updateAchievementMutation = useMutation(
    ({ id, data }) => api.put(`/achievements/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('achievements')
        queryClient.invalidateQueries(['userAchievements', user?._id])
        toast.success('Achievement updated successfully!')
        setEditingAchievement(null)
        reset()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update achievement')
      }
    }
  )

  // Delete achievement mutation
  const deleteAchievementMutation = useMutation(
    (id) => api.delete(`/achievements/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('achievements')
        queryClient.invalidateQueries(['userAchievements', user?._id])
        toast.success('Achievement deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete achievement')
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
    setShowFilters(false)
  }

  const onCreateAchievement = (data) => {
    createAchievementMutation.mutate(data)
  }

  const onUpdateAchievement = (data) => {
    updateAchievementMutation.mutate({ id: editingAchievement._id, data })
  }

  const onDeleteAchievement = (id) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      deleteAchievementMutation.mutate(id)
    }
  }

  const onEditAchievement = (achievement) => {
    setEditingAchievement(achievement)
    setValue('title', achievement.title)
    setValue('type', achievement.type)
    setValue('description', achievement.description)
    setValue('certificate_link', achievement.certificate_link)
    setValue('year', achievement.year)
    setValue('organization', achievement.organization)
    setValue('position', achievement.position)
  }

  const achievements = achievementsData?.achievements || []

  const achievementTypes = [
    'Hackathon', 'Competition', 'Certification', 'Award', 'Publication', 'Other'
  ]

  const positions = ['1st', '2nd', '3rd', 'Finalist', 'Participant', 'Winner', 'Other']

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Hackathon':
        return <Trophy className="w-5 h-5" />
      case 'Competition':
        return <Medal className="w-5 h-5" />
      case 'Certification':
        return <FileText className="w-5 h-5" />
      case 'Award':
        return <Star className="w-5 h-5" />
      default:
        return <Award className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Hackathon':
        return 'text-blue-400 bg-blue-400/20'
      case 'Competition':
        return 'text-purple-400 bg-purple-400/20'
      case 'Certification':
        return 'text-green-400 bg-green-400/20'
      case 'Award':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'Publication':
        return 'text-pink-400 bg-pink-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getPositionColor = (position) => {
    switch (position) {
      case '1st':
        return 'text-yellow-400 bg-yellow-400/20'
      case '2nd':
        return 'text-gray-300 bg-gray-300/20'
      case '3rd':
        return 'text-orange-400 bg-orange-400/20'
      case 'Winner':
        return 'text-green-400 bg-green-400/20'
      case 'Finalist':
        return 'text-blue-400 bg-blue-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-gray-400">
            Showcase your accomplishments and certifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </button>
      </div>

      {/* Search Section */}
      <div className="card">
        <form onSubmit={handleSubmit(onSearch)} className="space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="input pl-12 w-full"
                placeholder="Search achievements..."
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
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-6 rounded-xl glass border border-white/20 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select className="input w-full" {...register('type')}>
                    <option value="">All Types</option>
                    {achievementTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <select className="input w-full" {...register('year')}>
                    <option value="">All Years</option>
                    {[2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* My Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Show
                  </label>
                  <select className="input w-full" {...register('user_id')}>
                    <option value="">All Achievements</option>
                    <option value={user?._id}>My Achievements</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Achievements Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {achievements.length} Achievements Found
          </h2>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="large" />
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="card card-hover group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(achievement.type)}`}>
                      {getTypeIcon(achievement.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-lg text-xs ${getTypeColor(achievement.type)}`}>
                          {achievement.type}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs ${getPositionColor(achievement.position)}`}>
                          {achievement.position}
                        </span>
                        <span className="text-xs text-gray-500">{achievement.year}</span>
                      </div>
                    </div>
                  </div>
                  {achievement.user_id._id === user?._id && (
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditAchievement(achievement)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onDeleteAchievement(achievement._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{achievement.description}</p>

                {/* Organization */}
                {achievement.organization && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Organization</p>
                    <p className="text-white font-medium">{achievement.organization}</p>
                  </div>
                )}

                {/* Certificate Link */}
                {achievement.certificate_link && (
                  <div className="mb-4">
                    <a
                      href={achievement.certificate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Certificate</span>
                    </a>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center space-x-3 p-3 rounded-lg glass">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {achievement.user_id.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{achievement.user_id.name}</p>
                    <p className="text-xs text-gray-400">{achievement.user_id.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No achievements found</h3>
            <p className="text-gray-400 mb-6">
              Start adding your accomplishments and certifications
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Add Achievement
            </button>
          </div>
        )}
      </div>

      {/* Achievement Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {achievementTypes.map((type) => {
          const count = achievements.filter(a => a.type === type).length
          return (
            <div key={type} className="card text-center">
              <div className={`p-3 rounded-lg ${getTypeColor(type)} inline-block mb-3`}>
                {getTypeIcon(type)}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{count}</div>
              <div className="text-sm text-gray-400">{type}s</div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAchievement) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
          <div className="w-full max-w-2xl card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingAchievement(null)
                  reset()
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingAchievement ? onUpdateAchievement : onCreateAchievement)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Achievement Title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <select className="input w-full" {...register('type', { required: 'Type is required' })}>
                    <option value="">Select Type</option>
                    {achievementTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-400">{errors.type.message}</p>
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
                  placeholder="Describe your achievement..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year *
                  </label>
                  <select className="input w-full" {...register('year', { required: 'Year is required' })}>
                    <option value="">Select Year</option>
                    {[2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position
                  </label>
                  <select className="input w-full" {...register('position')}>
                    <option value="">Select Position</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Organization Name"
                    {...register('organization')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Certificate Link
                </label>
                <input
                  type="url"
                  className="input w-full"
                  placeholder="https://certificate-link.com"
                  {...register('certificate_link')}
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingAchievement(null)
                    reset()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAchievementMutation.isLoading || updateAchievementMutation.isLoading}
                  className="btn-primary"
                >
                  {createAchievementMutation.isLoading || updateAchievementMutation.isLoading
                    ? 'Saving...'
                    : editingAchievement ? 'Update Achievement' : 'Add Achievement'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Achievements
