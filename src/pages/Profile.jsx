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
  Plus,
  Settings,
  ShieldCheck,
  Layers,
  LayoutGrid
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import TermsModal from '../components/TermsModal'
import ImageCropModal from '../components/ImageCropModal'
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
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'projects', 'account', 'legal'
  const [selectedInterests, setSelectedInterests] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState(null)
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
      
      // Handle remove or set profile image
      if (removeImage) {
        formData.append('remove_profile_image', 'true')
      } else if (selectedImage) {
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
        setRemoveImage(false)
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
      setActiveTab('overview')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
    setSelectedImage(null)
    setPreviewImage(null)
    setRemoveImage(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image size should be less than 8MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImageSrc(reader.result)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const handleCropComplete = (croppedFile, previewUrl) => {
    setSelectedImage(croppedFile)
    setPreviewImage(previewUrl)
    setRemoveImage(false)
    setCropModalOpen(false)
    
    // Automatically upload & save cropped image to MongoDB
    const loadingToast = toast.loading('Uploading cropped profile picture...')
    const formData = new FormData()
    formData.append('profile_image', croppedFile)

    api.put('/auth/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        toast.dismiss(loadingToast)
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
        toast.success('🎉 Profile picture updated & saved!')
      })
      .catch(err => {
        toast.dismiss(loadingToast)
        toast.error(err.response?.data?.message || 'Failed to upload profile picture')
      })
  }

  const handleRemoveImage = () => {
    const loadingToast = toast.loading('Removing profile picture...')
    const formData = new FormData()
    formData.append('remove_profile_image', 'true')

    api.put('/auth/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        toast.dismiss(loadingToast)
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
        setSelectedImage(null)
        setPreviewImage(null)
        setRemoveImage(true)
        toast.success('Profile picture removed permanently!')
      })
      .catch(err => {
        toast.dismiss(loadingToast)
        toast.error(err.response?.data?.message || 'Failed to remove profile picture')
      })
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

  const tabs = [
    { id: 'overview', label: 'Overview & Skills', icon: User, count: profile?.skills?.length || 0 },
    { id: 'projects', label: 'Projects & Achievements', icon: Trophy, count: (projects.length + achievements.length) },
    { id: 'account', label: 'Account & Support', icon: Settings },
    { id: 'legal', label: 'Legal & Safety', icon: ShieldCheck }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4 overflow-x-hidden pb-12">
      
      {/* Top Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-emerald-400" />
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar + Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative">
                {(!removeImage && (previewImage || profile?.profile_image)) ? (
                  <img
                    src={previewImage || profile?.profile_image}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/15 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center border-2 border-white/15 shadow-xl">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Avatar */}
              <div className="flex items-center gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="px-2.5 py-1 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                  title="Upload & Crop Profile Picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{(!removeImage && (profile?.profile_image || previewImage)) ? 'Crop / Change' : 'Upload Image'}</span>
                </button>

                {(!removeImage && (previewImage || profile?.profile_image)) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-2 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                    title="Remove Profile Picture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{profile?.name}</h1>
                {profile?.availability_status && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${
                    profile.availability_status === 'Available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    profile.availability_status === 'Open to work' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {profile.availability_status === 'Available' ? '🟢' : profile.availability_status === 'Open to work' ? '🔵' : '🔴'} {profile.availability_status}
                  </span>
                )}
              </div>

              {/* Dynamic Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {(profile?.email?.endsWith('@knit.ac.in') || profile?.isVerified) && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" title="Verified KNIT Student">
                    <CheckCircle className="w-3 h-3" /> KNIT Verified Student
                  </span>
                )}

                {(profile?.skills?.length >= 3 || profileCompletion >= 75) && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <Star className="w-3 h-3" /> Top Contributor
                  </span>
                )}

                {profile?.availability_status === 'Available' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Zap className="w-3 h-3" /> Fast Responder
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 bg-amber-500/15 text-orange-400 border border-orange-500/30">
                  <Flame className="w-3 h-3 fill-orange-400 text-orange-400" /> {profile?.loginStreak || 1}d Streak (⚡ {profile?.zenPoints || 10} Pts)
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-gray-300 pt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-orange-400" /> {profile?.email}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-emerald-400" /> {profile?.branch}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {profile?.college}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Profile Progress */}
          <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="btn-primary flex-1 sm:flex-initial flex items-center justify-center text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold shadow-lg"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex-1 sm:flex-initial flex items-center justify-center text-xs sm:text-sm px-4 py-2.5 rounded-xl font-semibold"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancel Edit
                </button>
              )}

              <button
                onClick={() => {
                  logout()
                  toast.success('Logged out successfully')
                  navigate('/login')
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all shadow-sm cursor-pointer"
                title="Log out of your account"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Profile Completion Bar */}
            <div className="w-full sm:w-64 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Profile Completion</span>
                <span className="text-orange-400 font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Tabbed Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0d0d14] border border-white/10 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-100'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* TAB 1: OVERVIEW & SKILLS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {isEditing ? (
            /* Edit Form View */
            <div className="card border border-white/15 p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Edit2 className="w-5 h-5 text-orange-400" /> Edit Profile Information
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                    <input type="text" className="input w-full" placeholder="Your Name"
                      {...register('name', { required: 'Name is required' })} />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Availability Status</label>
                    <select className="input w-full" {...register('availability_status')}>
                      <option value="Available">🟢 Available</option>
                      <option value="Open to work">🔵 Open to work</option>
                      <option value="Busy">🔴 Busy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Branch</label>
                    <select className="input w-full text-xs" {...register('branch')}>
                      {['CSE','ECE','EEE','MECH','CIVIL','IT','Other'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Current Year</label>
                    <select className="input w-full text-xs" {...register('year')} onChange={(e) => { register('year').onChange(e); handleYearChange(e); }}>
                      {[1,2,3,4].map(y => (
                        <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Batch Start Year</label>
                    <select className="input w-full text-xs" {...register('startYear')} onChange={(e) => { register('startYear').onChange(e); handleStartYearChange(e); }}>
                      {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(sy => (
                        <option key={sy} value={sy}>{sy}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Passout End Year</label>
                    <select className="input w-full text-xs" {...register('endYear')}>
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(ey => (
                        <option key={ey} value={ey}>{ey}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">About Me / Bio</label>
                  <textarea className="input w-full resize-none text-xs" rows={3}
                    placeholder="Tell teammates about your experience, interests, and project goals..."
                    {...register('bio')} />
                </div>

                {/* Domain Selector */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    🎯 Domain Interests & Specialization (Select all that apply)
                  </label>
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
                    <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub URL</label>
                    <input type="text" className="input w-full text-xs" placeholder="https://github.com/username"
                      {...register('github')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">LinkedIn URL</label>
                    <input type="text" className="input w-full text-xs" placeholder="https://linkedin.com/in/username"
                      {...register('linkedin')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Portfolio URL</label>
                    <input type="text" className="input w-full text-xs" placeholder="https://yourportfolio.com"
                      {...register('portfolio')} />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={updateProfileMutation.isLoading}
                    className="btn-primary flex items-center text-xs sm:text-sm px-6 py-2.5 font-semibold">
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-secondary text-xs sm:text-sm px-5 py-2.5">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Normal Overview View */
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Column: Bio, GitHub & Domain Interests */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* About Me / Bio Card */}
                <div className="card space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-400" /> About Me
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {profile?.bio || 'No bio added yet. Click "Edit Profile" to tell teammates about yourself!'}
                  </p>
                </div>

                {/* GitHub Developer Stats Card */}
                {profile?.github && (
                  <div className="card border border-white/10 space-y-3 relative overflow-hidden bg-[#0d0d14] shadow-xl">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-500" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 flex-shrink-0">
                          <Github className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>GitHub Developer Profile</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">Active</span>
                          </h4>
                          <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">{profile.github}</p>
                        </div>
                      </div>
                      <a
                        href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sunset text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 flex-shrink-0"
                      >
                        <span>View GitHub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Domain Interests & Specialization Card */}
                <div className="card space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Domain Interests & Specializations
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
                      <p className="text-xs text-gray-400">No domain interests added yet. Click 'Edit Profile' to add fields of interest!</p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {(profile?.linkedin || profile?.portfolio) && (
                  <div className="card space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider text-gray-400">Professional Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile?.linkedin && (
                        <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-all text-xs font-semibold">
                          <Linkedin className="w-4 h-4" /> LinkedIn Profile
                        </a>
                      )}
                      {profile?.portfolio && (
                        <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all text-xs font-semibold">
                          <Globe className="w-4 h-4" /> Portfolio Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Skills & Matrix */}
              <div className="space-y-6">
                <div className="card space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-orange-400" /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-500/15 text-orange-300 rounded-lg text-xs font-semibold border border-orange-500/25"
                        >
                          {skill.skill_name}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No skills added yet</p>
                    )}
                  </div>

                  {/* Proficiency Matrix */}
                  <SkillProficiencyChart skills={profile?.skills} />
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROJECTS & ACHIEVEMENTS */}
      {activeTab === 'projects' && (
        <div className="space-y-8">
          
          {/* Showcase Projects Section */}
          <div className="card space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-orange-400" /> Showcase Projects
                </h3>
                <p className="text-xs text-gray-400">Projects created & showcased on TeamZen</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">{projects.length} Total Projects</span>
                <Link
                  to="/projects"
                  className="btn-primary text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 font-semibold shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Manage Projects
                </Link>
              </div>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project._id} className="p-5 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10 flex flex-col justify-between space-y-4 shadow-lg">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-base truncate">{project.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                          project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                      
                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.tech_stack.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-[10px] font-semibold rounded-md border border-blue-500/25">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400">
                      <span className="font-medium">Year {project.year}</span>
                      <div className="flex items-center gap-3">
                        {project.github_link && (
                          <a href={project.github_link.startsWith('http') ? project.github_link : `https://${project.github_link}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 font-semibold" title="GitHub Repo">
                            <Github className="w-3.5 h-3.5 text-gray-300" /> Code
                          </a>
                        )}
                        {project.demo_link && (
                          <a href={project.demo_link.startsWith('http') ? project.demo_link : `https://${project.demo_link}`} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 font-semibold" title="Live Demo">
                            <ExternalLink className="w-3.5 h-3.5" /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center space-y-3">
                <FolderOpen className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400">No showcase projects added to your profile yet</p>
                <Link to="/projects" className="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 font-semibold">
                  <Plus className="w-4 h-4" /> Add Your First Project
                </Link>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div className="card space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Achievements & Hackathons
                </h3>
                <p className="text-xs text-gray-400">Awards, hackathon placements, and certifications</p>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">{achievements.length} Achievements</span>
            </div>

            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement._id} className="p-5 rounded-2xl glass hover:bg-white/10 transition-all border border-white/10 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-base">{achievement.title}</h4>
                      <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/30 flex-shrink-0">
                        {achievement.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{achievement.description}</p>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400">
                      <span>{achievement.organization || 'TeamZen Community'}</span>
                      <span className="font-semibold text-amber-400">{achievement.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center space-y-2">
                <Trophy className="w-10 h-10 text-gray-500 mx-auto" />
                <p className="text-sm text-gray-400">No achievements recorded yet</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: ACCOUNT & SUPPORT */}
      {activeTab === 'account' && (
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Quick Profile Stats */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Star className="w-5 h-5 text-orange-400" /> Account & Activity Summary
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-gray-400">Profile Completion</span>
                <span className="text-orange-400 font-bold">{profileCompletion}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-gray-400">Technical Skills Listed</span>
                <span className="text-white font-bold bg-orange-500/20 px-2.5 py-0.5 rounded-lg border border-orange-500/30">{profile?.skills?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-gray-400">Showcase Projects</span>
                <span className="text-white font-bold bg-blue-500/20 px-2.5 py-0.5 rounded-lg border border-blue-500/30">{projects.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-gray-400">Achievements</span>
                <span className="text-white font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">{achievements.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 text-xs">
                <span className="text-gray-400">Member Registration Date</span>
                <span className="text-gray-200 font-semibold">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Official Email Support Card */}
          <div className="card space-y-4 border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black shadow-xl">
            <div className="flex items-center gap-2.5 text-white font-bold text-base border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3>Need Help & Official Support?</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Have questions, feedback, or technical issues on TeamZen? Contact our admin support team directly:
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Official Support Email</span>
              <p className="text-sm font-mono font-bold text-primary-300 select-all">mukul.knit26@gmail.com</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:mukul.knit26@gmail.com?subject=TeamZen%20Query%20/%20Support%20Request"
                className="btn-sunset text-xs py-2.5 px-4 flex-1 flex items-center justify-center gap-1.5 rounded-xl font-semibold shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email Query</span>
              </a>
              
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('mukul.knit26@gmail.com')
                  toast.success('Support Email copied to clipboard!')
                }}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 rounded-xl font-semibold"
                title="Copy Email Address"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </button>
            </div>
          </div>

          {/* Profile Improvement Tips Card */}
          <div className="card space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Profile Growth Tips
            </h3>
            <div className="space-y-2 text-xs text-gray-300">
              <p className="p-2.5 rounded-xl bg-white/5 border border-white/5">• Add at least 3 core technical skills to improve teammate match score.</p>
              <p className="p-2.5 rounded-xl bg-white/5 border border-white/5">• Link your GitHub profile to showcase code repositories.</p>
              <p className="p-2.5 rounded-xl bg-white/5 border border-white/5">• Select relevant Domain Interests for custom hackathon team recommendations.</p>
            </div>
          </div>

          {/* Account Danger Zone & Logout */}
          <div className="card space-y-4 border border-red-500/20">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-3">
              <Trash2 className="w-4 h-4" /> Account Session & Danger Zone
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => {
                  logout()
                  toast.success('Logged out successfully')
                  navigate('/login')
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Current Session</span>
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                {deleteAccountMutation.isLoading ? 'Deleting Account...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: LEGAL & SAFETY */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="card space-y-5 border border-white/10">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center border border-orange-500/30">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Terms of Service & Community Safety</h3>
                <p className="text-xs text-gray-400">Review TeamZen platform rules, policies, and privacy guidelines</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              TeamZen is built for student collaboration, hackathons, and academic project pairing. By using TeamZen, you agree to comply with our community safety and zero-tolerance policies.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" /> Terms of Service & Rules
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Understand your rights, user obligations, and community conduct expectations on TeamZen.
                </p>
                <button
                  onClick={() => { setTermsTab('terms'); setIsTermsOpen(true) }}
                  className="btn-sunset text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <span>Open Terms of Service</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy Policy
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Learn how your personal student data is stored securely and processed exclusively for teammate matching.
                </p>
                <button
                  onClick={() => { setTermsTab('privacy'); setIsTermsOpen(true) }}
                  className="btn-secondary text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <span>Open Privacy Policy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Consent Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl p-6 space-y-5"
            style={{ background: '#0d0d14', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center border border-red-500/30">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Delete Account</h2>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs font-bold text-red-400">This action is permanent and cannot be undone.</p>
              <p className="text-[11px] text-gray-400">The following data will be erased forever:</p>
              <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
                <li>Your profile and account credentials</li>
                <li>All teams created by you</li>
                <li>All direct messages & chats</li>
                <li>All achievements and showcase projects</li>
              </ul>
            </div>

            {/* Confirm input */}
            <div>
              <p className="text-xs text-gray-400 mb-2">
                Type <span className="font-semibold text-white">{profile?.name}</span> to confirm:
              </p>
              <input
                type="text"
                className="input w-full text-xs"
                placeholder={profile?.name}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAccountMutation.mutate()}
                disabled={deleteConfirmText !== profile?.name || deleteAccountMutation.isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={tempImageSrc}
        onCancel={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
      />

    </div>
  )
}

export default Profile
