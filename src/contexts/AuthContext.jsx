import { createContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { authAPI } from '../services/authAPI'

export const AuthContext = createContext()

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

  const loginWithToken = async (token) => {
    try {
      localStorage.setItem('token', token)
      const response = await authAPI.getCurrentUser()
      const user = response.data.data.user
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      return { success: true, user }
    } catch {
      localStorage.removeItem('token')
      return { success: false }
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      setLoading(false)
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      const { token, user } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      setLoading(false)
      return { success: true, user }
    } catch (error) {
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
    loginWithToken,
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
