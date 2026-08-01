import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, User, MapPin, Users, X, Send, Bookmark, BookmarkCheck, Heart
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import { useAuth } from '../contexts/useAuth'
import toast from 'react-hot-toast'
import { soundManager } from '../services/soundUtils'
import AIMatchModal from '../components/AIMatchModal'
import { getDomainBadgeStyle } from '../utils/domainUtils'

const TeammateFinder = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [aiMatchUser, setAiMatchUser] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [likesState, setLikesState] = useState({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset } = useForm()

  // Load bookmarks on mount
  useQuery('bookmarks', () => api.get('/profile/bookmarks/list').then(res => res.data.data?.bookmarks || []), {
    enabled: !!user,
    onSuccess: (data) => setBookmarkedIds(new Set(data.map(b => b._id)))
  })

  const { data: searchResults, isLoading, refetch } = useQuery(
    ['teammateSearch', filters, currentPage],
    () => {
      const params = new URLSearchParams()
      if (filters.skills) params.append('skills', filters.skills)
      if (filters.college) params.append('college', filters.college)
      if (filters.branch) params.append('branch', filters.branch)
      if (filters.year) params.append('year', filters.year)
      if (filters.search) params.append('search', filters.search)
      if (filters.availability) params.append('availability', filters.availability)
      if (filters.hackathon_type) params.append('hackathon_type', filters.hackathon_type)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      params.append('page', currentPage)
      params.append('limit', 6)
      return api.get(`/profile/search?${params.toString()}`).then(res => res.data.data)
    },
    { enabled: true, cacheTime: 0, staleTime: 0 }
  )

  const likeMutation = useMutation(
    (targetUserId) => api.post(`/profile/like/${targetUserId}`),
    {
      onSuccess: (res, targetUserId) => {
        setLikesState(prev => ({
          ...prev,
          [targetUserId]: {
            liked: res.data.liked,
            count: res.data.likesCount
          }
        }))
        toast.success(res.data.message)
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to like profile')
    }
  )

  const { data: myTeamsData } = useQuery(
    'myTeams',
    () => api.get('/teams/my-teams').then(res => res.data),
    { enabled: showInviteModal, retry: false }
  )
  const inviteMutation = useMutation(
    ({ teamId, userId, message }) => api.post(`/teams/${teamId}/invite`, { user_id: userId, message }),
    {
      onSuccess: () => {
        soundManager.playInviteSound()
        toast.success('🎉 Team invitation sent successfully!')
        setShowInviteModal(false)
        setSelectedUser(null)
        setSelectedTeam('')
        setInviteMessage('')
        queryClient.invalidateQueries('myTeams')
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to send invitation')
    }
  )

  const bookmarkMutation = useMutation(
    (userId) => api.post(`/profile/bookmark/${userId}`),
    {
      onSuccess: (res, userId) => {
        setBookmarkedIds(prev => {
          const next = new Set(prev)
          res.data.bookmarked ? next.add(userId) : next.delete(userId)
          return next
        })
        toast.success(res.data.message)
      },
      onError: () => toast.error('Failed to bookmark')
    }
  )

  const onSearch = (data) => { setFilters(data); setCurrentPage(1) }

  const clearFilters = () => { reset(); setFilters({}); setShowFilters(false); setCurrentPage(1) }

  const calculateMatch = (userSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0
    const userSkillNames = userSkills?.map(skill => skill.skill_name) || []
    const matchingSkills = requiredSkills.filter(skill => userSkillNames.includes(skill))
    return Math.round((matchingSkills.length / requiredSkills.length) * 100)
  }

  const handlePageChange = (page) => { setCurrentPage(page); window.scrollTo(0, 0) }

  const handleInviteClick = (u) => { setSelectedUser(u); setShowInviteModal(true) }

  const handleSendInvite = () => {
    if (!selectedTeam) return toast.error('Please select a team')
    inviteMutation.mutate({
      teamId: selectedTeam,
      userId: selectedUser._id,
      message: inviteMessage || `Hi ${selectedUser.name}, I'd like to invite you to join my team!`
    })
  }

  const handleCloseInviteModal = () => {
    setShowInviteModal(false); setSelectedUser(null); setSelectedTeam(''); setInviteMessage('')
  }

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
  const years = [1, 2, 3, 4]
  const hackathonTypes = ['Web Dev', 'ML/AI', 'App Dev', 'Blockchain', 'IoT', 'Cybersecurity', 'Open Source']
  const commonSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB',
    'MySQL', 'Machine Learning', 'Data Science', 'UI/UX', 'Flutter',
    'Blockchain', 'IoT', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js'
  ]

  const users = searchResults?.users || []
  const pagination = searchResults?.pagination || { total: 0, pages: 0 }

  const availabilityColor = (status) => {
    if (status === 'Available') return 'bg-green-400/20 text-green-400'
    if (status === 'Open to work') return 'bg-blue-400/20 text-blue-400'
    return 'bg-red-400/20 text-red-400'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Teammate Finder</h1>
        <p className="text-gray-400">Discover the perfect teammates for your projects and hackathons</p>
      </div>

      {/* Search Section */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
        <form onSubmit={handleSubmit(onSearch)} className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" className="input pl-12 w-full"
                placeholder="Search by name, college, or skills..."
                {...register('search')} />
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center px-6">
              <Search className="w-4 h-4 mr-2" /> Search
            </button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center px-6">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="p-6 rounded-xl glass border border-white/20 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                <button type="button" onClick={clearFilters} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                  <select className="input w-full" {...register('branch')}>
                    <option value="">All Branches</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select className="input w-full" {...register('year')}>
                    <option value="">All Years</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                  <select className="input w-full" {...register('availability')}>
                    <option value="">Any Status</option>
                    <option value="Available">🟢 Available</option>
                    <option value="Open to work">🔵 Open to work</option>
                    <option value="Busy">🔴 Busy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hackathon Interest</label>
                  <select className="input w-full" {...register('hackathon_type')}>
                    <option value="">Any Type</option>
                    {hackathonTypes.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
                  <input type="text" className="input w-full" placeholder="React, Node.js, Python"
                    {...register('skills')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">College</label>
                  <input type="text" className="input w-full" placeholder="KNIT Sultanpur"
                    {...register('college')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select className="input w-full" {...register('sortBy')}>
                    <option value="">Default (Newest)</option>
                    <option value="most_popular">🔥 Most Popular (Most Liked)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">{pagination.total || 0} Potential Teammates Found</h2>
          <div className="flex items-center gap-3">
            <select
              value={filters.sortBy || ''}
              onChange={(e) => {
                const newSort = e.target.value
                setFilters(prev => ({ ...prev, sortBy: newSort }))
                setCurrentPage(1)
              }}
              className="input text-xs sm:text-sm py-1.5 px-3 rounded-xl border border-white/10 bg-white/5 text-gray-200 focus:outline-none"
            >
              <option value="">Sort: Newest</option>
              <option value="most_popular">🔥 Sort: Most Popular</option>
            </select>
            {Object.keys(filters).some(k => filters[k]) && (
              <button onClick={clearFilters} className="text-sm text-primary-400 hover:text-primary-300 whitespace-nowrap">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-96"><LoadingSpinner size="large" /></div>
        ) : users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {users.map((u) => {
                const matchPercentage = filters.skills
                  ? calculateMatch(u.skills, filters.skills.split(',').map(s => s.trim()))
                  : 0
                const isBookmarked = bookmarkedIds.has(u._id)

                return (
                  <div key={u._id} className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>

                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                      style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }} />

                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                          {/* Avatar with Glow Ring */}
                          <div className="relative flex-shrink-0">
                            {u.profile_image ? (
                              <img src={u.profile_image} alt={u.name}
                                className={`w-14 h-14 rounded-2xl object-cover border ${
                                  u.availability_status === 'Available' ? 'ring-2 ring-emerald-400/80 border-emerald-400/30' :
                                  u.availability_status === 'Open to work' ? 'ring-2 ring-cyan-400/80 border-cyan-400/30' :
                                  'ring-2 ring-gray-400/40 border-gray-400/20'
                                }`} />
                            ) : (
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md ${
                                u.availability_status === 'Available' ? 'ring-2 ring-emerald-400/80' :
                                u.availability_status === 'Open to work' ? 'ring-2 ring-cyan-400/80' :
                                'ring-2 ring-gray-400/40'
                              }`}
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                {u.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                            {/* Online status indicator badge */}
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-[8px] ${
                              u.availability_status === 'Available' ? 'bg-emerald-400' :
                              u.availability_status === 'Open to work' ? 'bg-cyan-400' :
                              'bg-gray-500'
                            }`} />
                          </div>

                          {/* Student info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white text-base group-hover:text-primary-300 transition-colors truncate">
                                {u.name}
                              </h3>
                              {matchPercentage > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setAiMatchUser({ ...u, matchPercentage })}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1 flex-shrink-0 hover:bg-green-500/25 transition-all cursor-pointer"
                                  title="Click to view AI Compatibility Breakdown"
                                >
                                  ⚡ {matchPercentage}% Match
                                </button>
                              )}
                            </div>

                            <div className="space-y-1 text-xs text-gray-400">
                              <div className="flex items-center gap-1 text-gray-300">
                                <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                <span className="truncate font-medium">{u.college || 'KNIT Sultanpur'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] font-medium text-gray-300 border border-white/10">
                                  {u.branch || 'BTech'}
                                </span>
                                <span className="text-[11px] font-medium text-gray-400">
                                  {u.year ? `${u.year}${u.year===1?'st':u.year===2?'nd':u.year===3?'rd':'th'} Year` : 'Student'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Social, Like & Bookmark Actions */}
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {/* Like Button */}
                          {(() => {
                            const isSelf = user && user._id === u._id
                            const userLikesInfo = likesState[u._id] || {
                              liked: user && Array.isArray(u.likedBy)
                                ? u.likedBy.some(id => id.toString() === user._id || id === user._id)
                                : false,
                              count: u.likesCount || 0
                            }
                            const isLiked = userLikesInfo.liked
                            const count = userLikesInfo.count

                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!user) {
                                    toast.error('Please login to like profiles')
                                    navigate('/login')
                                    return
                                  }
                                  if (isSelf) {
                                    toast.error('You cannot like your own profile')
                                    return
                                  }
                                  likeMutation.mutate(u._id)
                                }}
                                disabled={likeMutation.isLoading}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                  isLiked
                                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm shadow-rose-500/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'
                                } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                                title={isSelf ? 'Your own profile' : isLiked ? 'Unlike profile' : 'Like profile'}
                              >
                                <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                                }`} />
                                <span>{count}</span>
                              </button>
                            )
                          })()}

                          <button onClick={() => bookmarkMutation.mutate(u._id)}
                            className={`p-2 rounded-xl border transition-all ${
                              isBookmarked ? 'bg-amber-400/20 border-amber-400/40 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                            }`} title={isBookmarked ? 'Remove bookmark' : 'Bookmark profile'}>
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Domain Interests */}
                      {u.hackathon_interests?.length > 0 && (
                        <div className="mb-2.5">
                          <div className="flex flex-wrap gap-1">
                            {u.hackathon_interests.slice(0, 3).map((interest, idx) => {
                              const style = getDomainBadgeStyle(interest)
                              return (
                                <span key={idx} className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${style.color}`}>
                                  {style.icon} {interest}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.skills?.length > 0 ? (
                            u.skills.slice(0, 4).map((skill, index) => (
                              <span key={index} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/25">
                                {typeof skill === 'string' ? skill : skill.skill_name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">No skills listed</span>
                          )}
                          {u.skills?.length > 4 && (
                            <span className="px-2 py-1 text-[10px] font-medium text-gray-400 bg-white/5 rounded-lg border border-white/10">
                              +{u.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 gap-1.5">
                      <button onClick={() => setAiMatchUser({ ...u, matchPercentage: matchPercentage || 92 })}
                        className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all flex items-center gap-1 cursor-pointer"
                        title="View AI Match Breakdown">
                        <span>⚡ AI Breakdown</span>
                      </button>

                      <button onClick={() => navigate(`/user/${u._id}`)}
                        className="btn-secondary py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all duration-200">
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>

                      <button onClick={() => handleInviteClick(u)}
                        className="btn-sunset py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 shadow-md shadow-orange-500/15"
                        disabled={inviteMutation.isLoading}>
                        <Send className="w-3.5 h-3.5" />
                        <span>Invite</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.pages}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No teammates found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or check back later</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Popular Skills */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(120deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.14) 40%, rgba(255,107,53,0.12) 100%)', backgroundSize: '300% 300%', animation: 'gradientShift 8s ease infinite' }} />
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(255,107,53,0.4), transparent)' }} />
        <h3 className="relative z-10 text-xl font-semibold text-white mb-4">Popular Skills</h3>
        <div className="relative z-10 flex flex-wrap gap-2">
          {commonSkills.map((skill) => (
            <button key={skill}
              onClick={() => { reset({ skills: skill }); setFilters({ skills: skill }); refetch() }}
              className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/30 transition-colors text-sm">
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Team Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Send className="w-6 h-6 text-orange-400" /> Invite to Team
              </h2>
              <button onClick={handleCloseInviteModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedUser && (
              <div className="mb-6 p-4 rounded-xl glass-3d border border-white/10">
                <div className="flex items-center gap-3">
                  {selectedUser.profile_image ? (
                    <img src={selectedUser.profile_image} alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-400">{selectedUser.college} • {selectedUser.branch}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Select Team *</label>
              {myTeamsData?.data?.teams?.length > 0 ? (
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400/50 transition-all"
                  style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                  <option value="">Choose a team...</option>
                  {myTeamsData.data.teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.team_name} {team.user_role === 'Leader' && '(Leader)'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-8 px-4 rounded-xl glass-3d border border-white/10">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300 mb-4">You don't have any teams yet</p>
                  <button onClick={() => { handleCloseInviteModal(); navigate('/teams') }}
                    className="btn-primary text-sm px-4 py-2">Create Team</button>
                </div>
              )}
            </div>

            {myTeamsData?.data?.teams?.length > 0 && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Message (Optional)</label>
                  <textarea value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Add a personal message to your invitation..."
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400/50 transition-all resize-none"
                    rows={3} />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button onClick={handleCloseInviteModal}
                    className="px-6 py-3 glass-3d rounded-xl hover:bg-white/10 transition-all font-medium text-white">
                    Cancel
                  </button>
                  <button onClick={handleSendInvite} disabled={!selectedTeam || inviteMutation.isLoading}
                    className="btn-sunset px-6 py-3 flex items-center gap-2 hover:scale-105">
                    {inviteMutation.isLoading ? <><LoadingSpinner size="small" /> Sending...</> : <><Send className="w-4 h-4" /> Send Invitation</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Match Breakdown Modal */}
      <AIMatchModal
        isOpen={!!aiMatchUser}
        onClose={() => setAiMatchUser(null)}
        candidate={aiMatchUser}
        currentUser={user}
        onInvite={(c) => {
          handleInviteClick(c)
        }}
      />
    </div>
  )
}

export default TeammateFinder
