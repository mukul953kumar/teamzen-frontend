import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Search, 
  Trophy, 
  Zap,
  Star,
  ArrowRight
} from 'lucide-react'

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Landing page specific navigation items
  const navItems = [
    { name: 'Home', icon: Home, path: '#home' },
    { name: 'Features', icon: Star, path: '#features' },
    { name: 'How It Works', icon: Search, path: '#how-it-works' },
    { name: 'Success Stories', icon: Trophy, path: '#testimonials' },
    { name: 'Live Projects', icon: Users, path: '#live-projects' }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (item) => {
    if (item.path.startsWith('#')) {
      scrollToSection(item.path)
    } else {
      // For external links
      window.location.href = item.path
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-3d border-b border-orange-400/30 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--sunset-gradient)' }}>
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--cream-white)' }}>TeamZen</span>
            </Link>

            {/* Desktop Navigation - Landing Page Specific */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-orange-400/10 hover:scale-105 group"
                  >
                    <Icon className="w-4 h-4 transition-colors duration-300 group-hover:text-orange-400" style={{ color: 'var(--cream-white)' }} />
                    <span className="font-medium text-sm lg:text-base transition-colors duration-300 group-hover:text-orange-400" style={{ color: 'var(--cream-white)' }}>
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right Section - Landing Page CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link 
                to="/login" 
                className="glass-3d px-5 py-3 rounded-xl hover:bg-orange-400/10 transition-all duration-300 font-medium text-sm hover:scale-105"
                style={{ color: 'var(--cream-white)' }}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="btn-sunset text-sm px-5 py-3 flex items-center gap-2 hover:scale-105 shadow-lg"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden glass-3d p-3 rounded-xl hover:bg-orange-400/10 transition-all duration-300"
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
                    className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--warm-gray)' }} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 text-left group"
                      >
                        <Icon className="w-5 h-5 transition-colors duration-300 group-hover:text-orange-500" style={{ color: 'var(--cream-white)' }} />
                        <span className="font-medium text-lg transition-colors duration-300 group-hover:text-orange-500" style={{ color: 'var(--cream-white)' }}>
                          {item.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full glass-3d p-4 rounded-xl hover:bg-orange-400/10 transition-all duration-300 flex items-center gap-3 hover:scale-105"
                  >
                    <span style={{ color: 'var(--cream-white)' }} className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full btn-sunset p-4 flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
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

export default LandingNavbar
