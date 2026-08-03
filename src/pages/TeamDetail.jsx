import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
  Mail,
  Trash2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Tag,
  Check,
  X,
  Trophy
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'

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
    () => api.get(`/teams/${id}`).then(res => res.data),
    { enabled: !!id }
  )

  // Fetch join requests (for team leader)
  const { data: joinRequestsData } = useQuery(
    ['teamJoinRequests', id],
    () => api.get(`/teams/${id}/join-requests`).then(res => res.data),
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

  // Delete team mutation
  const deleteTeamMutation = useMutation(
    () => api.delete(`/teams/${id}`),
    {
      onSuccess: () => {
        toast.success('Team deleted successfully')
        navigate('/teams')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete team')
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

  const handleDeleteTeam = () => {
    if (window.confirm('Are you sure you want to delete this team? This will delete all messages, requests and notifications permanently.')) {
      deleteTeamMutation.mutate()
    }
  }

  const handleRemoveMember = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      removeMemberMutation.mutate(memberId)
    }
  }

  const handleStartChat = (userId) => {
    navigate(`/chat?user=${userId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!teamData?.data?.team) {
    return (
      <div className="text-center py-16 space-y-4">
        <Users className="w-16 h-16 text-gray-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Team Not Found</h3>
        <p className="text-sm text-gray-400">
          The team you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/teams')} className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold">
          Back to All Teams
        </button>
      </div>
    )
  }

  const team = teamData.data.team
  const isLeader = team.leader_id?._id === user?._id
  const isMember = team.members?.some(member => member.user_id?._id === user?._id || member.user_id === user?._id)
  const isFull = team.current_members >= team.max_members
  const canJoin = team.status === 'Open' && !isFull && !isMember
  const memberPercent = Math.min(100, Math.round(((team.current_members || 1) / (team.max_members || 4)) * 100))

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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-red-400" />
          Recruitment Closed
        </span>
      )
    }

    if (diffDays <= 1) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse flex items-center gap-1.5 shadow-lg">
          <Clock className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 animate-bounce" />
          🔥 Closes Today!
        </span>
      )
    }

    if (diffDays <= 3) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          ⚡ {diffDays} Days Left!
        </span>
      )
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
        {diffDays}d left ({target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* Top Header Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={() => navigate('/teams')}
            className="btn-secondary flex items-center justify-center text-xs sm:text-sm py-2 px-3.5 rounded-xl font-semibold flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Teams
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-white truncate tracking-tight">Team Workspace Details</h1>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {canJoin && (
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn-sunset flex items-center justify-center text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold shadow-lg w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Team
            </button>
          )}

          {isMember && (
            <Link
              to="/chat"
              className="btn-secondary text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              Open Team Chat
            </Link>
          )}

          {isMember && !isLeader && (
            <button
              onClick={handleLeaveTeam}
              disabled={leaveTeamMutation.isLoading}
              className="btn-danger flex items-center justify-center text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Leave Team
            </button>
          )}

          {isLeader && (
            <button
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isLoading}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {deleteTeamMutation.isLoading ? 'Deleting...' : 'Delete Team'}
            </button>
          )}
        </div>
      </div>

      {/* Hero Team Banner Card */}
      <div className="card relative overflow-hidden p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)'
        }}>
        {/* Ambient Glow Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Main Info */}
          <div className="flex-1 min-w-0 space-y-5">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {team.leader_id?.profile_image ? (
                  <div className="relative flex-shrink-0" title={`Leader: ${team.leader_id?.name || 'Leader'}`}>
                    <img
                      src={team.leader_id.profile_image}
                      alt={team.leader_id?.name || team.team_name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] shadow-md border border-black">
                      👑
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0 border border-white/20 bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600"
                  >
                    {team.team_name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                )}
                
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words">{team.team_name}</h2>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      team.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      team.status === 'Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {team.status === 'Open' ? '🟢 Recruiting' : team.status === 'Full' ? '🟡 Full' : team.status}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-orange-400 truncate">{team.project_title}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Overview & Objectives</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line">{team.description}</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Capacity Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-orange-400" /> Member Capacity
                  </span>
                  <span className="font-bold text-white">{memberPercent}%</span>
                </div>
                <p className="text-xl font-black text-white">
                  {team.current_members} / {team.max_members} <span className="text-xs text-gray-400 font-normal">Members</span>
                </p>
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

              {/* Hackathon Name Card */}
              {team.hackathon_name ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" /> Hackathon Event
                  </span>
                  <p className="text-sm font-bold text-white truncate">{team.hackathon_name}</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-blue-400" /> Category
                  </span>
                  <p className="text-sm font-bold text-white truncate">Academic / Personal Project</p>
                </div>
              )}

              {/* Deadline Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" /> Deadline Status
                </span>
                <div>
                  {team.deadline ? getDeadlineBadge(team.deadline) : <span className="text-xs text-gray-400 font-semibold">No Deadline Set</span>}
                </div>
              </div>

            </div>

            {/* Required Skills Tags */}
            {team.required_skills?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Required Skills & Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {team.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/15 text-orange-300 rounded-xl border border-orange-500/30 text-xs font-semibold shadow-sm"
                    >
                      {skill.skill_name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Widget: Team Leader Card */}
          <div className="lg:w-80 shrink-0 space-y-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" /> Team Leader
                </h3>
                {isLeader && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">YOU</span>}
              </div>

              <div className="flex items-center space-x-3">
                {team.leader_id?.profile_image ? (
                  <img
                    src={team.leader_id.profile_image}
                    alt={team.leader_id.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {team.leader_id?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{team.leader_id?.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{team.leader_id?.college || 'KNIT Sultanpur'}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{team.leader_id?.branch} • Year {team.leader_id?.year}</p>
                </div>
              </div>

              {isMember && !isLeader && (
                <button
                  onClick={() => handleStartChat(team.leader_id._id)}
                  className="w-full btn-sunset text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Leader
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Tabs Section */}
      <div className="card space-y-6 border border-white/10 p-5 sm:p-6">
        
        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📌 Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'members'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👥 Team Members</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
              {team.current_members}
            </span>
          </button>
          {isLeader && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📬 Join Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                (joinRequestsData?.joinRequests?.length || 0) > 0 ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/20 text-white'
              }`}>
                {joinRequestsData?.joinRequests?.length || 0}
              </span>
            </button>
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-semibold">Recruitment Status</span>
                <p className="text-lg font-bold text-white">{team.status}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-semibold">Max Members Limit</span>
                <p className="text-lg font-bold text-white">{team.max_members} Teammates</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-semibold">Required Tech Skills</span>
                <p className="text-lg font-bold text-white">{team.required_skills?.length || 0} Skills</p>
              </div>
            </div>

            {team.tags?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {team.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 text-gray-300 rounded-xl text-xs font-semibold border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Members */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" /> Active Team Members
            </h3>

            {team.members?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member, index) => {
                  const userObj = member.user_id || {}
                  const userId = userObj._id || userObj
                  const displayName = userObj.name || `Teammate ${index + 1}`
                  const displayCollege = userObj.college || 'KNIT Student'
                  const displayBranch = userObj.branch || 'Tech'
                  const displayYear = userObj.year || '3'

                  return (
                    <div key={member._id || index} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                        {userObj.profile_image ? (
                          <img
                            src={userObj.profile_image}
                            alt={displayName}
                            className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                            <span className="truncate">{displayName}</span>
                            {member.role === 'Leader' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">👑 LEADER</span>}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">{displayCollege}</p>
                          <p className="text-[11px] text-gray-500 font-medium truncate">{displayBranch} • Year {displayYear}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {userId !== user?._id && isMember && (
                          <button
                            onClick={() => handleStartChat(userId)}
                            className="btn-secondary text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5 text-orange-400" />
                            <span>Chat</span>
                          </button>
                        )}

                        {isLeader && userId !== user?._id && member.role !== 'Leader' && (
                          <button
                            onClick={() => handleRemoveMember(member._id, displayName)}
                            disabled={removeMemberMutation.isLoading}
                            className="btn-danger text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1"
                            title="Remove member"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No members found.</p>
            )}
          </div>
        )}

        {/* Tab 3: Join Requests (Leader Only) */}
        {activeTab === 'requests' && isLeader && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-400" /> Pending Candidate Join Requests
            </h3>

            {joinRequestsData?.data?.joinRequests?.length > 0 ? (
              <div className="space-y-3">
                {joinRequestsData.data.joinRequests.map((request) => (
                  <div key={request._id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                        {request.user_id?.profile_image ? (
                          <img
                            src={request.user_id.profile_image}
                            alt={request.user_id.name}
                            className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                            {request.user_id?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white text-sm truncate">{request.user_id?.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{request.user_id?.college || 'KNIT Student'}</p>
                          <p className="text-[11px] text-gray-500 truncate">{request.user_id?.branch} • Year {request.user_id?.year}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          disabled={acceptRequestMutation.isLoading}
                          className="btn-sunset text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={rejectRequestMutation.isLoading}
                          className="btn-secondary text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1 text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>

                    {request.message && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 italic">
                        "{request.message}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No pending join requests for this team.</p>
            )}
          </div>
        )}

      </div>

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md card p-6 space-y-5 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" /> Apply to Join Team
              </h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <h3 className="font-bold text-white text-sm">{team.team_name}</h3>
                <p className="text-xs text-orange-400 font-semibold">{team.project_title}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Applicant Note / Introduction (Optional)
                </label>
                <textarea
                  className="input w-full resize-none text-xs"
                  rows={3}
                  placeholder="Introduce yourself, your skills, and why you want to join this project team..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleJoinTeam}
                  disabled={joinTeamMutation.isLoading}
                  className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold shadow-md"
                >
                  {joinTeamMutation.isLoading ? 'Sending Request...' : 'Submit Request'}
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
