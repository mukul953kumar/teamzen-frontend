import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Zap,
  Users,
  Trophy,
  Shield,
  MessageCircle
} from 'lucide-react'

import TermsModal from './TermsModal'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [termsTab, setTermsTab] = useState('terms')

  const openTerms = (tab) => {
    setTermsTab(tab)
    setIsTermsOpen(true)
  }

  const socialLinks = [
    { 
      name: 'GitHub', 
      icon: Github, 
      href: 'https://github.com/mukul953kumar/teamzen-frontend',
      color: '#ffffff'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com/teamzen',
      color: '#1DA1F2'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com/company/teamzen',
      color: '#0077B5'
    }
  ]

  const features = [
    { icon: Users, text: '10,000+ Students' },
    { icon: Trophy, text: '2,500+ Teams' },
    { icon: Shield, text: '95% Success Rate' }
  ]

  return (
    <>
      <footer className="relative overflow-hidden"
              style={{
                backgroundImage: 'url("/images/image3.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 0
        }} />
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 200"><defs><pattern id="footer-pattern" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="2" fill="%23FF6B35" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23footer-pattern)"/></svg>')`
          }}
        />

        <div className="relative z-10">
          {/* Top Section */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Link to="/" className="inline-block group">
                      <img
                        src="/images/logo26.png"
                        alt="TeamZen Logo"
                        className="h-12 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = '/images/TeamZen.png' }}
                      />
                    </Link>
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--cream-white)' }}>
                    Where brilliant minds connect and create amazing projects together.
                  </p>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl flex items-center justify-center glass-3d hover:scale-110 transition-all duration-300"
                          style={{ borderColor: `${social.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: social.color }} />
                        </a>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-6">
                  <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--cream-white)' }}>Legal & Policies</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => openTerms('terms')}
                      className="block text-lg hover:text-orange-400 transition-colors duration-300 text-left"
                      style={{ color: 'var(--cream-white)' }}
                    >
                      Terms of Service & Rules
                    </button>
                    <button
                      onClick={() => openTerms('privacy')}
                      className="block text-lg hover:text-orange-400 transition-colors duration-300 text-left"
                      style={{ color: 'var(--cream-white)' }}
                    >
                      Privacy Policy
                    </button>
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
                      <p className="font-semibold text-red-400">⚠️ Strict Deletion Policy:</p>
                      <p>Engaging in spam, illegal chat, or abusive behavior will result in permanent account deletion.</p>
                    </div>
                  </div>
                </div>

              {/* Features */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--cream-white)' }}>Why TeamZen?</h4>
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--deep-teal)' }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg" style={{ color: 'var(--cream-white)' }}>{feature.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: 'var(--cream-white)' }}>
                  © {currentYear} TeamZen. All rights reserved.Mukul Kumar
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--cream-white)' }}>Made with</span>
                  <Heart className="w-4 h-4" style={{ color: 'var(--coral-pink)' }} />
                  <span className="text-sm" style={{ color: 'var(--cream-white)' }}>in India</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-8">
                <a
                  href="mailto:mukulkumar@teamzen.com"
                  className="flex items-center gap-2 text-sm hover:text-orange-400 transition-colors duration-300"
                  style={{ color: 'var(--cream-white)' }}
                >
                  <Mail className="w-4 h-4" />
                  mukulkumar@teamzen.com
                </a>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cream-white)' }}>
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cream-white)' }}>
                  <MapPin className="w-4 h-4" />
                  India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-10 animate-3d-float">
          <div className="w-full h-full rounded-full" style={{ background: 'var(--coral-gradient)' }} />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full opacity-10 animate-3d-float" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full rounded-full" style={{ background: 'var(--teal-gradient)' }} />
        </div>
      </div>
    </footer>

    {/* Reusable Legal Terms & Privacy Modal */}
    <TermsModal
      isOpen={isTermsOpen}
      onClose={() => setIsTermsOpen(false)}
      initialTab={termsTab}
    />
    </>
  )
}

export default Footer
