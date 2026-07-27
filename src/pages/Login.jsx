import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, X } from 'lucide-react'

const Login = () => {
  const [searchParams] = useSearchParams()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'only_college_email') {
      setShowError(true)
    }
  }, [])

  const handleGoogleLogin = () => {
    const backendURL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    window.location.href = `${backendURL}/api/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: 'url("/images/image2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 0 }} />

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
        <div className="card text-center">
          <div className="mb-8">
            <img src="/images/logo26.png" alt="TeamZen" className="h-16 w-auto mx-auto mb-4" />
            <p className="text-gray-400">Sign in with your KNIT college email</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-xs text-gray-500">
            Only <span className="text-primary-400">@knit.ac.in</span> email addresses are allowed
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
