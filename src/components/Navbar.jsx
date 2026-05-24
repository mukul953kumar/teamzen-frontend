import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Search, 
  MessageCircle, 
  Trophy, 
  User,
  LogOut,
  Zap,
  Shield
} from 'lucide-react'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Find Team', icon: Search, path: '/teammate-finder' },
    { name: 'Teams', icon: Users, path: '/teams' },
    { name: 'Projects', icon: Trophy, path: '/projects' },
    { name: 'Achievements', icon: Trophy, path: '/achievements' }
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-3d border-b border-orange-400/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--sunset-gradient)' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--cream-white)' }}>TeamZen</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActivePath(item.path)
                        ? 'glass-3d border-orange-400/50'
                        : 'hover:bg-orange-400/10'
                    }`}
                  >
                    <Icon 
                      className="w-4 h-4" 
                      style={{ 
                        color: isActivePath(item.path) ? 'var(--sunset-orange)' : 'var(--cream-white)' 
                      }} 
                    />
                    <span 
                      className="font-medium"
                      style={{ 
                        color: isActivePath(item.path) ? 'var(--sunset-orange)' : 'var(--cream-white)' 
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <NotificationBell />
              <button className="glass-3d px-4 py-2 rounded-xl hover:bg-orange-400/10 transition-all duration-300">
                <Shield className="w-4 h-4" style={{ color: 'var(--sunset-orange)' }} />
              </button>
              <Link 
                to="/login" 
                className="btn-sunset text-sm px-6 py-2"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
                style={{ background: 'var(--coral-gradient)' }}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden glass-3d p-2 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" style={{ color: 'var(--cream-white)' }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: 'var(--cream-white)' }} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-full glass-3d"
              style={{ background: 'var(--warm-gradient)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold" style={{ color: 'var(--warm-gray)' }}>Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10"
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--warm-gray)' }} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                          isActivePath(item.path)
                            ? 'bg-orange-400/20 border-orange-400/50'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ 
                            color: isActivePath(item.path) ? 'var(--sunset-orange)' : 'var(--cream-white)' 
                          }} 
                        />
                        <span 
                          className="font-medium text-lg"
                          style={{ 
                            color: isActivePath(item.path) ? 'var(--sunset-orange)' : 'var(--cream-white)' 
                          }}
                        >
                          {item.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-8 space-y-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full glass-3d p-4 rounded-xl hover:bg-orange-400/10 transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-3" style={{ color: 'var(--sunset-orange)' }} />
                    <span style={{ color: 'var(--cream-white)' }} className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full btn-sunset p-4"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
