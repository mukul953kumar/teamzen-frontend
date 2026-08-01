import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, X, ShieldAlert, CheckSquare, Square, FileText } from 'lucide-react'
import TermsModal from '../components/TermsModal'
import ConsentModal from '../components/ConsentModal'

import { getBackendURL } from '../config/api'

const Login = () => {
  const [searchParams] = useSearchParams()
  const [showError, setShowError] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'only_college_email') {
      setShowError(true)
    }
  }, [searchParams])

  const triggerGoogleLogin = () => {
    const backendURL = getBackendURL()
    window.location.href = `${backendURL}/api/auth/google`
  }

  const handleSignInClick = () => {
    if (!hasAgreed) {
      setIsConsentModalOpen(true)
    } else {
      triggerGoogleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: 'url("/images/image2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 0 }} />

      {/* Error Popup */}
      {showError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm">
          <div className="flex items-start gap-3 bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-xl p-4 shadow-xl">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Access Denied</p>
              <p className="text-red-300 text-xs mt-1">Only <span className="font-bold">@knit.ac.in</span> email addresses are allowed. Please use your college email.</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-gray-400 hover:text-white flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        <div className="card text-center space-y-6">
          
          {/* Header & Logo */}
          <div>
            <img src="/images/logo26.png" alt="TeamZen" className="h-16 w-auto mx-auto mb-3" />
            <p className="text-gray-300 text-sm font-medium">Sign in with your KNIT college email</p>
          </div>

          {/* Strict Account Termination Warning Box */}
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Zero Tolerance Community Policy</span>
            </div>
            <p className="text-xs text-red-200 leading-relaxed">
              If you engage in any <strong className="text-white">spam, abusive chat, or illegal activity</strong>, your account will be <strong className="text-white underline">PERMANENTLY DELETED</strong> without prior warning.
            </p>
          </div>

          {/* Interactive Checkbox */}
          <button
            type="button"
            onClick={() => setHasAgreed(!hasAgreed)}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left w-full cursor-pointer"
          >
            <div className="mt-0.5 text-orange-400 flex-shrink-0">
              {hasAgreed ? (
                <CheckSquare className="w-5 h-5 text-emerald-400" />
              ) : (
                <Square className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <span className="text-xs text-gray-300 leading-relaxed">
              I accept TeamZen <button type="button" onClick={(e) => { e.stopPropagation(); setIsTermsOpen(true) }} className="text-orange-400 underline hover:text-orange-300 font-semibold">Terms of Service & Privacy Policy</button> and agree that any spam or illegal chat will result in permanent account deletion.
            </span>
          </button>

          {/* Google Sign In Button */}
          <button
            onClick={handleSignInClick}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="text-xs text-gray-400">
            Only <span className="text-primary-400 font-semibold">@knit.ac.in</span> email addresses are allowed
          </p>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Consent Modal if user clicks sign in without checking */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onAccept={() => {
          setHasAgreed(true)
          setIsConsentModalOpen(false)
          triggerGoogleLogin()
        }}
        onOpenFullTerms={() => setIsTermsOpen(true)}
      />

      {/* Terms & Privacy Policy Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        initialTab="terms"
      />
    </div>
  )
}

export default Login
