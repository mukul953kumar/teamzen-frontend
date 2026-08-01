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
      let response
      try {
        response = await authAPI.getCurrentUser()
      } catch (firstErr) {
        console.warn('Initial getCurrentUser failed, retrying in 1s...', firstErr)
        await new Promise(res => setTimeout(res, 1000))
        response = await authAPI.getCurrentUser()
      }
      const user = response.data?.data?.user
      if (!user) throw new Error('User data empty')
      setUser(user)
      queryClient.setQueryData('currentUser', user)
      setLoading(false)
      return { success: true, user }
    } catch (error) {
      console.error('loginWithToken failed:', error)
      localStorage.removeItem('token')
      setUser(null)
      setLoading(false)
      return { success: false, error }
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

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    queryClient.setQueryData('currentUser', updatedUser)
  }

  const value = {
    user: user || null,
    loading: loading || isLoading,
    login,
    loginWithToken,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
