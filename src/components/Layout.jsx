import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  User, 
  Users, 
  Search, 
  MessageCircle, 
  Trophy, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'
import { useState } from 'react'
import { useNotifications } from '../contexts/NotificationContext'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { unreadCount } = useNotifications()

  // Dynamic background based on page
  const getBackgroundImage = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'url("/images/image1.png")'
    if (path === '/profile' || path === '/user-profile') return 'url("/images/image2.png")'
    if (path === '/teams' || path.includes('/teams/')) return 'url("/images/image3.png")'
    if (path === '/chat') return 'url("/images/image1.png")'
    if (path === '/teammate-finder') return 'url("/images/image2.png")'
    if (path === '/achievements') return 'url("/images/image3.png")'
    if (path === '/projects') return 'url("/images/image1.png")'
    return 'url("/images/image1.png")'
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Teammate Finder', href: '/teammate-finder', icon: Search },
    { name: 'Teams', href: '/teams', icon: Users },
    { 
      name: 'Invitations', 
      href: '/teams/invitations', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="h-screen flex overflow-hidden w-full">
      {/* Sidebar - Hidden on mobile, visible on lg */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 border-r border-white/10 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{
        backgroundImage: 'url("/images/image2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 0
        }} />
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold neon-text text-white">TeamZen</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive(item.href) 
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-400/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 rounded-xl glass">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.college}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-white/10 p-4 flex-shrink-0 relative"
             style={{
               backgroundImage: 'url("/images/image2.png")',
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
          {/* Dark Overlay */}
          <div className="absolute inset-0" style={{
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 0
          }} />
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold neon-text">TeamZen</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto"
              style={{
                backgroundImage: getBackgroundImage(),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
              }}>
          {/* Dark Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 0
          }} />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
