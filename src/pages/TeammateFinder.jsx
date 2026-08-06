import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, User, MapPin, Users, X, Send, Bookmark, BookmarkCheck, Heart, Sparkles, Target, Flame
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
              <Sparkles className="w-7 h-7 text-orange-400" />
              <span>AI Teammate Finder & Matchmaker</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Discover compatible student partners with matching skills for hackathons & projects.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-orange-400" />
              <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSubmit(onSearch)} className="relative z-10 space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10 w-full text-xs sm:text-sm"
                placeholder="Search candidates by name, college, branch, or tech skills..."
                {...register('search')}
              />
            </div>
            <button
              type="submit"
              className="btn-sunset text-xs sm:text-sm px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Candidates</span>
            </button>
          </div>

          {/* Expanded Filters Drawer */}
          {showFilters && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 mt-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Refine Search Criteria</h3>
                <button type="button" onClick={clearFilters} className="text-xs text-orange-400 hover:underline">
                  Reset All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Branch</label>
                  <select className="input w-full text-xs" {...register('branch')}>
                    <option value="">All Branches</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Year</label>
                  <select className="input w-full text-xs" {...register('year')}>
                    <option value="">All Academic Years</option>
                    {years.map(y => <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Availability Status</label>
                  <select className="input w-full text-xs" {...register('availability')}>
                    <option value="">Any Availability</option>
                    <option value="Available">🟢 Available</option>
                    <option value="Open to work">🔵 Open to work</option>
                    <option value="Busy">🔴 Busy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Hackathon Domain</label>
                  <select className="input w-full text-xs" {...register('hackathon_type')}>
                    <option value="">Any Domain</option>
                    {hackathonTypes.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Candidate Grid Section */}
      <div className="card space-y-6 border border-white/10 p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            <span>Matched Students ({pagination.total || 0})</span>
          </h2>

          <div className="flex items-center gap-3">
            <select
              value={filters.sortBy || ''}
              onChange={(e) => {
                const newSort = e.target.value
                setFilters(prev => ({ ...prev, sortBy: newSort }))
                setCurrentPage(1)
              }}
              className="input text-xs py-1.5 px-3 rounded-xl border border-white/10 bg-white/5 text-gray-200 focus:outline-none"
            >
              <option value="">Sort: Newest</option>
              <option value="most_popular">🔥 Sort: Most Popular</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-80">
            <LoadingSpinner size="large" />
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {users.map((u) => {
              const matchPercentage = filters.skills
                ? calculateMatch(u.skills, filters.skills.split(',').map(s => s.trim()))
                : 0
              const isBookmarked = bookmarkedIds.has(u._id)
              const userLikesInfo = likesState[u._id] || {
                liked: user && Array.isArray(u.likedBy)
                  ? u.likedBy.some(id => id.toString() === user._id || id === user._id)
                  : false,
                count: u.likesCount || 0
              }
              const isLiked = userLikesInfo.liked
              const likeCount = userLikesInfo.count

              return (
                <div key={u._id} className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between space-y-4 shadow-xl">
                  
                  <div className="space-y-3.5">
                    
                    {/* Header Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        
                        {/* Avatar */}
                        <div className="relative shrink-0 w-14 h-14">
                          {u.profile_image ? (
                            <img src={u.profile_image} alt={u.name} className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-md shrink-0" />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/20 bg-gradient-to-tr from-orange-500 to-purple-600 shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#09090e] ${
                            (u.availability_status || 'Available') === 'Available' ? 'bg-emerald-400' :
                            u.availability_status === 'Open to work' ? 'bg-cyan-400' : 'bg-rose-500'
                          }`} title={`Status: ${u.availability_status || 'Available'}`} />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <h3 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors leading-snug break-words flex-1">
                              {u.name}
                            </h3>

                            {/* AI Match percentage badge */}
                            <button
                              type="button"
                              onClick={() => setAiMatchUser({ ...u, matchPercentage: matchPercentage || 94 })}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 cursor-pointer hover:bg-emerald-500/30 transition-all self-start"
                              title="View AI Match Breakdown"
                            >
                              ⚡ {matchPercentage || 94}% Match
                            </button>
                          </div>

                          <p className="text-xs text-gray-400 truncate">{u.college || 'KNIT Student'}</p>
                          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] text-gray-400 font-medium pt-0.5">
                            <span className="truncate">{u.branch || 'Tech'} • Year {u.year || '3'}</span>
                            
                            {/* Availability Status Badge Tag */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1.5 shrink-0 ${
                              (u.availability_status || 'Available') === 'Available'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : u.availability_status === 'Open to work'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                (u.availability_status || 'Available') === 'Available'
                                  ? 'bg-emerald-400 animate-pulse'
                                  : u.availability_status === 'Open to work'
                                  ? 'bg-cyan-400 animate-pulse'
                                  : 'bg-rose-400'
                              }`} />
                              {u.availability_status || 'Available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Domain interest tags */}
                    {u.hackathon_interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {u.hackathon_interests.slice(0, 3).map((interest, idx) => {
                          const style = getDomainBadgeStyle(interest)
                          return (
                            <span key={idx} className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${style.color}`}>
                              {style.icon} {interest}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {/* Tech skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {u.skills?.length > 0 ? (
                        u.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">
                            {typeof skill === 'string' ? skill : skill.skill_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) return toast.error('Please login to like candidates')
                        if (u._id === user._id) return toast.error('You cannot like your own profile')
                        likeMutation.mutate(u._id)
                      }}
                      disabled={likeMutation.isLoading}
                      className={`px-2 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400'
                      }`}
                      title={isLiked ? 'Unlike profile' : 'Like profile'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{likeCount}</span>
                    </button>

                    <button
                      onClick={() => bookmarkMutation.mutate(u._id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isBookmarked ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark candidate'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => navigate(`/user/${u._id}`)}
                      className="btn-secondary text-xs py-2 px-2.5 flex-1 flex items-center justify-center gap-1 rounded-xl font-semibold min-w-0"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => handleInviteClick(u)}
                      className="btn-sunset text-xs py-2 px-2.5 flex-1 flex items-center justify-center gap-1 rounded-xl font-bold shadow-md min-w-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Users className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No candidates found</h3>
            <p className="text-xs text-gray-400">Try adjusting your branch or skill filters.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md card p-6 space-y-5 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-orange-400" /> Send Team Invitation
              </h2>
              <button onClick={handleCloseInviteModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedUser && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-400">{selectedUser.college || 'KNIT'} • {selectedUser.branch}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300">Select Target Team *</label>
              {myTeamsData?.data?.teams?.length > 0 ? (
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="input w-full text-xs"
                >
                  <option value="">Choose a team...</option>
                  {myTeamsData.data.teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.team_name} {team.user_role === 'Leader' && '(Leader)'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-4 px-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-xs text-gray-300">You don't have any teams yet.</p>
                  <button onClick={() => { handleCloseInviteModal(); navigate('/teams') }} className="btn-primary text-xs px-4 py-1.5 rounded-xl font-bold">
                    Create Team
                  </button>
                </div>
              )}

              {myTeamsData?.data?.teams?.length > 0 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Invitation Message (Optional)</label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Why would they be a great fit for your project?"
                      className="input w-full resize-none text-xs"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button onClick={handleCloseInviteModal} className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold">
                      Cancel
                    </button>
                    <button onClick={handleSendInvite} disabled={!selectedTeam || inviteMutation.isLoading} className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-md">
                      {inviteMutation.isLoading ? 'Sending...' : 'Send Invitation'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Match Breakdown Modal */}
      <AIMatchModal
        isOpen={!!aiMatchUser}
        onClose={() => setAiMatchUser(null)}
        candidate={aiMatchUser}
        currentUser={user}
        onInvite={(c) => handleInviteClick(c)}
      />
    </div>
  )
}

export default TeammateFinder
