import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
  Star,
  Heart,
  Eye,
  User,
  MapPin
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'

const Achievements = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [likesState, setLikesState] = useState({})
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

  const likeMutation = useMutation(
    (achievementId) => api.post(`/achievements/like/${achievementId}`),
    {
      onSuccess: (res, achievementId) => {
        setLikesState(prev => ({
          ...prev,
          [achievementId]: {
            liked: res.data.liked,
            count: res.data.likesCount
          }
        }))
        toast.success(res.data.message)
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to like achievement')
    }
  )

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
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Delete this achievement? This cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={() => { deleteAchievementMutation.mutate(id); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Cancel</button>
          </div>
        </div>
      ),
      { duration: 10000 }
    )
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
            {achievements.map((achievement) => {
              const isOwner = user && (achievement.user_id?._id === user._id || achievement.user_id === user._id)
              const userLikesInfo = likesState[achievement._id] || {
                liked: user && Array.isArray(achievement.likedBy)
                  ? achievement.likedBy.some(id => id.toString() === user._id || id === user._id)
                  : false,
                count: achievement.likesCount || 0
              }
              const isLiked = userLikesInfo.liked
              const count = userLikesInfo.count

              return (
                <div
                  key={achievement._id}
                  onClick={() => setSelectedAchievement(achievement)}
                  className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)' }} />

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />

                  <div className="relative z-10 space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 ${getTypeColor(achievement.type)}`}>
                          {getTypeIcon(achievement.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors truncate">
                            {achievement.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTypeColor(achievement.type)}`}>
                              {achievement.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPositionColor(achievement.position)}`}>
                              {achievement.position}
                            </span>
                            <span className="text-xs font-medium text-gray-400">{achievement.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Owner Actions */}
                      {isOwner && (
                        <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditAchievement(achievement)}
                            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Edit Achievement"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteAchievement(achievement._id)}
                            className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Achievement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {achievement.description}
                    </p>

                    {/* Organization */}
                    {achievement.organization && (
                      <div className="text-xs text-gray-400 bg-white/5 p-2 rounded-xl border border-white/5 truncate">
                        <span className="text-gray-500">Issued by: </span>
                        <span className="text-gray-200 font-medium">{achievement.organization}</span>
                      </div>
                    )}

                    {/* Author Box */}
                    <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {achievement.user_id?.profile_image ? (
                          <img src={achievement.user_id.profile_image} alt={achievement.user_id.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {achievement.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{achievement.user_id?.name || 'Student'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{achievement.user_id?.college || 'KNIT Sultanpur'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="relative z-10 flex items-center justify-between gap-2 pt-4 mt-4 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) return toast.error('Please login to like achievements')
                        if (isOwner) return toast.error('You cannot like your own achievement')
                        likeMutation.mutate(achievement._id)
                      }}
                      disabled={likeMutation.isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        isLiked
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                      } ${isOwner ? 'opacity-60 cursor-not-allowed' : ''}`}
                      title={isOwner ? 'Your own achievement' : isLiked ? 'Unlike achievement' : 'Like achievement'}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                      }`} />
                      <span>{count}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {achievement.certificate_link && (
                        <a
                          href={achievement.certificate_link.startsWith('http') ? achievement.certificate_link : `https://${achievement.certificate_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="View Certificate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedAchievement(achievement)}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 font-semibold rounded-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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

      {/* Achievement Detail View Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500" />
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getTypeColor(selectedAchievement.type)}`}>
                    {selectedAchievement.type}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getPositionColor(selectedAchievement.position)}`}>
                    {selectedAchievement.position}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">Year {selectedAchievement.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedAchievement.title}</h2>
                {selectedAchievement.organization && (
                  <p className="text-xs text-amber-400 font-semibold mt-1">
                    Issued by: {selectedAchievement.organization}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner Section */}
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {selectedAchievement.user_id?.profile_image ? (
                  <img src={selectedAchievement.user_id.profile_image} alt={selectedAchievement.user_id.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {selectedAchievement.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{selectedAchievement.user_id?.name || 'Student'}</p>
                <p className="text-xs text-gray-400">{selectedAchievement.user_id?.college || 'KNIT Sultanpur'}</p>
              </div>
              {selectedAchievement.user_id?._id && (
                <Link
                  to={`/user/${selectedAchievement.user_id._id}`}
                  className="btn-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" /> View Profile
                </Link>
              )}
            </div>

            {/* Full Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Achievement Details</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {selectedAchievement.description}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              {/* Like Button */}
              {(() => {
                const isSelf = user && (selectedAchievement.user_id?._id === user._id || selectedAchievement.user_id === user._id)
                const userLikesInfo = likesState[selectedAchievement._id] || {
                  liked: user && Array.isArray(selectedAchievement.likedBy)
                    ? selectedAchievement.likedBy.some(id => id.toString() === user._id || id === user._id)
                    : false,
                  count: selectedAchievement.likesCount || 0
                }
                const isLiked = userLikesInfo.liked
                const count = userLikesInfo.count

                return (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) return toast.error('Please login to like achievements')
                      if (isSelf) return toast.error('You cannot like your own achievement')
                      likeMutation.mutate(selectedAchievement._id)
                    }}
                    disabled={likeMutation.isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      isLiked
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                    } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{count} Likes</span>
                  </button>
                )
              })()}

              {selectedAchievement.certificate_link && (
                <a
                  href={selectedAchievement.certificate_link.startsWith('http') ? selectedAchievement.certificate_link : `https://${selectedAchievement.certificate_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-semibold"
                >
                  <ExternalLink className="w-4 h-4" /> View Certificate
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
              <div className="text-gray-400 text-sm">{type}s</div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal with Sticky Mobile Submit Footer */}
      {(showCreateModal || editingAchievement) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-4 sm:p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingAchievement(null)
                  reset()
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingAchievement ? onUpdateAchievement : onCreateAchievement)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g., 1st Prize in Hackathon 2026"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Type *
                  </label>
                  <select className="input w-full" {...register('type', { required: 'Type is required' })}>
                    <option value="">Select Type</option>
                    {achievementTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-400">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={4}
                  placeholder="Describe your achievement accomplishments, competition scope, etc..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Year *
                  </label>
                  <select className="input w-full" {...register('year', { required: 'Year is required' })}>
                    <option value="">Select Year</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-400">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                    Organization
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g., IIT Bombay / KNIT"
                    {...register('organization')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                  Certificate Link
                </label>
                <input
                  type="url"
                  className="input w-full"
                  placeholder="https://certificate-link.com"
                  {...register('certificate_link')}
                />
              </div>

              {/* Sticky Submit Footer */}
              <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[#0d0d14]/95 backdrop-blur-md -mx-4 -mb-4 px-4 py-3 sm:-mx-6 sm:-mb-6 sm:px-6 sm:py-4 rounded-b-2xl z-20 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingAchievement(null)
                    reset()
                  }}
                  className="btn-secondary text-xs sm:text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAchievementMutation.isLoading || updateAchievementMutation.isLoading}
                  className="btn-primary text-xs sm:text-sm px-5 py-2 flex items-center gap-1.5 shadow-lg shadow-primary-500/20"
                >
                  <Save className="w-4 h-4" />
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
