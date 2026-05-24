import React, { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, Users, MessageCircle, Trophy, FolderOpen, AlertCircle } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  
  const { 
    notifications, 
    unreadCount, 
    recentNotifications,
    actionNotifications,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    isLoading,
    isMarkingAllAsRead
  } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'team_invite':
      case 'team_join_request':
      case 'team_request_accepted':
      case 'team_request_rejected':
        return <Users className="w-4 h-4" />
      case 'message':
        return <MessageCircle className="w-4 h-4" />
      case 'project_invite':
        return <FolderOpen className="w-4 h-4" />
      case 'mention':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  // Get icon background color based on type
  const getIconColor = (type) => {
    switch (type) {
      case 'team_invite':
        return 'bg-blue-500/20 text-blue-400'
      case 'team_join_request':
        return 'bg-orange-500/20 text-orange-400'
      case 'team_request_accepted':
        return 'bg-green-500/20 text-green-400'
      case 'team_request_rejected':
        return 'bg-red-500/20 text-red-400'
      case 'message':
        return 'bg-purple-500/20 text-purple-400'
      case 'project_invite':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification._id)
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      navigate(notification.action_url)
    }

    setIsOpen(false)
  }

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation()
    markAllAsRead()
  }

  const handleDelete = (e, notificationId) => {
    e.stopPropagation()
    deleteNotification(notificationId)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg glass-3d hover:bg-white/10 transition-all duration-300"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-dark-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-sm text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllAsRead}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="small" />
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="divide-y divide-white/10">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notification.is_read ? 'bg-blue-500/5' : ''
                    } ${notification.action_required ? 'border-l-2 border-orange-400' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            {notification.action_required && (
                              <p className="text-xs text-orange-400 mt-1 font-medium">
                                Action Required
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {/* Time */}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleTimeString()} • 
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  You'll see team invites, messages, and updates here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  navigate('/notifications')
                  setIsOpen(false)
                }}
                className="w-full text-center text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
