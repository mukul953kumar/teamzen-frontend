import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const VerifyCode = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [status, setStatus] = useState('input') // input, success, error
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds

  useEffect(() => {
    // Get email from location state or query params
    const emailFromState = location.state?.email
    const emailFromQuery = new URLSearchParams(location.search).get('email')
    
    if (emailFromState) {
      setEmail(emailFromState)
    } else if (emailFromQuery) {
      setEmail(emailFromQuery)
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [location])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, '')
    
    const newCode = [...code]
    newCode[index] = numValue.slice(-1) // Take only last character
    setCode(newCode)

    // Auto-focus next input
    if (numValue && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4)
    
    if (pastedData.length === 4) {
      setCode(pastedData.split(''))
      // Focus last input
      const lastInput = document.getElementById('code-3')
      if (lastInput) {
        lastInput.focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const fullCode = code.join('')
    if (fullCode.length !== 4) {
      toast.error('Please enter the complete 4-digit code')
      return
    }

    if (!email) {
      toast.error('Email is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/auth/verify-email', {
        email,
        code: fullCode
      })

      if (response.data.success) {
        setStatus('success')
        setMessage(response.data.message)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } else {
        setStatus('error')
        setMessage(response.data.message || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage(
        error.response?.data?.message || 
        'Invalid or expired verification code'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }

    setIsResending(true)
    try {
      const response = await api.post('/auth/resend-verification', { email })
      
      if (response.data.success) {
        toast.success(response.data.message)
        // Reset timer and code
        setTimeLeft(900)
        setCode(['', '', '', ''])
        setStatus('input')
        setMessage('')
        
        // Focus first input
        const firstInput = document.getElementById('code-0')
        if (firstInput) {
          firstInput.focus()
        }
      } else {
        toast.error(response.data.message || 'Failed to resend code')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Failed to resend verification code'
      )
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center">
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
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Verify Your Email 🔐
          </h2>
          <p className="text-gray-300">
            We've sent a 4-digit verification code to your email address.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {email || 'your email address'}
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'error' && message && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-300 text-sm text-center">{message}</p>
            </div>
          )}

          {/* Code Input */}
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all"
                required
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-gray-400 text-sm">
                Code expires in <span className="font-mono text-blue-400">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-red-400 text-sm">
                Code has expired. Please request a new one.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || code.join('').length !== 4}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-blue-400 hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Didn't receive the code? Check your spam folder.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm mt-2 block"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyCode
