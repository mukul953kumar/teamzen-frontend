import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
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
  Upload
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const { data: profileData, isLoading } = useQuery(
    'profile',
    () => api.get('/auth/me').then(res => res.data.data),
    { enabled: !!user }
  )

  const { data: achievementsData } = useQuery(
    'userAchievements',
    () => {
      console.log('Fetching achievements for user:', user?._id);
      return api.get(`/achievements/user/${user?._id}`).then(res => {
        console.log('Achievements response:', res.data);
        return res.data.data;
      });
    },
    { 
      enabled: !!user,
      retry: false,
      refetchOnWindowFocus: true,
      cacheTime: 0,
      staleTime: 0
    }
  )

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
        github: profileData.user.github,
        linkedin: profileData.user.linkedin,
        portfolio: profileData.user.portfolio,
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

  console.log('User available:', user);
  console.log('Profile data:', profileData);
  
  const profile = profileData?.user
  const achievements = achievementsData?.achievements || []

  // Debug: Log achievements data
  console.log('Profile Debug:', {
    profile,
    achievements,
    achievementsData,
    achievementsLength: achievements.length
  })

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
                    <div>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Your Name"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <textarea
                        className="input w-full resize-none"
                        rows={3}
                        placeholder="Tell us about yourself..."
                        {...register('bio')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="url"
                        className="input"
                        placeholder="GitHub URL"
                        {...register('github')}
                      />
                      <input
                        type="url"
                        className="input"
                        placeholder="LinkedIn URL"
                        {...register('linkedin')}
                      />
                      <input
                        type="url"
                        className="input"
                        placeholder="Portfolio URL"
                        {...register('portfolio')}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="btn-primary flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{profile?.name}</h2>
                    <p className="text-gray-400 mb-4">{profile?.bio || 'No bio added yet'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail className="w-4 h-4" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{profile?.college}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{profile?.year}{profile?.year === 1 ? 'st' : profile?.year === 2 ? 'nd' : profile?.year === 3 ? 'rd' : 'th'} Year</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <User className="w-4 h-4" />
                        <span>{profile?.branch}</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4 mt-4">
                      {profile?.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {profile?.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile?.portfolio && (
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Globe className="w-5 h-5" />
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
                    <div className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-primary-400 font-medium ml-2">75%</span>
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
        </div>
      </div>
    </div>
  )
}

export default Profile
