import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { Home, User, Users, Search, MessageCircle, Trophy, LogOut, Menu, X, Bell, Flame, FolderOpen, Rocket } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const { isDarkMode } = useTheme()

  const overlayBg = 'rgba(11, 13, 23, 0.95)'

  const getBackgroundImage = () => {
    return 'none'
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Teammate Finder', href: '/teammate-finder', icon: Search },
    { name: 'Hackathons', href: '/hackathons', icon: Rocket, badge: 'LIVE' },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Invitations', href: '/teams/invitations', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
  ]

  const isActive = (href) => location.pathname === href
  const isChatPage = location.pathname === '/chat' || location.pathname.startsWith('/chat/')

  return (
    <div className="h-screen flex overflow-hidden w-full max-w-full bg-[#0B0D17] text-slate-100">
      {/* Sidebar (Developer Studio Tactical Dark) */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 border-r border-slate-800 transform transition-transform duration-300 ease-in-out max-w-[16rem] bg-slate-950/95 shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="py-3 px-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center justify-between relative">
              <Link to="/dashboard" className="flex items-center gap-2">
                <img src="/images/logo26.png" alt="TeamZen" className="h-10 w-auto max-w-full object-contain" />
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto font-mono text-xs">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User + Logout */}
          <div className="p-3 border-t border-slate-800 flex-shrink-0 font-mono">
            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-center overflow-hidden flex-shrink-0 text-emerald-400 font-bold text-xs">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" /> {user?.loginStreak || 1}d
                  </span>
                  <span className="text-[10px] text-slate-400">· ⚡ {user?.zenPoints || 10} Pts</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-2.5 w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-mono text-rose-400 hover:bg-rose-950/40 rounded-xl border border-rose-900/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full max-w-full bg-[#0B0D17]">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-slate-800 py-2.5 px-3 sm:px-4 flex-shrink-0 bg-slate-950/95 shadow-md">
          <div className="flex items-center justify-between gap-2">
            {/* Left Hamburger menu */}
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 flex-shrink-0 text-white" aria-label="Open Navigation Menu">
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo in Center */}
            <Link to="/dashboard" className="flex items-center justify-center min-w-0">
              <img src="/images/logo26.png" alt="TeamZen" className="h-10 sm:h-12 w-auto max-w-[130px] object-contain" />
            </Link>

            {/* Right Top Header Actions: Notification Bell + Profile Avatar */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Notification Bell */}
              <Link
                to="/teams/invitations"
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-white flex items-center justify-center"
                title="Notifications & Invitations"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1 shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="relative p-0.5 rounded-xl bg-slate-900 border border-emerald-500/40 hover:scale-105 transition-all shadow-md flex-shrink-0"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-emerald-400">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className={`flex-1 ${
          isChatPage 
            ? 'p-1.5 sm:p-4 pb-[72px] lg:pb-4 flex flex-col min-h-0 overflow-hidden' 
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
            { href: '/hackathons', icon: Rocket, label: 'Hackathons', isLive: true },
            { href: '/teams', icon: Users, label: 'Teams' },
            { href: '/chat', icon: MessageCircle, label: 'Chat', badge: unreadCount > 0 ? unreadCount : null },
            { href: '/teammate-finder', icon: Search, label: 'Match' },
            { href: '/profile', icon: User, label: 'Profile' },
          ].map(({ href, icon: Icon, label, badge, isLive }) => {
            const active = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href))
            return (
              <Link
                key={href}
                to={href}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[48px] py-1 px-2 rounded-2xl transition-all duration-200 active:scale-95 font-mono"
                style={active ? {
                  background: 'rgba(16,185,129,0.15)',
                } : {}}
              >
                {/* Active glow pill */}
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                )}

                <div className="relative">
                  <Icon
                    className="transition-all duration-200"
                    style={{
                      width: 20,
                      height: 20,
                      color: active ? '#34d399' : 'rgba(255,255,255,0.45)',
                      filter: active ? 'drop-shadow(0 0 6px rgba(52,211,153,0.6))' : 'none',
                      strokeWidth: active ? 2.2 : 1.8
                    }}
                  />
                  {isLive && !active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
                  )}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', boxShadow: '0 0 6px rgba(249,115,22,0.5)' }}>
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>

                <span
                  className="text-[9px] font-bold tracking-wide transition-all duration-200"
                  style={{ color: active ? '#6ee7b7' : 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}
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
