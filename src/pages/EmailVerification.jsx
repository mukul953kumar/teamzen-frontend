import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'

const EmailVerification = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Verification token is missing')
    }
  }, [searchParams])

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`)
      
      if (response.data.success) {
        setStatus('success')
        setMessage(response.data.message)
        
        // Redirect to login after 3 seconds (user will need to login)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(response.data.message || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(
        error.response?.data?.message || 
        'Invalid or expired verification link. Please request a new one.'
      )
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      alert('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      const response = await api.post('/auth/resend-verification', { email })
      
      if (response.data.success) {
        alert('Verification email has been resent. Please check your inbox.')
      } else {
        alert(response.data.message || 'Failed to resend verification email')
      }
    } catch (error) {
      alert(
        error.response?.data?.message || 
        'Failed to resend verification email. Please try again.'
      )
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <h2 className="text-2xl font-bold text-white mt-6 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-300">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center">
          {status === 'success' ? (
            <>
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Email Verified! 🎉
              </h2>
              <p className="text-gray-300 mb-6">
                {message}
              </p>
              <p className="text-gray-400 text-sm">
                You will be redirected to the login page in a few seconds...
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-300 mb-8">
                {message}
              </p>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Resend Verification Email</span>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                  />
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all border border-white/20"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
