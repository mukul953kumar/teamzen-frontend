import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const profileComplete = searchParams.get('profileComplete')
    const error = searchParams.get('error')

    if (error === 'only_college_email') {
      navigate('/login?error=only_college_email')
      return
    }

    if (token) {
      loginWithToken(token).then((res) => {
        if (res && res.success) {
          toast.success('Successfully signed in!')
          if (profileComplete === 'false') {
            navigate('/complete-profile', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        } else {
          toast.error('Authentication failed. Please try signing in again.')
          navigate('/login', { replace: true })
        }
      }).catch((err) => {
        console.error('Auth callback error:', err)
        toast.error('Authentication error: ' + (err.message || 'Server error'))
        navigate('/login', { replace: true })
      })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-gray-400 mt-4">Signing you in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
