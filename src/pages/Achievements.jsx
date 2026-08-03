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
  MapPin,
  Sparkles
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
      setFilters(prev => ({ ...prev, user_id: user._id }))
    }
  }, [user])

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
            <button onClick={() => { deleteAchievementMutation.mutate(id); toast.dismiss(t.id) }} className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold">Delete</button>
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold">Cancel</button>
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* Glassmorphic Hero Header */}
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
              <Trophy className="w-7 h-7 text-amber-400" />
              <span>Student Achievements & Honor Roll</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Showcase hackathon wins, certifications, awards, and honor achievements.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-sunset flex items-center justify-center text-xs sm:text-sm px-5 py-3 rounded-xl font-bold shadow-lg shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Container */}
      <div className="card space-y-5 border border-white/10 p-5 sm:p-6">
        
        {/* Toggle Filters & Search Bar */}
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10 w-full text-xs sm:text-sm"
                placeholder="Search achievements by title, event, or organization..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-sunset text-xs sm:text-sm px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => { setFilters({}); reset() }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              !filters.user_id && !filters.type ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            All Community Achievements
          </button>
          {user && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, user_id: user._id }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filters.user_id === user._id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              My Achievements
            </button>
          )}
          {achievementTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilters(prev => ({ ...prev, type }))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filters.type === type ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" />
              <span>Achievements ({achievements.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-80">
              <LoadingSpinner size="large" />
            </div>
          ) : achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {achievements.map((item) => {
                const isOwner = user && (item.user_id?._id === user._id || item.user_id === user._id)
                const userLikesInfo = likesState[item._id] || {
                  liked: user && Array.isArray(item.likedBy)
                    ? item.likedBy.some(id => id.toString() === user._id || id === user._id)
                    : false,
                  count: item.likesCount || 0
                }

                return (
                  <div
                    key={item._id}
                    className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              🏆 {item.position || 'Winner'}
                            </span>
                            <span className="text-[11px] text-gray-400 font-semibold">{item.year || '2024'}</span>
                          </div>
                          
                          <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors truncate mt-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-orange-400 font-semibold truncate">{item.organization || 'KNIT Sultanpur'}</p>
                        </div>

                        {/* Owner edit & delete */}
                        {isOwner && (
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={() => onEditAchievement(item)}
                              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition-colors"
                              title="Edit achievement"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteAchievement(item._id)}
                              className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete achievement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                        {item.description || 'No detailed description provided.'}
                      </p>

                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      {item.certificate_link ? (
                        <a
                          href={item.certificate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 text-emerald-400"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Certificate Proof
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-medium">{item.type || 'Achievement'}</span>
                      )}

                      <button
                        onClick={() => likeMutation.mutate(item._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          userLikesInfo.liked ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-gray-300 border-white/10'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${userLikesInfo.liked ? 'fill-rose-500' : ''}`} />
                        <span>{userLikesInfo.count}</span>
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Trophy className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No achievements found</h3>
              <p className="text-xs text-gray-400">Add your hackathon awards or certificates to showcase on your profile!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Achievement Modal */}
      {(showCreateModal || editingAchievement) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <div className="w-full max-w-xl card p-6 space-y-5 border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-400" />
                <span>{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}</span>
              </h2>
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); setEditingAchievement(null); reset() }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(editingAchievement ? onUpdateAchievement : onCreateAchievement)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="e.g. 1st Place - Smart India Hackathon"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
                  <select className="input w-full text-xs" {...register('type', { required: true })}>
                    {achievementTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Position / Rank</label>
                  <select className="input w-full text-xs" {...register('position')}>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Year</label>
                  <input
                    type="number"
                    className="input w-full text-xs"
                    placeholder="2024"
                    {...register('year')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Organization / Event Name</label>
                <input
                  type="text"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="e.g. Ministry of Education / KNIT Sultanpur"
                  {...register('organization')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  className="input w-full resize-none text-xs sm:text-sm"
                  rows={3}
                  placeholder="Brief summary of the achievement, problem solved, or award criteria..."
                  {...register('description')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Certificate / Proof Link</label>
                <input
                  type="url"
                  className="input w-full text-xs sm:text-sm"
                  placeholder="https://drive.google.com/..."
                  {...register('certificate_link')}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingAchievement(null); reset() }}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAchievementMutation.isLoading || updateAchievementMutation.isLoading}
                  className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-md"
                >
                  {editingAchievement ? 'Update Achievement' : 'Save Achievement'}
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
