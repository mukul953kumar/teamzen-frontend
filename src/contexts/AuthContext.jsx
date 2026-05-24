import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { authAPI } from '../services/authAPI'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const { data: userFromQuery, error, isLoading, refetch } = useQuery(
    'currentUser',
    async () => {
      const token = localStorage.getItem('token')
      if (!token) return null
      
      try {
        const response = await authAPI.getCurrentUser()
        return response.data.data.user
      } catch (error) {
        localStorage.removeItem('token')
        return null
      }
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes,
      enabled: false, // Disable auto-fetch, we'll trigger it manually
    }
  )

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      setUser(null)
    } else {
      // If token exists, fetch user
      refetch().then((result) => {
        if (result.data) {
          setUser(result.data)
        } else {
          setUser(null)
        }
        setLoading(false)
      }).catch(() => {
        setUser(null)
        setLoading(false)
      })
    }
  }, [])

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Calling login API with:', credentials)
      const response = await authAPI.login(credentials)
      console.log('AuthContext: Login API response:', response)
      const { token, user } = response.data.data
      
      localStorage.setItem('token', token)
      
      // Direct state update for immediate effect
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      setLoading(false)
      
      console.log('AuthContext: User logged in, redirecting...')
      
      return { success: true, user }
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      console.log('AuthContext: Calling signup API with:', userData)
      const response = await authAPI.signup(userData)
      console.log('AuthContext: Signup API response:', response)
      const { token, user } = response.data.data
      
      localStorage.setItem('token', token)
      
      // Direct state update for immediate effect
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      setLoading(false)
      
      return { success: true, user }
    } catch (error) {
      console.error('AuthContext: Signup error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      queryClient.clear()
      queryClient.setQueryData('currentUser', null)
    }
  }

  const value = {
    user: user || null,
    loading: loading || isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
