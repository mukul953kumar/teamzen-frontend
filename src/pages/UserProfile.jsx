import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
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
  ArrowLeft,
  Heart,
  Eye,
  Flame,
  Zap,
  CheckCircle,
  Globe,
  Award,
  X,
  Send
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'
import { soundManager } from '../services/soundUtils'
import { getDomainBadgeStyle } from '../utils/domainUtils'

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
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('about')

  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [projectLikesState, setProjectLikesState] = useState({})
  const [achievementLikesState, setAchievementLikesState] = useState({})

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')

  const { data: myTeamsData } = useQuery(
    'myTeams',
    () => api.get('/teams/my-teams').then(res => res.data),
    { enabled: showInviteModal, retry: false }
  )

  const inviteMutation = useMutation(
    ({ teamId, targetUserId, message }) => api.post(`/teams/${teamId}/invite`, { user_id: targetUserId, message }),
    {
      onSuccess: () => {
        soundManager.playInviteSound()
        toast.success('🎉 Team invitation sent successfully!')
        setShowInviteModal(false)
        setSelectedTeam('')
        setInviteMessage('')
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to send invitation')
    }
  )

  const { data: userProfile, isLoading } = useQuery(
    ['userProfile', userId],
    async () => {
      try {
        const response = await api.get(`/profile/${userId}`)
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
        const response = await api.get(`/projects?user_id=${userId}`)
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

  const projectLikeMutation = useMutation(
    (projectId) => api.post(`/projects/like/${projectId}`),
    {
      onSuccess: (res, projectId) => {
        setProjectLikesState(prev => ({
          ...prev,
          [projectId]: {
            liked: res.data.liked,
            count: res.data.likesCount
          }
        }))
        toast.success(res.data.message)
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to like project')
    }
  )

  const achievementLikeMutation = useMutation(
    (achievementId) => api.post(`/achievements/like/${achievementId}`),
    {
      onSuccess: (res, achievementId) => {
        setAchievementLikesState(prev => ({
          ...prev,
          [achievementId]: {
            liked: res.data.liked,
            count: res.data.likesCount
          }
        }))
        toast.success(res.data.message)
      },
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to like achievement')
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
    setShowInviteModal(true)
  }

  const handleSendInvite = () => {
    if (!selectedTeam) return toast.error('Please select a team')
    inviteMutation.mutate({
      teamId: selectedTeam,
      targetUserId: user._id,
      message: inviteMessage || `Hi ${user.name}, I'd like to invite you to join my team!`
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Hackathon': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Competition': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Certification': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Award': return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getPositionColor = (pos) => {
    switch (pos) {
      case '1st':
      case 'Winner': return 'bg-amber-400/20 text-amber-300 border-amber-400/30'
      case '2nd': return 'bg-slate-300/20 text-slate-200 border-slate-300/30'
      case '3rd': return 'bg-amber-600/20 text-amber-400 border-amber-600/30'
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4 overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center text-xs sm:text-sm px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Student Profile</h1>
      </div>

      {/* Main Profile Header Card */}
      <div className="card overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 pt-2">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="relative">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-primary-400/30 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-r from-primary-400 to-purple-500 flex items-center justify-center shadow-xl">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <button
                onClick={handleInviteToTeam}
                className="btn-primary flex items-center justify-center text-xs sm:text-sm py-2 px-4 shadow-lg shadow-primary-500/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Team
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name}</h2>
              
              {/* Dynamic Badges */}
              <div className="flex flex-wrap gap-2 my-3">
                {(user.email?.endsWith('@knit.ac.in') || user.isVerified) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    KNIT Verified Student
                  </span>
                )}
                {user.skills?.length >= 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm">
                    ⭐ Top Contributor
                  </span>
                )}
                {user.availability_status === 'Available' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm">
                    ⚡ Fast Responder
                  </span>
                )}
                {user.likesCount > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    {user.likesCount} Profile {user.likesCount === 1 ? 'Like' : 'Likes'}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-500/15 text-orange-400 border border-orange-500/30 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  {user.loginStreak || 1}d Streak (⚡ {user.zenPoints || 10} Pts)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 mt-4 text-xs sm:text-sm">
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
                  <span>{user.branch} • Year {user.year} ({user.startYear || (2026 - ((Number(user.year) || 3) - 1))} – {user.endYear || ((user.startYear || (2026 - ((Number(user.year) || 3) - 1))) + 4)} Batch)</span>
                </div>
              </div>
            </div>

            {/* GitHub Developer Card */}
            {user.github && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#0d0d14] border border-white/10 space-y-3 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-500" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 flex-shrink-0">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>GitHub Developer Profile</span>
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-xs">{user.github}</p>
                    </div>
                  </div>
                  <a
                    href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sunset text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 flex-shrink-0"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Domain Interests & Specializations Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Domain Interests & Specializations</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.hackathon_interests?.length > 0 ? (
                  user.hackathon_interests.map((interest, idx) => {
                    const style = getDomainBadgeStyle(interest)
                    return (
                      <span key={idx} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${style.color} shadow-sm`}>
                        <span>{style.icon}</span>
                        <span>{interest}</span>
                      </span>
                    )
                  })
                ) : (
                  <p className="text-xs text-gray-400">No domain interests specified yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="card overflow-hidden">
        <div className="flex overflow-x-auto custom-scrollbar border-b border-white/20 gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'about'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'skills'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Skills ({user.skills?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'projects'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects ({userProjects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
              activeTab === 'achievements'
                ? 'text-white border-b-2 border-primary-400 bg-white/5 sm:bg-transparent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements ({userAchievements?.length || 0})
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Education & Academic Background</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl glass border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold text-white">College / Institution</span>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">{user.college}</p>
                  </div>
                  <div className="p-4 rounded-2xl glass border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold text-white">Branch & Batch</span>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">{user.branch} • Year {user.year} ({user.startYear || (2026 - ((Number(user.year) || 3) - 1))} – {user.endYear || ((user.startYear || (2026 - ((Number(user.year) || 3) - 1))) + 4)} Batch)</p>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Bio / Summary</h3>
                  <div className="p-4 rounded-2xl glass border border-white/10 leading-relaxed text-sm text-gray-200">
                    <p>{user.bio}</p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Social & External Links</h3>
                <div className="flex flex-wrap gap-3">
                  {user.linkedin && (
                    <a
                      href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors text-xs font-semibold"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {user.portfolio && (
                    <a
                      href={user.portfolio.startsWith('http') ? user.portfolio : `https://${user.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-xs font-semibold"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Personal Portfolio</span>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors text-xs font-semibold"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub Repositories</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary-400" />
                Technical Skills & Stack
              </h3>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 bg-primary-600/20 text-primary-300 rounded-xl text-xs font-semibold border border-primary-500/30 shadow-sm"
                    >
                      {typeof skill === 'string' ? skill : skill.skill_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No skills listed yet.</p>
              )}

              {/* Visual Technical Matrix */}
              <SkillProficiencyChart skills={user.skills} />
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary-400" />
                  Showcase Projects
                </h3>
                <span className="text-xs text-gray-400">{userProjects?.length || 0} Projects</span>
              </div>

              {userProjects && userProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {userProjects.map((project) => {
                    const isOwner = currentUser && (project.user_id?._id === currentUser._id || project.user_id === currentUser._id)
                    const userLikesInfo = projectLikesState[project._id] || {
                      liked: currentUser && Array.isArray(project.likedBy)
                        ? project.likedBy.some(id => id.toString() === currentUser._id || id === currentUser._id)
                        : false,
                      count: project.likesCount || 0
                    }
                    const isLiked = userLikesInfo.liked
                    const count = userLikesInfo.count

                    return (
                      <div
                        key={project._id}
                        onClick={() => setSelectedProject(project)}
                        className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 shadow-lg"
                      >
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500" />

                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-white text-base group-hover:text-primary-300 transition-colors truncate">
                              {project.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                              project.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {project.status}
                            </span>
                          </div>

                          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{project.description}</p>

                          {project.tech_stack?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tech_stack.slice(0, 4).map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-blue-500/15 text-blue-300 border border-blue-500/25 text-[10px] font-semibold rounded-md"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/10 text-xs text-gray-400" onClick={(e) => e.stopPropagation()}>
                          {/* Heart Like Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!currentUser) return toast.error('Please login to like projects')
                              if (isOwner) return toast.error('You cannot like your own project')
                              projectLikeMutation.mutate(project._id)
                            }}
                            disabled={projectLikeMutation.isLoading}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all ${
                              isLiked
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400'
                            } ${isOwner ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{count}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {project.github_link && (
                              <a
                                href={project.github_link.startsWith('http') ? project.github_link : `https://${project.github_link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                title="GitHub Code"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {project.demo_link && (
                              <a
                                href={project.demo_link.startsWith('http') ? project.demo_link : `https://${project.demo_link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="btn-primary text-xs px-2.5 py-1 flex items-center gap-1 font-semibold rounded-lg"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No showcase projects shared yet.</p>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Achievements & Awards
                </h3>
                <span className="text-xs text-gray-400">{userAchievements?.length || 0} Achievements</span>
              </div>

              {userAchievements && userAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {userAchievements.map((achievement) => {
                    const isOwner = currentUser && (achievement.user_id?._id === currentUser._id || achievement.user_id === currentUser._id)
                    const userLikesInfo = achievementLikesState[achievement._id] || {
                      liked: currentUser && Array.isArray(achievement.likedBy)
                        ? achievement.likedBy.some(id => id.toString() === currentUser._id || id === currentUser._id)
                        : false,
                      count: achievement.likesCount || 0
                    }
                    const isLiked = userLikesInfo.liked
                    const count = userLikesInfo.count

                    return (
                      <div
                        key={achievement._id}
                        onClick={() => setSelectedAchievement(achievement)}
                        className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 shadow-lg space-y-3"
                      >
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-purple-500" />

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors truncate">
                              {achievement.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${getPositionColor(achievement.position)}`}>
                              {achievement.position}
                            </span>
                          </div>

                          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{achievement.description}</p>

                          {achievement.organization && (
                            <p className="text-[11px] text-gray-400">Issued by: <strong className="text-gray-200">{achievement.organization}</strong></p>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs text-gray-400" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!currentUser) return toast.error('Please login to like achievements')
                              if (isOwner) return toast.error('You cannot like your own achievement')
                              achievementLikeMutation.mutate(achievement._id)
                            }}
                            disabled={achievementLikeMutation.isLoading}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all ${
                              isLiked
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-rose-400'
                            } ${isOwner ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{count}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {achievement.certificate_link && (
                              <a
                                href={achievement.certificate_link.startsWith('http') ? achievement.certificate_link : `https://${achievement.certificate_link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                title="Certificate"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setSelectedAchievement(achievement)}
                              className="btn-primary text-xs px-2.5 py-1 flex items-center gap-1 font-semibold rounded-lg"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No achievements listed yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

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
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getTypeColor(selectedAchievement.type)}`}>
                    {selectedAchievement.type}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getPositionColor(selectedAchievement.position)}`}>
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

      {/* Team Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0f0f17] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-400" />
                Invite {user.name} to Team
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Select Your Team *</label>
                {myTeamsData?.data?.teams?.length > 0 ? (
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Choose a team...</option>
                    {myTeamsData.data.teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.team_name} {team.user_role === 'Leader' && '(Leader)'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-center py-6 px-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <Users className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-300">You haven't created any teams yet</p>
                    <button
                      onClick={() => { setShowInviteModal(false); navigate('/teams') }}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Create Team
                    </button>
                  </div>
                )}
              </div>

              {myTeamsData?.data?.teams?.length > 0 && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Personal Message (Optional)</label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder={`Hi ${user.name}, we'd love to have you on our team!`}
                      className="w-full px-4 py-2.5 bg-gray-800/80 border border-white/15 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendInvite}
                      disabled={!selectedTeam || inviteMutation.isLoading}
                      className="btn-sunset px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 disabled:opacity-50"
                    >
                      {inviteMutation.isLoading ? (
                        <><LoadingSpinner size="small" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Invitation</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
