import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, User, MapPin, Users, X, Send, Bookmark, BookmarkCheck
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import { useAuth } from '../contexts/useAuth'
import toast from 'react-hot-toast'

const TeammateFinder = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
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
      params.append('page', currentPage)
      params.append('limit', 6)
      return api.get(`/profile/search?${params.toString()}`).then(res => res.data.data)
    },
    { enabled: true, cacheTime: 0, staleTime: 0 }
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
        toast.success('Team invitation sent successfully!')
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
      <div className="card">
        <form onSubmit={handleSubmit(onSearch)} className="space-y-6">
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
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{pagination.total || 0} Potential Teammates Found</h2>
          {Object.keys(filters).some(k => filters[k]) && (
            <button onClick={clearFilters} className="text-sm text-primary-400 hover:text-primary-300">
              Clear Filters
            </button>
          )}
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
                  <div key={u._id} className="glass-3d rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {u.profile_image ? (
                              <img src={u.profile_image} alt={u.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white/20" />
                            ) : (
                              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #4A5568, #1A202C)' }}>
                                <span className="text-xl font-bold text-white">{u.name?.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-base mb-1">{u.name}</h3>
                            <div className="space-y-1 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{u.college}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span>{u.branch} • {u.year}{u.year===1?'st':u.year===2?'nd':u.year===3?'rd':'th'} Year</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Bookmark button */}
                        <button onClick={() => bookmarkMutation.mutate(u._id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-2">
                          {isBookmarked
                            ? <BookmarkCheck className="w-4 h-4 text-primary-400" />
                            : <Bookmark className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>

                      {/* Availability + Hackathon interests */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {u.availability_status && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${availabilityColor(u.availability_status)}`}>
                            {u.availability_status === 'Available' ? '🟢' : u.availability_status === 'Open to work' ? '🔵' : '🔴'} {u.availability_status}
                          </span>
                        )}
                        {u.hackathon_interests?.slice(0, 2).map((h, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-400/10 text-purple-300 text-xs rounded-full border border-purple-400/20">
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Bio */}
                      {u.bio && <p className="text-xs text-gray-300 mb-3 line-clamp-2">{u.bio}</p>}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {u.skills?.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs rounded-full"
                            style={{ background: 'rgba(66,153,225,0.1)', color: '#63B3ED', border: '1px solid rgba(66,153,225,0.4)' }}>
                            {typeof skill === 'string' ? skill : skill.skill_name}
                          </span>
                        ))}
                        {u.skills?.length > 4 && (
                          <span className="px-2 py-0.5 text-xs rounded-full"
                            style={{ background: 'rgba(66,153,225,0.05)', color: '#4299E1', border: '1px solid rgba(66,153,225,0.3)' }}>
                            +{u.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                        {matchPercentage > 0 && (
                          <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                            {matchPercentage}% Match
                          </span>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <button onClick={() => handleInviteClick(u)}
                            className="flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                            style={{ background: 'rgba(66,153,225,0.1)', color: '#63B3ED', border: '1px solid rgba(66,153,225,0.4)' }}
                            disabled={inviteMutation.isLoading}>
                            <Send className="w-3 h-3 mr-1" /> Invite
                          </button>
                          <button onClick={() => navigate(`/user/${u._id}`)}
                            className="flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg,#2C5282,#1A365D)', color: 'white', border: '1px solid rgba(66,153,225,0.5)' }}>
                            <Users className="w-3 h-3 mr-1" /> View
                          </button>
                        </div>
                      </div>
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
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Popular Skills</h3>
        <div className="flex flex-wrap gap-2">
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
    </div>
  )
}

export default TeammateFinder
