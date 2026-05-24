import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Code,
  Calendar,
  Mail,
  MessageCircle,
  Users,
  X,
  Send,
  Crown,
  CheckCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import { useAuth } from '../contexts/AuthContext'
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
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { data: searchResults, isLoading, refetch } = useQuery(
    ['teammateSearch', filters, currentPage],
    () => {
      const params = new URLSearchParams()
      if (filters.skills) params.append('skills', filters.skills)
      if (filters.college) params.append('college', filters.college)
      if (filters.branch) params.append('branch', filters.branch)
      if (filters.year) params.append('year', filters.year)
      if (filters.search) params.append('search', filters.search)
      
      // Add pagination
      params.append('page', currentPage)
      params.append('limit', 6)
      
      console.log('Searching with params:', params.toString())
      return api.get(`/profile/search?${params.toString()}`).then(res => {
        console.log('Search API Response:', res.data)
        return res.data.data
      })
    },
    { 
      enabled: true,
      cacheTime: 0,
      staleTime: 0
    }
  )

  const { data: allUsers } = useQuery(
    ['allUsers', currentPage],
    async () => {
      try {
        console.log('Fetching all users...')
        const response = await api.get(`/profile/search?page=${currentPage}&limit=6`)
        console.log('All Users API Response:', response.data)
        console.log('All Users Data:', response.data.data)
        return response.data.data
      } catch (error) {
        console.error('All users error:', error)
        return { users: [] }
      }
    },
    {
      cacheTime: 0,
      staleTime: 0
    }
  )

  // Fetch user's teams for invitation
  const { data: myTeamsData } = useQuery(
    'myTeams',
    () => api.get('/teams/my-teams').then(res => res.data),
    { 
      enabled: showInviteModal,
      retry: false 
    }
  )

  // Send team invitation mutation
  const inviteMutation = useMutation(
    ({ teamId, userId, message }) => api.post(`/teams/${teamId}/invite`, { 
      user_id: userId, 
      message 
    }),
    {
      onSuccess: () => {
        toast.success('Team invitation sent successfully!')
        setShowInviteModal(false)
        setSelectedUser(null)
        setSelectedTeam('')
        setInviteMessage('')
        queryClient.invalidateQueries('myTeams')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send invitation')
      }
    }
  )

  const onSearch = (data) => {
    console.log('Search form data:', data)
    const newFilters = {
      ...filters,
      ...data
    }
    console.log('New filters:', newFilters)
    setFilters(newFilters)
  }

  // Auto-trigger search when filters change
  useEffect(() => {
    console.log('Filters changed, triggering search:', filters)
    if (filters.search || filters.skills || filters.college || filters.branch || filters.year) {
      // Only search if there are actual filters
      console.log('Has filters, will search')
    } else {
      console.log('No filters, will show all users')
    }
  }, [filters])

  const clearFilters = () => {
    reset()
    setFilters({})
    setShowFilters(false)
    setCurrentPage(1) // Reset to first page when clearing filters
  }

  const calculateMatch = (userSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0
    
    const userSkillNames = userSkills?.map(skill => skill.skill_name) || []
    const matchingSkills = requiredSkills.filter(skill => userSkillNames.includes(skill))
    
    return Math.round((matchingSkills.length / requiredSkills.length) * 100)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0) // Scroll to top when changing page
  }

  const handleInviteClick = (user) => {
    if (!user) {
      toast.error('Please select a user to invite')
      return
    }
    setSelectedUser(user)
    setShowInviteModal(true)
  }

  const handleSendInvite = () => {
    if (!selectedTeam) {
      toast.error('Please select a team')
      return
    }
    if (!selectedUser) {
      toast.error('Please select a user to invite')
      return
    }

    inviteMutation.mutate({
      teamId: selectedTeam,
      userId: selectedUser._id,
      message: inviteMessage || `Hi ${selectedUser.name}, I'd like to invite you to join my team!`
    })
  }

  const handleCloseInviteModal = () => {
    setShowInviteModal(false)
    setSelectedUser(null)
    setSelectedTeam('')
    setInviteMessage('')
  }

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
  const years = [1, 2, 3, 4]
  const commonSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB',
    'MySQL', 'Machine Learning', 'Data Science', 'UI/UX', 'Flutter',
    'Blockchain', 'IoT', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js'
  ]

  const users = searchResults?.users || allUsers?.users || []
  const pagination = searchResults?.pagination || allUsers?.pagination || { total: 0, pages: 0 }
  
  // Debug logging
  console.log('Search Results:', searchResults)
  console.log('All Users:', allUsers)
  console.log('Final Users:', users)
  console.log('Users length:', users.length)
  console.log('Pagination:', pagination)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Teammate Finder</h1>
        <p className="text-gray-400">
          Discover the perfect teammates for your projects and hackathons
        </p>
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
                placeholder="Search by name, college, or skills..."
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
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* College */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    College
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="IIT Delhi"
                    {...register('college')}
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <select className="input w-full" {...register('branch')}>
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
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
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="React, Node.js, Python"
                    {...register('skills')}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {pagination.total || 0} Potential Teammates Found
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
        ) : users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {users.map((user) => {
              const matchPercentage = filters.skills 
                ? calculateMatch(user.skills, filters.skills.split(',').map(s => s.trim()))
                : 0

              return (
                <div key={user._id} className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
                     style={{
                       background: 'linear-gradient(145deg, rgba(26, 32, 44, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)',
                       border: '1px solid rgba(255, 255, 255, 0.1)',
                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                     }}>
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{
                         background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
                         transform: 'translateX(-100%)',
                         animation: 'none'
                       }} />
                  
                  <div className="p-6 relative z-10">
                    {/* Header with Avatar - Enhanced */}
                    <div className="flex items-start space-x-4 mb-4">
                      {/* Avatar with glow effect */}
                      <div className="flex-shrink-0 relative">
                        <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                             style={{ background: 'linear-gradient(135deg, #4A5568, #2D3748)' }} />
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.name}
                            className="relative w-16 h-16 rounded-full object-cover border-2 transition-all duration-300 group-hover:scale-110"
                            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                          />
                        ) : (
                          <div className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                               style={{ background: 'linear-gradient(135deg, #4A5568, #1A202C)' }}>
                            <span className="text-xl font-bold text-white">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info - Enhanced */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg mb-2 transition-all duration-300 group-hover:text-gray-300">
                          {user.name}
                        </h3>
                        <div className="space-y-2 text-sm" style={{ color: '#A0AEC0' }}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" style={{ color: '#718096' }} />
                            <span>{user.college}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" style={{ color: '#718096' }} />
                            <span>{user.branch} • {user.year}{user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-300 line-clamp-2">{user.bio}</p>
                      </div>
                    )}

                    {/* Skills - Black Theme with Blue Border */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {user.skills?.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full transition-all duration-300 hover:scale-105"
                            style={{
                              background: 'rgba(66, 153, 225, 0.1)',
                              color: '#63B3ED',
                              border: '1px solid rgba(66, 153, 225, 0.4)'
                            }}
                          >
                            {typeof skill === 'string' ? skill : skill.skill_name}
                          </span>
                        ))}
                        {user.skills?.length > 4 && (
                          <span className="px-3 py-1 text-xs rounded-full"
                                style={{
                                  background: 'rgba(66, 153, 225, 0.05)',
                                  color: '#4299E1',
                                  border: '1px solid rgba(66, 153, 225, 0.3)'
                                }}>
                            +{user.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Match Percentage and Actions - Mobile Responsive */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-white/10 gap-3">
                      {matchPercentage > 0 && (
                        <div className="flex items-center space-x-2 justify-center sm:justify-start">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-sm text-green-400 font-medium">
                            {matchPercentage}% Match
                          </span>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => handleInviteClick(user)}
                          className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'rgba(66, 153, 225, 0.1)',
                            color: '#63B3ED',
                            border: '1px solid rgba(66, 153, 225, 0.4)'
                          }}
                          disabled={!user || inviteMutation.isLoading}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Invite
                        </button>
                        <button 
                          onClick={() => navigate(`/user/${user._id}`)}
                          className="flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #2C5282, #1A365D)',
                            color: 'white',
                            border: '1px solid rgba(66, 153, 225, 0.5)',
                            boxShadow: '0 4px 15px rgba(66, 153, 225, 0.2)'
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Profile
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
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No teammates found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or check back later for new teammates
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Popular Skills */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Popular Skills</h3>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                reset({ skills: skill })
                setFilters({ skills: skill })
                refetch()
              }}
              className="px-3 py-1.5 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/30 transition-colors text-sm"
            >
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
              <Send className="w-6 h-6" style={{ color: 'var(--sunset-orange)' }} />
              Invite to Team
            </h2>
            <button
              onClick={handleCloseInviteModal}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selected User Info */}
          {selectedUser && (
            <div className="mb-6 p-4 rounded-xl glass-3d border border-white/10">
              <div className="flex items-center gap-3">
                {selectedUser.profile_image ? (
                  <img
                    src={selectedUser.profile_image}
                    alt={selectedUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedUser.college} • {selectedUser.branch}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Team *
            </label>
            {myTeamsData?.data?.teams?.length > 0 ? (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400/50 transition-all duration-300"
              >
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
                <button
                  onClick={() => {
                    handleCloseInviteModal()
                    navigate('/teams')
                  }}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Create Team
                </button>
              </div>
            )}
          </div>

          {/* Invite Message */}
          {myTeamsData?.data?.teams?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Message (Optional)
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personal message to your invitation..."
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400/50 transition-all duration-300 resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          {myTeamsData?.data?.teams?.length > 0 && (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCloseInviteModal}
                className="px-6 py-3 glass-3d rounded-xl hover:bg-white/10 transition-all duration-300 font-medium"
                style={{ color: 'var(--cream-white)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={!selectedTeam || inviteMutation.isLoading}
                className="btn-sunset px-6 py-3 flex items-center gap-2 hover:scale-105"
              >
                {inviteMutation.isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

export default TeammateFinder
