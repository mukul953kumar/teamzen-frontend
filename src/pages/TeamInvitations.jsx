import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Bell,
  Clock,
  Loader2,
  Check,
  X,
  Sparkles,
  Send
} from 'lucide-react'
import { useAuth } from '../contexts/useAuth'
import { useNotifications } from '../contexts/NotificationContext'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const TeamInvitations = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { refreshNotifications } = useNotifications()

  // Fetch join requests (invitations)
  const { data: invitationsData, isLoading } = useQuery(
    'teamInvitations',
    async () => {
      const response = await api.get('/teams/join-requests')
      return response.data
    },
    {
      enabled: !!user,
      retry: 1
    }
  )

  // Accept invitation mutation
  const acceptMutation = useMutation(
    async (requestId) => {
      const response = await api.put(`/teams/join-request/${requestId}/respond`, {
        status: 'Accepted'
      })
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Invitation accepted! Welcome to the team.')
        queryClient.invalidateQueries('teamInvitations')
        queryClient.invalidateQueries('notifications')
        queryClient.invalidateQueries('dashboard')
        refreshNotifications()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to accept invitation')
      }
    }
  )

  // Reject invitation mutation
  const rejectMutation = useMutation(
    async (requestId) => {
      const response = await api.put(`/teams/join-request/${requestId}/respond`, {
        status: 'Rejected'
      })
      return response.data
    },
    {
      onSuccess: () => {
        toast.success('Invitation rejected')
        queryClient.invalidateQueries('teamInvitations')
        queryClient.invalidateQueries('notifications')
        refreshNotifications()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to reject invitation')
      }
    }
  )

  const invitations = invitationsData?.data?.requests?.filter(
    req => req.status === 'Pending' && req.type === 'invitation'
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* Header Navigation */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Team Invitations Workspace</h1>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-8 shadow-2xl space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 13, 20, 0.95) 0%, rgba(20, 20, 35, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-400" />
              <span>Pending Team Invitations</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Review team invitations sent to you by other student team leaders.</p>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 ${
            invitations.length > 0 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 animate-pulse' : 'bg-white/10 text-gray-300 border border-white/10'
          }`}>
            {invitations.length} Pending
          </span>
        </div>
      </div>

      {/* Invitations List */}
      <div className="card p-5 sm:p-6 border border-white/10 space-y-4">
        {invitations.length > 0 ? (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div 
                key={invitation._id}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all shadow-xl space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Team Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md border border-white/20">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-base font-bold text-white truncate">
                        {invitation.team?.team_name || 'Unnamed Team'}
                      </h3>
                      <p className="text-xs text-orange-400 font-semibold truncate">
                        {invitation.team?.project_title || 'Project'}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                          {invitation.team?.current_members || 1}/{invitation.team?.max_members || 4} Members
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(invitation.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {invitation.message && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 italic mt-2">
                          "{invitation.message}"
                        </div>
                      )}

                      <p className="text-[11px] text-gray-500 font-medium pt-1">
                        Invited by: <strong className="text-gray-300">{invitation.sender?.name || 'Team Leader'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => rejectMutation.mutate(invitation._id)}
                      disabled={rejectMutation.isLoading || acceptMutation.isLoading}
                      className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 flex items-center gap-1.5"
                    >
                      {rejectMutation.isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => acceptMutation.mutate(invitation._id)}
                      disabled={acceptMutation.isLoading || rejectMutation.isLoading}
                      className="btn-sunset text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                    >
                      {acceptMutation.isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Accept & Join</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Bell className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No pending invitations</h3>
            <p className="text-xs text-gray-400">When a team leader invites you to join their project, invitations will appear here!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default TeamInvitations
