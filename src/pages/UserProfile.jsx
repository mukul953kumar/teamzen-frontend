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
    <div className="space-y-3.5 pt-4 border-t border-white/10 mt-6">
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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center text-xs sm:text-sm px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">User Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="relative">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary-400/30"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {user.isVerified && (
                <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <button
                onClick={handleInviteToTeam}
                className="btn-primary flex items-center justify-center text-xs sm:text-sm py-2 px-4"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Team
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              
              {/* Dynamic Verified Student Badges */}
              <div className="flex flex-wrap gap-2 my-3">
                {(user.email?.endsWith('@knit.ac.in') || user.isVerified) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    KNIT Verified Student
                  </span>
                )}
                {(user.skills?.length >= 3) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    ⭐ Top Contributor
                  </span>
                )}
                {user.availability_status === 'Available' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    ⚡ Fast Responder
                  </span>
                )}
              </div>

              <div className="space-y-2 text-gray-400 mt-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="truncate max-w-[220px] sm:max-w-md">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{user.college}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{user.branch} • {user.year}{user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* GitHub Developer Card */}
            {user.github && (
              <div className="mb-6 p-4 rounded-2xl bg-[#0d0d14] border border-white/10 space-y-3 relative overflow-hidden shadow-xl">
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
                      <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-xs">{user.github}</p>
                    </div>
                  </div>
                  <a
                    href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
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

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {user.linkedin && (
                <a
                  href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:underline transition-colors"
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
      <div className="card overflow-hidden">
        <div className="flex overflow-x-auto custom-scrollbar border-b border-white/20 gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'about'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'skills'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'projects'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'achievements'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
        </div>

        <div className="p-4 sm:p-6">
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
              {/* Visual Technical Matrix */}
              <SkillProficiencyChart skills={user.skills} />
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
