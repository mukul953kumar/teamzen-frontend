import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuth } from './AuthContext'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications
  const { data: notificationsData, isLoading, refetch } = useQuery(
    'notifications',
    async () => {
      if (!user) return { notifications: [], unreadCount: 0 }
      
      const response = await api.get('/notifications')
      return response.data.data || { notifications: [], unreadCount: 0 }
    },
    {
      enabled: !!user,
      refetchInterval: 30000, // Refetch every 30 seconds
      refetchOnWindowFocus: true
    }
  )

  // Mark notification as read
  const markAsReadMutation = useMutation(
    async (notificationId) => {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
      },
      onError: (error) => {
        console.error('Mark as read error:', error)
      }
    }
  )

  // Mark all as read
  const markAllAsReadMutation = useMutation(
    async () => {
      const response = await api.put('/notifications/mark-all-read')
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
        toast.success('All notifications marked as read')
      },
      onError: (error) => {
        console.error('Mark all as read error:', error)
        toast.error('Failed to mark notifications as read')
      }
    }
  )

  // Delete notification
  const deleteNotificationMutation = useMutation(
    async (notificationId) => {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
      },
      onError: (error) => {
        console.error('Delete notification error:', error)
        toast.error('Failed to delete notification')
      }
    }
  )

  // Update unread count — all unread notifications
  useEffect(() => {
    const count = notificationsData?.notifications?.filter(n => !n.is_read).length || 0
    setUnreadCount(count)
  }, [notificationsData])

  const refreshNotifications = useCallback(() => {
    refetch()
  }, [refetch])

  // All unread notifications (not just action_required)
  const actionNotifications = notificationsData?.notifications?.filter(n => !n.is_read) || []

  const recentNotifications = notificationsData?.notifications?.slice(0, 5) || []

  const value = {
    notifications: notificationsData?.notifications || [],
    unreadCount,
    isLoading,
    recentNotifications,
    actionNotifications,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    refreshNotifications,
    isMarkingAsRead: markAsReadMutation.isLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
    isDeleting: deleteNotificationMutation.isLoading
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
