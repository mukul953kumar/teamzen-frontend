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
  Loader2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
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
  const { data: invitationsData, isLoading, error } = useQuery(
    'teamInvitations',
    async () => {
      try {
        console.log('Fetching invitations...')
        const response = await api.get('/teams/join-requests')
        console.log('API Response:', response)
        return response.data
      } catch (err) {
        console.error('API Error:', err)
        throw err
      }
    },
    {
      enabled: !!user,
      retry: 1,
      onError: (err) => {
        console.error('Query Error:', err)
        toast.error('Failed to load invitations: ' + (err.message || 'Unknown error'))
      }
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

  // Debug logging
  console.log('Raw invitations data:', invitationsData)
  console.log('All requests:', invitationsData?.data?.requests)
  
  const invitations = invitationsData?.data?.requests?.filter(
    req => req.status === 'Pending' && req.type === 'invitation'
  ) || []
  
  console.log('Filtered invitations:', invitations)
  console.log('Invitation count:', invitations.length)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Team Invitations</h1>
          <p className="text-gray-400">
            {invitations.length > 0 
              ? `You have ${invitations.length} pending invitation${invitations.length > 1 ? 's' : ''}`
              : 'No pending invitations'
            }
          </p>
        </div>
      </div>

      {/* Invitations List */}
      {invitations.length > 0 ? (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div 
              key={invitation._id}
              className="card border-l-4 border-primary-400"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Team Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {invitation.team?.team_name || 'Unnamed Team'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {invitation.team?.project_title || 'No project title'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {invitation.team?.current_members || 0}/{invitation.team?.max_members || 0} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {invitation.message && (
                      <p className="text-gray-400 text-sm mt-2 italic">
                        "{invitation.message}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Invited by: {invitation.sender?.name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => rejectMutation.mutate(invitation._id)}
                    disabled={rejectMutation.isLoading || acceptMutation.isLoading}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {rejectMutation.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="ml-2">Reject</span>
                  </button>
                  <button
                    onClick={() => acceptMutation.mutate(invitation._id)}
                    disabled={acceptMutation.isLoading || rejectMutation.isLoading}
                    className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                  >
                    {acceptMutation.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span className="ml-2">Accept</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Pending Invitations</h3>
          <p className="text-gray-400 mb-6">
            You don't have any team invitations at the moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/teammate-finder" className="btn-primary">
              <Users className="w-4 h-4 mr-2" />
              Find Teams
            </Link>
            <Link to="/teams" className="btn-secondary">
              <Users className="w-4 h-4 mr-2" />
              Browse Teams
            </Link>
          </div>
        </div>
      )}

      {/* Past Invitations Link */}
      <div className="text-center">
        <Link 
          to="/teams" 
          className="text-primary-400 hover:text-primary-300 text-sm"
        >
          View all your teams →
        </Link>
      </div>
    </div>
  )
}

export default TeamInvitations
