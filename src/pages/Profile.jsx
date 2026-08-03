import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  Code,
  Trophy,
  Camera,
  Upload,
  Trash2,
  LogOut,
  FileText,
  ShieldAlert,
  Award,
  Star,
  Zap,
  Heart,
  Flame,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  Headphones,
  Copy,
  FolderOpen,
  Plus
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import TermsModal from '../components/TermsModal'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { getDomainBadgeStyle, POPULAR_DOMAINS } from '../utils/domainUtils'

// Visual Developer Skill Matrix & Proficiency Bar Chart
const SkillProficiencyChart = ({ skills = [] }) => {
  const skillNames = skills.map(s => (typeof s === 'string' ? s : s.skill_name || '').toLowerCase())

  const frontendSkills = ['react', 'node', 'javascript', 'typescript', 'html', 'css', 'ui/ux', 'figma', 'flutter', 'tailwind', 'vue', 'angular']
  const backendSkills = ['node.js', 'express.js', 'python', 'java', 'c++', 'c', 'django', 'fastapi', 'go', 'php']
  const databaseSkills = ['mongodb', 'mysql', 'postgresql', 'aws', 'docker', 'git', 'firebase', 'redis']
  const aiSkills = ['machine learning', 'data science', 'pytorch', 'tensorflow', 'opencv', 'deep learning', 'ai']

  const countMatches = (list) => list.filter(item => skillNames.some(s => s.includes(item))).length

  const feCount = countMatches(frontendSkills)
  const beCount = countMatches(backendSkills)
  const dbCount = countMatches(databaseSkills)
  const aiCount = countMatches(aiSkills)

  const maxVal = Math.max(feCount, beCount, dbCount, aiCount, 1)

  const domains = [
    { label: 'Frontend & UI Engineering', count: feCount, color: '#3b82f6', percent: Math.min(100, Math.round((feCount > 0 ? (feCount / maxVal) * 75 + 25 : 15))) },
    { label: 'Backend Systems & APIs', count: beCount, color: '#a855f7', percent: Math.min(100, Math.round((beCount > 0 ? (beCount / maxVal) * 75 + 25 : 15))) },
    { label: 'Database & Cloud DevOps', count: dbCount, color: '#10b981', percent: Math.min(100, Math.round((dbCount > 0 ? (dbCount / maxVal) * 75 + 25 : 15))) },
    { label: 'AI, ML & Data Analytics', count: aiCount, color: '#f97316', percent: Math.min(100, Math.round((aiCount > 0 ? (aiCount / maxVal) * 75 + 25 : 15))) }
  ]

  return (
    <div className="space-y-3.5 pt-3 border-t border-white/10 mt-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technical Proficiency Matrix</h4>
      {domains.map((domain, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: domain.color }} />
              {domain.label}
            </span>
            <span className="font-bold text-gray-400">{domain.percent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${domain.percent}%`,
                background: `linear-gradient(90deg, ${domain.color}, #6366f1)`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const Profile = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [localUser, setLocalUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [termsTab, setTermsTab] = useState('terms')
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const fileInputRef = useRef(null)

  const { data: profileData, isLoading, refetch: refetchProfile } = useQuery(
    'profile',
    () => api.get('/auth/me').then(res => res.data.data),
    {
      enabled: !!user,
      staleTime: 0,
      cacheTime: 0,
      onSuccess: (data) => {
        if (data?.user) setLocalUser(data.user)
      }
    }
  )

  React.useEffect(() => {
    if (profileData?.user) {
      setLocalUser(profileData.user)
    }
  }, [profileData])

  const { data: achievementsData } = useQuery(
    'userAchievements',
    () => api.get(`/achievements/user/${user?._id}`).then(res => res.data.data),
    { 
      enabled: !!user,
      retry: false,
      refetchOnWindowFocus: true,
      cacheTime: 0,
      staleTime: 0
    }
  )

  const { data: projectsData } = useQuery(
    ['userProjects', user?._id],
    () => api.get(`/projects?user_id=${user?._id}`).then(res => res.data.data),
    { 
      enabled: !!user,
      retry: false
    }
  )

  const deleteAccountMutation = useMutation(
    () => api.delete('/users/account'),
    {
      onSuccess: () => {
        toast.success('Account deleted successfully')
        logout()
        navigate('/')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete account')
      }
    }
  )

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
    setDeleteConfirmText('')
  }

  const updateProfileMutation = useMutation(
    (profileData) => {
      const formData = new FormData()
      
      // Add all text fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_image' && profileData[key] !== undefined && profileData[key] !== null) {
          if (Array.isArray(profileData[key])) {
            formData.append(key, JSON.stringify(profileData[key]))
          } else {
            formData.append(key, profileData[key])
          }
        }
      })
      
      // Add image if selected
      if (selectedImage) {
        formData.append('profile_image', selectedImage)
      }
      
      return api.put('/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    {
      onSuccess: (res) => {
        const updatedUser = res?.data?.data?.user
        if (updatedUser) {
          setLocalUser(updatedUser)
          queryClient.setQueryData('profile', { user: updatedUser })
          queryClient.setQueryData('currentUser', updatedUser)
          if (updateUser) updateUser(updatedUser)
        }
        queryClient.invalidateQueries('profile')
        queryClient.invalidateQueries('userProfile')
        queryClient.invalidateQueries('currentUser')
        refetchProfile()
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        setSelectedImage(null)
        setPreviewImage(null)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    }
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const toggleInterestDomain = (domain) => {
    setSelectedInterests(prev => 
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      hackathon_interests: selectedInterests
    }
    updateProfileMutation.mutate(finalData)
  }

  const handleYearChange = (e) => {
    const yr = Number(e.target.value)
    const sy = 2026 - (yr - 1)
    setValue('year', yr)
    setValue('startYear', sy)
    setValue('endYear', sy + 4)
  }

  const handleStartYearChange = (e) => {
    const sy = Number(e.target.value)
    setValue('startYear', sy)
    setValue('endYear', sy + 4)
  }

  const handleEdit = () => {
    if (profileData?.user) {
      const yr = Number(profileData.user.year) || 3
      const fallbackStart = 2026 - (yr - 1)
      const sy = profileData.user.startYear || fallbackStart
      const ey = profileData.user.endYear || (sy + 4)

      setSelectedInterests(profileData.user.hackathon_interests || [])
      reset({
        name: profileData.user.name,
        bio: profileData.user.bio,
        branch: profileData.user.branch,
        year: profileData.user.year || 3,
        startYear: sy,
        endYear: ey,
        github: profileData.user.github,
        linkedin: profileData.user.linkedin,
        portfolio: profileData.user.portfolio,
        availability_status: profileData.user.availability_status || 'Available',
        skills: profileData.user.skills?.map(skill => skill.skill_name) || []
      })
      setPreviewImage(profileData.user.profile_image)
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
    setSelectedImage(null)
    setPreviewImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const profile = localUser || profileData?.user
  const achievements = achievementsData?.achievements || []
  const projects = projectsData?.projects || []

  const profileCompletion = (() => {
    if (!profile) return 0
    const fields = [profile.name, profile.bio, profile.github, profile.linkedin, profile.portfolio, profile.college, profile.branch, profile.year]
    const skills = profile.skills?.length > 0 ? 1 : 0
    const filled = fields.filter(Boolean).length + skills
    return Math.round((filled / (fields.length + 1)) * 100)
  })()

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn-primary flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </button>
          )}

          <button
            onClick={() => {
              logout()
              toast.success('Logged out successfully')
              navigate('/login')
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all duration-200 shadow-sm cursor-pointer"
            title="Log out of your account"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
          {/* Profile Card */}
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 min-w-0">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {(previewImage || profile?.profile_image) ? (
                    <img
                      src={previewImage || profile?.profile_image}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {isEditing && (
                    <button
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                        <input type="text" className="input w-full" placeholder="Your Name"
                          {...register('name', { required: 'Name is required' })} />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Availability</label>
                        <select className="input w-full" {...register('availability_status')}>
                          <option value="Available">🟢 Available</option>
                          <option value="Open to work">🔵 Open to work</option>
                          <option value="Busy">🔴 Busy</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Branch</label>
                        <select className="input w-full text-xs" {...register('branch')}>
                          {['CSE','ECE','EEE','MECH','CIVIL','IT','Other'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Current Year</label>
                        <select className="input w-full text-xs" {...register('year')} onChange={(e) => { register('year').onChange(e); handleYearChange(e); }}>
                          {[1,2,3,4].map(y => (
                            <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Start Year (Batch Join)</label>
                        <select className="input w-full text-xs" {...register('startYear')} onChange={(e) => { register('startYear').onChange(e); handleStartYearChange(e); }}>
                          {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(sy => (
                            <option key={sy} value={sy}>{sy}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">End Year (Passout)</label>
                        <select className="input w-full text-xs" {...register('endYear')}>
                          {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(ey => (
                            <option key={ey} value={ey}>{ey}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bio</label>
                      <textarea className="input w-full resize-none" rows={3}
                        placeholder="Tell us about yourself..."
                        {...register('bio')} />
                    </div>

                    {/* Domain Interests & Specializations Selector */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        🎯 Domain Interests & Specialization (Select all that apply)
                      </label>
                      <p className="text-xs text-gray-400">
                        Select what fields you are interested in so teammates and recruiters know your primary focus areas.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_DOMAINS.map(domain => {
                          const isSelected = selectedInterests.includes(domain)
                          const style = getDomainBadgeStyle(domain)
                          return (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => toggleInterestDomain(domain)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                isSelected
                                  ? `${style.color} ring-2 ring-primary-500/50 scale-105 shadow-md`
                                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span>{style.icon}</span>
                              <span>{domain}</span>
                              {isSelected && <span className="text-[10px] font-bold text-emerald-400">✓</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">GitHub URL</label>
                        <input type="text" className="input w-full" placeholder="https://github.com/username"
                          {...register('github')} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">LinkedIn URL</label>
                        <input type="text" className="input w-full" placeholder="https://linkedin.com/in/username"
                          {...register('linkedin')} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Portfolio URL</label>
                        <input type="text" className="input w-full" placeholder="https://yourportfolio.com"
                          {...register('portfolio')} />
                      </div>
                    </div>

                    <button type="submit" disabled={updateProfileMutation.isLoading}
                      className="btn-primary flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                      {profile?.availability_status && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile.availability_status === 'Available' ? 'bg-green-400/20 text-green-400' :
                          profile.availability_status === 'Open to work' ? 'bg-blue-400/20 text-blue-400' :
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {profile.availability_status === 'Available' ? '🟢' : profile.availability_status === 'Open to work' ? '🔵' : '🔴'} {profile.availability_status}
                        </span>
                      )}
                    </div>
                    {/* Dynamic Verified Student Badges */}
                    <div className="flex flex-wrap gap-2 my-3">
                      {/* 1. College Email Verification Badge */}
                      {(profile?.email?.endsWith('@knit.ac.in') || profile?.isVerified) && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm" title="Verified KNIT College Email">
                          <CheckCircle className="w-3.5 h-3.5" />
                          KNIT Verified Student
                        </span>
                      )}

                      {/* 3. Top Contributor Badge */}
                      {(profile?.skills?.length >= 3 || profileCompletion >= 75) && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm" title="Top Contributor - High Skills & Profile Completion">
                          <Star className="w-3.5 h-3.5" />
                          Top Contributor
                        </span>
                      )}

                      {/* 4. Fast Responder Badge */}
                      {profile?.availability_status === 'Available' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm" title="Fast Responder - Active & Available">
                          <Zap className="w-3.5 h-3.5" />
                          Fast Responder
                        </span>
                      )}

                      {/* 5. Popularity Badge */}
                      {profile?.likesCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm" title={`${profile.likesCount} Profile Likes`}>
                          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                          {profile.likesCount} Profile {profile.likesCount === 1 ? 'Like' : 'Likes'}
                        </span>
                      )}

                      {/* 6. Streak & Points Badge */}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-500/15 text-orange-400 border border-orange-500/30 shadow-sm" title={`${profile?.loginStreak || 1} Days Active Login Streak`}>
                        <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                        {profile?.loginStreak || 1}d Streak (⚡ {profile?.zenPoints || 10} Pts)
                      </span>
                    </div>

                    <p className="text-gray-400 mb-4">{profile?.bio || 'No bio added yet'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail className="w-4 h-4 flex-shrink-0 text-primary-400" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-orange-400" />
                        <span>{profile?.college}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-purple-400" />
                        <span>
                          {profile?.year}{profile?.year === 1 ? 'st' : profile?.year === 2 ? 'nd' : profile?.year === 3 ? 'rd' : 'th'} Year ({profile?.startYear || (2026 - ((Number(profile?.year) || 3) - 1))} – {profile?.endYear || ((profile?.startYear || (2026 - ((Number(profile?.year) || 3) - 1))) + 4)} Batch)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <User className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                        <span>{profile?.branch}</span>
                      </div>
                    </div>

                    {/* GitHub Developer Card */}
                    {profile?.github && (
                      <div className="mt-5 p-4 rounded-2xl bg-[#0d0d14] border border-white/10 space-y-3 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-500" />
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 flex-shrink-0">
                              <Github className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>GitHub Developer Stats</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">Active</span>
                              </h4>
                              <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">{profile.github}</p>
                            </div>
                          </div>
                          <a
                            href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-sunset text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 flex-shrink-0"
                          >
                            <span>View GitHub</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Domain Interests & Specializations View Card */}
                    <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Domain Interests & Specializations</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile?.hackathon_interests?.length > 0 ? (
                          profile.hackathon_interests.map((interest, idx) => {
                            const style = getDomainBadgeStyle(interest)
                            return (
                              <span key={idx} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${style.color} shadow-sm`}>
                                <span>{style.icon}</span>
                                <span>{interest}</span>
                              </span>
                            )
                          })
                        ) : (
                          <p className="text-xs text-gray-400">No domain interests added yet. Click 'Edit Profile' to choose your interested domains!</p>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {profile?.linkedin && (
                        <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all text-sm font-medium">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      )}
                      {profile?.portfolio && (
                        <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all text-sm font-medium">
                          <Globe className="w-4 h-4" /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-lg text-sm font-medium border border-primary-500/30"
                  >
                    {skill.skill_name}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills added yet</p>
              )}
            </div>

            {/* Visual Technical Matrix */}
            <SkillProficiencyChart skills={profile?.skills} />
          </div>

          {/* Showcase Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FolderOpen className="w-5 h-5 mr-2 text-primary-400" />
                Showcase Projects
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{projects.length} projects</span>
                <Link
                  to="/projects"
                  className="btn-primary text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 font-medium shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Manage Projects
                </Link>
              </div>
            </div>
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div key={project._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-all border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-white text-base truncate">{project.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                          project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                      
                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.tech_stack.slice(0, 4).map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-[10px] font-semibold rounded-md border border-blue-500/25">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-400">
                      <span>{project.year}</span>
                      <div className="flex items-center gap-2.5">
                        {project.github_link && (
                          <a href={project.github_link.startsWith('http') ? project.github_link : `https://${project.github_link}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="GitHub Repo">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.demo_link && (
                          <a href={project.demo_link.startsWith('http') ? project.demo_link : `https://${project.demo_link}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Live Demo">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-white/5 border border-dashed border-white/15 text-center space-y-3">
                <p className="text-xs sm:text-sm text-gray-400">No showcase projects added to your profile yet</p>
                <Link to="/projects" className="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 font-semibold">
                  <Plus className="w-4 h-4" /> Add Your First Project
                </Link>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              <span className="text-sm text-gray-400">{achievements.length} achievements</span>
            </div>
            
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white mb-1">{achievement.title}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-lg">
                          {achievement.type}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{achievement.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No achievements added yet</p>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Profile Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Profile Completion</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                <span className="text-primary-400 font-medium ml-2">{profileCompletion}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Skills</span>
                <span className="text-white font-medium bg-primary-600/20 px-2 py-1 rounded">{profile?.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Achievements</span>
                <span className="text-white font-medium bg-yellow-600/20 px-2 py-1 rounded">{achievements.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-medium text-xs">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Tips */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Profile Tips</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>• Add more skills to improve match accuracy</p>
              <p>• Complete your profile with bio and links</p>
              <p>• Showcase your best projects</p>
              <p>• Keep achievements updated</p>
            </div>
          </div>

          {/* Platform Terms & Rules */}
          <div className="card border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              <h3>Terms & Safety Policy</h3>
            </div>
            <p className="text-xs text-gray-400">By using TeamZen, you agree to accept all platform terms and conditions.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setTermsTab('terms'); setIsTermsOpen(true) }}
                className="btn-secondary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms & Rules</span>
              </button>
              <button
                onClick={() => { setTermsTab('privacy'); setIsTermsOpen(true) }}
                className="btn-secondary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1"
              >
                <span>Privacy</span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card border border-white/10">
            <h3 className="text-base font-semibold text-white mb-2">Account Options</h3>
            <p className="text-xs text-gray-400 mb-4">Sign out of your active session on TeamZen.</p>
            <button
              onClick={() => {
                logout()
                toast.success('Logged out successfully')
                navigate('/login')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of TeamZen</span>
            </button>
          </div>

          {/* Help & Direct Email Support */}
          <div className="card border border-white/10 space-y-3 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black shadow-xl">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3>Need Help & Support?</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Have questions, feedback, or technical issues with TeamZen? Reach out directly to our admin team anytime!
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Official Support Email</span>
              <p className="text-xs font-mono font-bold text-primary-300 select-all">mukul.knit26@gmail.com</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:mukul.knit26@gmail.com?subject=TeamZen%20Query%20/%20Support%20Request"
                className="btn-sunset text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 rounded-xl font-semibold shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email Query</span>
              </a>
              
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('mukul.knit26@gmail.com')
                  toast.success('Support Email copied to clipboard!')
                }}
                className="btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl"
                title="Copy Email Address"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border border-red-500/20">
            <h3 className="text-base font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all related data.</p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              {deleteAccountMutation.isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Consent Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: '#1a1a1a', border: '1px solid rgba(239,68,68,0.3)' }}>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Delete Account</h2>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm font-semibold text-red-400">This action is permanent and cannot be undone.</p>
              <p className="text-xs text-gray-400">The following will be deleted forever:</p>
              <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                <li>Your profile and account</li>
                <li>All teams you created</li>
                <li>All messages and chats</li>
                <li>All achievements and projects</li>
                <li>All notifications and join requests</li>
              </ul>
            </div>

            {/* Confirm input */}
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Type <span className="font-semibold text-white">{profile?.name}</span> to confirm:
              </p>
              <input
                type="text"
                className="input w-full"
                placeholder={profile?.name}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAccountMutation.mutate()}
                disabled={deleteConfirmText !== profile?.name || deleteAccountMutation.isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: deleteConfirmText === profile?.name ? '#ef4444' : 'rgba(239,68,68,0.3)' }}
              >
                <Trash2 className="w-4 h-4" />
                {deleteAccountMutation.isLoading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Privacy Policy Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        initialTab={termsTab}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedProject.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {selectedProject.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">Year {selectedProject.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Project Overview</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </div>
            </div>

            {selectedProject.tech_stack?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech_stack.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/15 text-blue-300 border border-blue-500/25 text-xs font-semibold rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                {selectedProject.github_link && (
                  <a href={selectedProject.github_link.startsWith('http') ? selectedProject.github_link : `https://${selectedProject.github_link}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
                    <Github className="w-4 h-4" /> GitHub Code
                  </a>
                )}
                {selectedProject.demo_link && (
                  <a href={selectedProject.demo_link.startsWith('http') ? selectedProject.demo_link : `https://${selectedProject.demo_link}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl card p-6 max-h-[90vh] overflow-y-auto border border-white/15 shadow-2xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500" />
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {selectedAchievement.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {selectedAchievement.position}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">Year {selectedAchievement.year}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedAchievement.title}</h2>
                {selectedAchievement.organization && (
                  <p className="text-xs text-amber-400 font-semibold mt-1">Issued by: {selectedAchievement.organization}</p>
                )}
              </div>
              <button onClick={() => setSelectedAchievement(null)} className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Achievement Details</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {selectedAchievement.description}
              </div>
            </div>

            {selectedAchievement.certificate_link && (
              <div className="pt-4 border-t border-white/10">
                <a href={selectedAchievement.certificate_link.startsWith('http') ? selectedAchievement.certificate_link : `https://${selectedAchievement.certificate_link}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 font-semibold">
                  <ExternalLink className="w-4 h-4" /> View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
