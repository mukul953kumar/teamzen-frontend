import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Code, 
  Trophy,
  Github, 
  Linkedin, 
  ExternalLink,
  Users,
  UserPlus,
  FolderOpen,
  ArrowLeft
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('about')

  const { data: userProfile, isLoading } = useQuery(
    ['userProfile', userId],
    async () => {
      try {
        const response = await api.get(`/profile/${userId}`)
        console.log('User Profile API Response:', response.data)
        return response.data.data
      } catch (error) {
        console.error('User profile error:', error)
        toast.error('Failed to load user profile')
        return null
      }
    },
    {
      enabled: !!userId,
      retry: false
    }
  )

  const { data: userProjects } = useQuery(
    ['userProjects', userId],
    async () => {
      try {
        const response = await api.get(`/projects/user/${userId}`)
        return response.data.data?.projects || []
      } catch (error) {
        console.error('User projects error:', error)
        return []
      }
    },
    {
      enabled: !!userId,
      retry: false
    }
  )

  const { data: userAchievements } = useQuery(
    ['userAchievements', userId],
    async () => {
      try {
        const response = await api.get(`/achievements/user/${userId}`)
        return response.data.data?.achievements || []
      } catch (error) {
        console.error('User achievements error:', error)
        return []
      }
    },
    {
      enabled: !!userId,
      retry: false
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!userProfile?.user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">User Not Found</h3>
        <p className="text-gray-400 mb-6">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  const user = userProfile.user

  const handleInviteToTeam = () => {
    // Navigate to teams page to invite this user
    navigate('/teams')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">User Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="relative">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-400/30"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {user.isVerified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 w-full lg:w-auto">
              <button
                onClick={handleInviteToTeam}
                className="btn-primary flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Team
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.college}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.branch} • {user.year}{user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300">{user.bio}</p>
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.portfolio && (
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-white/20">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'skills'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'projects'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'text-white border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
        </div>

        <div className="p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Education & Background</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-5 h-5 text-primary-400" />
                      <span className="font-medium text-white">College</span>
                    </div>
                    <p className="text-gray-300">{user.college}</p>
                  </div>
                  <div className="p-4 rounded-xl glass">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="w-5 h-5 text-primary-400" />
                      <span className="font-medium text-white">Branch & Year</span>
                    </div>
                    <p className="text-gray-300">{user.branch} • {user.year}{user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year</p>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Bio</h3>
                  <div className="p-4 rounded-xl glass">
                    <p className="text-gray-300">{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-600/20 text-primary-400 rounded-full border border-primary-400/30"
                    >
                      {typeof skill === 'string' ? skill : skill.skill_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No skills listed yet.</p>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Projects</h3>
              {userProjects && userProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {userProjects.map((project) => (
                    <div key={project._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                      <h4 className="font-medium text-white mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tech_stack?.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{project.year}</span>
                        <span className="text-primary-400">{project.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No projects shared yet.</p>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
              {userAchievements && userAchievements.length > 0 ? (
                <div className="space-y-4">
                  {userAchievements.map((achievement) => (
                    <div key={achievement._id} className="p-4 rounded-xl glass hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{achievement.title}</h4>
                        <span className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded">
                          {achievement.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{achievement.organization}</span>
                        <span className="text-primary-400">{achievement.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No achievements listed yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
