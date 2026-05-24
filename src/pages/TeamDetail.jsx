import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Users, 
  Calendar, 
  MapPin, 
  Code, 
  MessageCircle,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  EyeOff,
  User,
  Crown,
  Shield,
  ArrowLeft,
  Mail
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const TeamDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch team details
  const { data: teamData, isLoading } = useQuery(
    ['team', id],
    () => api.get(`/teams/${id}`).then(res => {
      console.log('Team API Response:', res.data)
      return res.data
    }),
    { enabled: !!id }
  )

  // Fetch join requests (for team leader)
  const { data: joinRequestsData } = useQuery(
    ['teamJoinRequests', id],
    () => api.get(`/teams/${id}/join-requests`).then(res => {
      console.log('Join Requests Response:', res.data)
      return res.data
    }),
    { 
      enabled: !!id && teamData?.data?.team?.leader_id?._id === user?._id
    }
  )

  // Join team mutation
  const joinTeamMutation = useMutation(
    (message) => api.post(`/teams/${id}/join-request`, { message }),
    {
      onSuccess: () => {
        toast.success('Join request sent successfully!')
        setShowJoinModal(false)
        setJoinMessage('')
        queryClient.invalidateQueries(['teamJoinRequests'])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send join request')
      }
    }
  )

  // Accept request mutation
  const acceptRequestMutation = useMutation(
    (requestId) => api.post(`/teams/${id}/accept-request/${requestId}`),
    {
      onSuccess: () => {
        toast.success('Join request accepted!')
        queryClient.invalidateQueries(['teamJoinRequests'])
        queryClient.invalidateQueries(['team'])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to accept request')
      }
    }
  )

  // Reject request mutation
  const rejectRequestMutation = useMutation(
    (requestId) => api.post(`/teams/${id}/reject-request/${requestId}`),
    {
      onSuccess: () => {
        toast.success('Join request rejected!')
        queryClient.invalidateQueries(['teamJoinRequests'])
        queryClient.invalidateQueries(['team'])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to reject request')
      }
    }
  )

  // Leave team mutation
  const leaveTeamMutation = useMutation(
    () => api.post(`/teams/${id}/leave`),
    {
      onSuccess: () => {
        toast.success('You have left the team successfully')
        navigate('/teams')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to leave team')
      }
    }
  )

  // Remove member mutation
  const removeMemberMutation = useMutation(
    (memberId) => api.delete(`/teams/${id}/members/${memberId}`),
    {
      onSuccess: () => {
        toast.success('Member removed successfully')
        queryClient.invalidateQueries(['team'])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove member')
      }
    }
  )

  const handleJoinTeam = () => {
    if (!user) {
      toast.error('Please login to join a team')
      navigate('/login')
      return
    }
    joinTeamMutation.mutate(joinMessage)
  }

  const handleAcceptRequest = (requestId) => {
    acceptRequestMutation.mutate(requestId)
  }

  const handleRejectRequest = (requestId) => {
    rejectRequestMutation.mutate(requestId)
  }

  const handleLeaveTeam = () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      leaveTeamMutation.mutate()
    }
  }

  const handleRemoveMember = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      removeMemberMutation.mutate(memberId)
    }
  }

  const handleStartChat = (userId) => {
    // Navigate to chat with this user
    navigate(`/chat?user=${userId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  console.log('Team Data in component:', teamData)
  console.log('Team Data Structure:', JSON.stringify(teamData, null, 2))
  console.log('teamData?.data?.team:', teamData?.data?.team)
  console.log('teamData?.data:', teamData?.data)

  if (!teamData?.data?.team) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Team Not Found</h3>
        <p className="text-gray-400 mb-6">
          The team you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/teams')} className="btn-primary">
          Back to Teams
        </button>
      </div>
    )
  }

  const team = teamData.data.team
  const isLeader = team.leader_id._id === user?._id
  const isMember = team.members?.some(member => member.user_id._id === user?._id)
  const isFull = team.current_members >= team.max_members
  const canJoin = team.status === 'Open' && !isFull && !isMember

  console.log('Team Debug:', {
    teamLeaderId: team.leader_id._id,
    userId: user?._id,
    isLeader,
    activeTab,
    joinRequestsData
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/teams')}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </button>
          <h1 className="text-3xl font-bold text-white">Team Details</h1>
        </div>
        
        {canJoin && (
          <button
            onClick={() => setShowJoinModal(true)}
            className="btn-primary flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Join Team
          </button>
        )}
        
        {isMember && !isLeader && (
          <button
            onClick={handleLeaveTeam}
            disabled={leaveTeamMutation.isLoading}
            className="btn-danger flex items-center"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Leave Team
          </button>
        )}
      </div>

      {/* Team Overview Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Team Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{team.team_name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    team.status === 'Open' ? 'bg-green-400/20 text-green-400' :
                    team.status === 'Full' ? 'bg-yellow-400/20 text-yellow-400' :
                    team.status === 'Closed' ? 'bg-red-400/20 text-red-400' :
                    'bg-blue-400/20 text-blue-400'
                  }`}>
                    {team.status}
                  </div>
                  {isFull && <span className="text-orange-400">Team Full</span>}
                </div>
              </div>
              
              {isLeader && (
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Leader</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Project</h3>
                <p className="text-xl text-primary-400">{team.project_title}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{team.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl glass">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span className="font-medium text-white">Members</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {team.current_members}/{team.max_members}
                  </p>
                </div>

                {team.hackathon_name && (
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-primary-400" />
                      <span className="font-medium text-white">Hackathon</span>
                    </div>
                    <p className="text-gray-300">{team.hackathon_name}</p>
                  </div>
                )}

                {team.deadline && (
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-primary-400" />
                      <span className="font-medium text-white">Deadline</span>
                    </div>
                    <p className="text-gray-300">
                      {new Date(team.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Required Skills */}
              {team.required_skills && team.required_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full border border-primary-400/30"
                      >
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Leader */}
          <div className="lg:w-80">
            <div className="p-6 rounded-xl glass">
              <h3 className="text-lg font-semibold text-white mb-4">Team Leader</h3>
              <div className="flex items-center space-x-4">
                {team.leader_id.profile_image ? (
                  <img
                    src={team.leader_id.profile_image}
                    alt={team.leader_id.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-400/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {team.leader_id.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-white">{team.leader_id.name}</h4>
                  <p className="text-sm text-gray-400">{team.leader_id.college}</p>
                  <p className="text-sm text-gray-500">{team.leader_id.branch} • {team.leader_id.year}yr</p>
                </div>
              </div>
              
              {isMember && !isLeader && (
                <button
                  onClick={() => handleStartChat(team.leader_id._id)}
                  className="w-full mt-4 btn-primary flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Leader
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Members ({team.current_members})
          </button>
          {isLeader && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'text-white border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Join Requests ({joinRequestsData?.joinRequests?.length || 0})
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Team Statistics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-primary-400" />
                      <span className="text-2xl font-bold text-white">{team.current_members}</span>
                    </div>
                    <p className="text-gray-400">Current Members</p>
                  </div>
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-primary-400" />
                      <span className="text-2xl font-bold text-">{team.max_members}</span>
                    </div>
                    <p className="text-gray-400">Max Members</p>
                  </div>
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center justify-between mb-2">
                      <Code className="w-5 h-5 text-primary-400" />
                      <span className="text-2xl font-bold text-white">{team.required_skills?.length || 0}</span>
                    </div>
                    <p className="text-gray-400">Required Skills</p>
                  </div>
                </div>
              </div>

              {team.tags && team.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
              {team.members && team.members.length > 0 ? (
                <div className="space-y-4">
                  {team.members.map((member, index) => {
                    console.log(`Member ${index}:`, member)
                    console.log(`Member user_id:`, member.user_id)
                    
                    // Safety check for member data
                    if (!member.user_id) {
                      console.warn('Member missing user_id:', member)
                      return (
                        <div key={member._id || index} className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">?</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">Unknown Member</h4>
                              <p className="text-sm text-gray-400">Data not available</p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    const user = member.user_id || {}
                    
                    // Handle the actual data structure we're getting
                    const userId = user._id || user
                    const userSkills = user.skills || []

                    
                    // Create a more meaningful display from available data
                    const displayName = user.name || `Team Member ${index + 1}`
                    const displayEmail = user.email || `${userId?.slice(-6)}@teamzen.com`
                    const displayCollege = user.college || 'Team Member'
                    const displayBranch = user.branch || 'Tech'
                    const displayYear = user.year || '2024'
                    const profileImage = user.profile_image
                    
                    console.log('Processed member data:', {
                        userId,
                        displayName,
                        displayEmail,
                        displayCollege,
                        userSkills: userSkills.length
                    })
                    
                    return (
                    <div key={member._id || index} className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-white">{displayName}</h4>
                          <p className="text-sm text-gray-400">{displayCollege} • {displayBranch} • {displayYear}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          member.role === 'Leader' ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-blue-400/20 text-blue-400'
                        }`}>
                          {member.role}
                        </span>
                        
                        {member.user_id._id !== user?._id && isMember && (
                          <button
                            onClick={() => handleStartChat(member.user_id._id)}
                            className="btn-outline text-sm px-3 py-1.5 flex items-center"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Message
                          </button>
                        )}
                        
                        {isLeader && member.user_id._id !== user?._id && member.role !== 'Leader' && (
                          <button
                            onClick={() => handleRemoveMember(member._id, displayName)}
                            disabled={removeMemberMutation.isLoading}
                            className="btn-danger text-sm px-3 py-1.5 flex items-center"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                </div>
              ) : (
                <p className="text-gray-400">No members yet.</p>
              )}
            </div>
          )}

          {/* Join Requests Tab (Leader Only) */}
          {activeTab === 'requests' && isLeader && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Join Requests</h3>
              {joinRequestsData?.data?.joinRequests && joinRequestsData.data.joinRequests.length > 0 ? (
                <div className="space-y-4">
                  {joinRequestsData.data.joinRequests.map((request) => (
                    <div key={request._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {request.user_id.profile_image ? (
                            <img
                              src={request.user_id.profile_image}
                              alt={request.user_id.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/30"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {request.user_id.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-white">{request.user_id.name}</h4>
                            <p className="text-sm text-gray-400">{request.user_id.college}</p>
                            <p className="text-sm text-gray-500">{request.user_id.branch} • {request.user_id.year}yr</p>
                            {request.message && (
                              <p className="text-sm text-gray-300 mt-1 italic">"{request.message}"</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={acceptRequestMutation.isLoading}
                            className="btn-primary text-sm px-3 py-1.5 flex items-center"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={rejectRequestMutation.isLoading}
                            className="btn-outline text-sm px-3 py-1.5 flex items-center"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No join requests yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
          <div className="w-full max-w-md card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Join Team</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-2">{team.team_name}</h3>
                <p className="text-sm text-gray-400">{team.project_title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message (optional)
                </label>
                <textarea
                  className="input w-full resize-none"
                  rows={3}
                  placeholder="Why do you want to join this team?"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinTeam}
                  disabled={joinTeamMutation.isLoading}
                  className="btn-primary"
                >
                  {joinTeamMutation.isLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamDetail
