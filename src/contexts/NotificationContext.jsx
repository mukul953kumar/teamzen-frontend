import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useAuth } from './useAuth'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { getBackendURL } from '../config/api'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef(null)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await api.get('/notifications')
      const data = response.data.data || { notifications: [] }
      setNotifications(data.notifications || [])
      setUnreadCount(data.notifications?.filter(n => !n.is_read).length || 0)
    } catch (err) {
      console.error('Fetch notifications error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // WebSocket connection
  useEffect(() => {
    if (!user?._id) return

    fetchNotifications()

    const socket = io(getBackendURL(), {
      transports: ['websocket', 'polling']
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('register', user._id)
    })

    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      toast(notification.title || 'New notification', { icon: '🔔' })
    })

    return () => {
      socket.disconnect()
    }
  }, [user?._id])

  const markAsReadMutation = useMutation(
    async (notificationId) => {
      await api.put(`/notifications/${notificationId}/read`)
      return notificationId
    },
    {
      onSuccess: (notificationId) => {
        setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  )

  const markAllAsReadMutation = useMutation(
    async () => { await api.put('/notifications/mark-all-read') },
    {
      onSuccess: () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    }
  )

  const deleteNotificationMutation = useMutation(
    async (notificationId) => {
      await api.delete(`/notifications/${notificationId}`)
      return notificationId
    },
    {
      onSuccess: (notificationId) => {
        const deleted = notifications.find(n => n._id === notificationId)
        setNotifications(prev => prev.filter(n => n._id !== notificationId))
        if (deleted && !deleted.is_read) setUnreadCount(prev => Math.max(0, prev - 1))
      },
      onError: () => toast.error('Failed to delete notification')
    }
  )

  const actionNotifications = notifications.filter(n => !n.is_read)
  const recentNotifications = notifications.slice(0, 5)

  const value = {
    notifications,
    unreadCount,
    isLoading,
    recentNotifications,
    actionNotifications,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    refreshNotifications: fetchNotifications,
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
