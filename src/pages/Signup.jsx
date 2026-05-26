import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Code } from 'lucide-react'
import toast from 'react-hot-toast'

const Signup = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
  const years = [1, 2, 3, 4]
  const commonSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB',
    'MySQL', 'Machine Learning', 'Data Science', 'UI/UX', 'Flutter',
    'Blockchain', 'IoT', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js'
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Handle skills array properly - convert to array if it's not
      let skillsArray = []
      if (data.skills) {
        if (Array.isArray(data.skills)) {
          skillsArray = data.skills
        } else if (typeof data.skills === 'object') {
          skillsArray = Object.keys(data.skills).filter(key => data.skills[key])
        }
      }
      
      const formData = {
        ...data,
        skills: skillsArray
      }
      
      const result = await signup(formData)
      if (result.success) {
        // Navigate to verification page with email
        navigate('/verify-code', { 
          state: { email: data.email },
          replace: true 
        })
      } else {
        console.error('Signup failed:', result.message)
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
         style={{
           backgroundImage: 'url("/images/image3.png")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           position: 'relative'
         }}>
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 0
      }} />
      <div className="relative z-10">
      <div className="relative w-full max-w-2xl">
        <div className="card">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold neon-text mb-2">TeamZen</h1>
            <p className="text-gray-400">Create your account and start building amazing teams</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input pl-12 w-full"
                    placeholder="John Doe"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="input pl-12 w-full"
                    placeholder="your.email@college.edu"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* College */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  College
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="input pl-12 w-full"
                    placeholder="IIT Delhi"
                    {...register('college', {
                      required: 'College is required',
                    })}
                  />
                </div>
                {errors.college && (
                  <p className="mt-1 text-sm text-red-400">{errors.college.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-12 pr-12 w-full"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch
                </label>
                <select
                  className="input w-full"
                  {...register('branch', {
                    required: 'Branch is required',
                  })}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-400">{errors.branch.message}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <select
                  className="input w-full"
                  {...register('year', {
                    required: 'Year is required',
                  })}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Code className="inline w-4 h-4 mr-1" />
                Skills (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSkills.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg glass hover:bg-white/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={skill}
                      className="rounded border-gray-300 bg-transparent text-primary-600 focus:ring-primary-500"
                      {...register('skills')}
                    />
                    <span className="text-sm text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-400">{errors.skills.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Signup
