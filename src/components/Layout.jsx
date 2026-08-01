import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { Home, User, Users, Search, MessageCircle, Trophy, LogOut, Menu, X, Bell, Flame, FolderOpen } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const { isDarkMode } = useTheme()

  const overlayBg = isDarkMode ? 'rgba(0,0,0,0.80)' : 'rgba(10,10,10,0.65)'

  const getBackgroundImage = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'url("/images/image1.png")'
    if (path === '/profile' || path.startsWith('/user/')) return 'url("/images/image2.png")'
    if (path === '/teams' || path.startsWith('/teams/')) return 'url("/images/image3.png")'
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
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Invitations', href: '/teams/invitations', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
  ]

  const isActive = (href) => location.pathname === href
  const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')

  return (
    <div className="h-screen flex overflow-hidden w-full max-w-full">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 border-r border-white/10 transform transition-transform duration-300 ease-in-out max-w-[16rem]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ backgroundImage: 'url("/images/image2.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0" style={{ background: overlayBg, zIndex: 0 }} />
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="py-3 px-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-center relative">
              <img src="/images/logo26.png" alt="TeamZen" className="h-25 w-auto max-w-full object-contain" />
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute right-0 p-2 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-custom">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User + Logout */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 rounded-xl glass">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-orange-400 font-semibold flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-orange-400" /> {user?.loginStreak || 1}d
                  </span>
                  <span className="text-[10px] text-gray-400">· ⚡ {user?.zenPoints || 10} Pts</span>
                </div>
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full max-w-full">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-white/10 py-2.5 px-3 sm:px-4 flex-shrink-0 relative overflow-hidden shadow-md"
          style={{ backgroundImage: 'url("/images/image2.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0" style={{ background: overlayBg, zIndex: 0 }} />
          <div className="relative z-10 flex items-center justify-between gap-2">
            {/* Left Hamburger menu */}
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex-shrink-0 text-white" aria-label="Open Navigation Menu">
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo in Center */}
            <Link to="/dashboard" className="flex items-center justify-center min-w-0">
              <img src="/images/logo26.png" alt="TeamZen" className="h-14 sm:h-16 w-auto max-w-[130px] sm:max-w-[160px] object-contain" />
            </Link>

            {/* Right Top Header Actions: Notification Bell + Profile Avatar */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Notification Bell */}
              <Link
                to="/teams/invitations"
                className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white flex items-center justify-center"
                title="Notifications & Invitations"
              >
                <Bell className="w-4.5 h-4.5 text-gray-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-lg border border-gray-950">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="relative p-0.5 rounded-xl bg-gradient-to-tr from-primary-400 to-purple-500 hover:scale-105 transition-all shadow-md flex-shrink-0"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-[10px] bg-gray-900 flex items-center justify-center overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className={`flex-1 ${
          isChatPage 
            ? 'p-2 sm:p-4 pb-[72px] lg:pb-4 flex flex-col h-[calc(100dvh-64px)] lg:h-full overflow-hidden' 
            : 'p-4 md:p-6 pb-24 lg:pb-6 overflow-y-auto'
        } overflow-x-hidden w-full max-w-full`} style={{
          backgroundImage: getBackgroundImage(),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: overlayBg, zIndex: 0 }} />
          <div className={`relative z-10 w-full max-w-full ${isChatPage ? 'h-full flex flex-col overflow-hidden' : 'overflow-x-hidden'}`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10, 10, 14, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
        {/* Top shimmer line */}
        <div className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.45), rgba(59,130,246,0.45), transparent)' }} />

        <div className="flex items-center justify-around px-2 py-2 pb-safe"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>

          {[
            { href: '/dashboard', icon: Home, label: 'Home' },
            { href: '/teams', icon: Users, label: 'Teams' },
            { href: '/chat', icon: MessageCircle, label: 'Messages', badge: null },
            { href: '/teammate-finder', icon: Search, label: 'Teammates' },
            { href: '/profile', icon: User, label: 'Profile' },
          ].map(({ href, icon: Icon, label, badge }) => {
            const active = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95"
                style={active ? {
                  background: 'rgba(99,102,241,0.13)',
                } : {}}
              >
                {/* Active glow pill */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)' }} />
                )}

                <div className="relative">
                  <Icon
                    className="transition-all duration-200"
                    style={{
                      width: 22,
                      height: 22,
                      color: active ? '#a78bfa' : 'rgba(255,255,255,0.38)',
                      filter: active ? 'drop-shadow(0 0 6px rgba(167,139,250,0.6))' : 'none',
                      strokeWidth: active ? 2.2 : 1.8
                    }}
                  />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 0 6px rgba(249,115,22,0.5)' }}>
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>

                <span
                  className="text-[10px] font-medium tracking-wide transition-all duration-200"
                  style={{ color: active ? '#c4b5fd' : 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Layout
