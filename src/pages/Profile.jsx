import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/useAuth'
import { useNavigate } from 'react-router-dom'
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
  Trash2
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const fileInputRef = useRef(null)

  const { data: profileData, isLoading } = useQuery(
    'profile',
    () => api.get('/auth/me').then(res => res.data.data),
    { enabled: !!user }
  )

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
        if (key !== 'profile_image') {
          formData.append(key, profileData[key])
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
      onSuccess: () => {
        queryClient.invalidateQueries('profile')
        queryClient.invalidateQueries('currentUser')
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
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  const handleEdit = () => {
    if (profileData?.user) {
      reset({
        name: profileData.user.name,
        bio: profileData.user.bio,
        branch: profileData.user.branch,
        year: profileData.user.year,
        github: profileData.user.github,
        linkedin: profileData.user.linkedin,
        portfolio: profileData.user.portfolio,
        availability_status: profileData.user.availability_status || 'Available',
        hackathon_interests: profileData.user.hackathon_interests || [],
        skills: profileData.user.skills?.map(skill => skill.skill_name) || []
      })
      setPreviewImage(profileData.user.profile_image)
    }
    setIsEditing(true)
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

  const profile = profileData?.user
  const achievements = achievementsData?.achievements || []

  const profileCompletion = (() => {
    if (!profile) return 0
    const fields = [profile.name, profile.bio, profile.github, profile.linkedin, profile.portfolio, profile.college, profile.branch, profile.year]
    const skills = profile.skills?.length > 0 ? 1 : 0
    const filled = fields.filter(Boolean).length + skills
    return Math.round((filled / (fields.length + 1)) * 100)
  })()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="btn-primary flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="card">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {(previewImage || profile?.profile_image) ? (
                    <img
                      src={previewImage || profile?.profile_image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Branch</label>
                        <select className="input w-full" {...register('branch')}>
                          {['CSE','ECE','EEE','MECH','CIVIL','IT','Other'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Year</label>
                        <select className="input w-full" {...register('year')}>
                          {[1,2,3,4].map(y => (
                            <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>
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
                    <p className="text-gray-400 mb-4">{profile?.bio || 'No bio added yet'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{profile?.college}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{profile?.year}{profile?.year === 1 ? 'st' : profile?.year === 2 ? 'nd' : profile?.year === 3 ? 'rd' : 'th'} Year</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span>{profile?.branch}</span>
                      </div>
                    </div>

                    {/* Social Links - properly shown with URLs */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {profile?.github && (
                        <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all text-sm">
                          <Github className="w-4 h-4" /> GitHub
                        </a>
                      )}
                      {profile?.linkedin && (
                        <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all text-sm">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      )}
                      {profile?.portfolio && (
                        <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all text-sm">
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
                    className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-lg text-sm"
                  >
                    {skill.skill_name}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills added yet</p>
              )}
            </div>
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
    </div>
  )
}

export default Profile
