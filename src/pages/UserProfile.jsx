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
    { label: 'Frontend & UI Engineering', count: feCount, color: '#f97316', percent: Math.min(100, Math.round((feCount > 0 ? (feCount / maxVal) * 75 + 25 : 15))) },
    { label: 'Backend Systems & APIs', count: beCount, color: '#a855f7', percent: Math.min(100, Math.round((beCount > 0 ? (beCount / maxVal) * 75 + 25 : 15))) },
    { label: 'Database & Cloud DevOps', count: dbCount, color: '#10b981', percent: Math.min(100, Math.round((dbCount > 0 ? (dbCount / maxVal) * 75 + 25 : 15))) },
    { label: 'AI, ML & Data Analytics', count: aiCount, color: '#3b82f6', percent: Math.min(100, Math.round((aiCount > 0 ? (aiCount / maxVal) * 75 + 25 : 15))) }
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
      <div className="text-center py-16 space-y-4">
        <User className="w-16 h-16 text-gray-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">User Profile Not Found</h3>
        <button onClick={() => navigate(-1)} className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold">
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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4 overflow-x-hidden pb-12">
      
      {/* Top Header Navigation */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center text-xs sm:text-sm px-3.5 py-2 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Student Developer Profile</h1>
      </div>

      {/* Main Profile Header Hero Card */}
      <div className="card relative overflow-hidden p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 13, 20, 0.95) 0%, rgba(20, 20, 35, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
        
        {/* Ambient Lighting Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 relative z-10">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4 shrink-0">
            <div className="relative">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-xl border border-white/20">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0d0d14] shadow-md">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full sm:w-auto">
              <button
                onClick={handleInviteToTeam}
                className="btn-sunset flex items-center justify-center text-xs sm:text-sm py-2.5 px-5 rounded-xl font-bold shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Team
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{user.name}</h2>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 my-2.5">
                {(user.email?.endsWith('@knit.ac.in') || user.isVerified) && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    KNIT Verified Student
                  </span>
                )}
                {user.skills?.length >= 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ⭐ Top Contributor
                  </span>
                )}
                {user.availability_status === 'Available' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    ⚡ Fast Responder
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  {user.loginStreak || 1}d Streak ({user.zenPoints || 10} Pts)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-gray-300 mt-3 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 min-w-0">
                  <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="truncate">{user.college || 'KNIT Sultanpur'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{user.branch} • Year {user.year}</span>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            {user.github && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white">GitHub Profile</h4>
                      <p className="text-[11px] text-gray-400 truncate">{user.github}</p>
                    </div>
                  </div>
                  <a
                    href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sunset text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>View GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Domain Specializations */}
            {user.hackathon_interests?.length > 0 && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Domain Interests & Specializations</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.hackathon_interests.map((interest, idx) => {
                    const style = getDomainBadgeStyle(interest)
                    return (
                      <span key={idx} className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${style.color}`}>
                        <span>{style.icon}</span>
                        <span>{interest}</span>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="card p-5 sm:p-6 border border-white/10 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📌 About & Overview
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💻 Skills ({user.skills?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📁 Projects ({userProjects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏆 Achievements ({userAchievements?.length || 0})
          </button>
        </div>

        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" /> Institution
                </span>
                <p className="text-sm font-bold text-white">{user.college || 'KNIT Sultanpur'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-400" /> Branch & Year
                </span>
                <p className="text-sm font-bold text-white">{user.branch} • Year {user.year}</p>
              </div>
            </div>

            {user.bio && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio / Summary</h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {user.bio}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-orange-400" /> Technical Skills
            </h3>
            {user.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-orange-500/15 text-orange-300 rounded-xl text-xs font-bold border border-orange-500/30"
                  >
                    {typeof skill === 'string' ? skill : skill.skill_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No skills listed yet.</p>
            )}

            <SkillProficiencyChart skills={user.skills} />
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {userProjects?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userProjects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer space-y-2.5 shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-sm truncate">{project.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {project.status || 'Completed'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No showcase projects shared yet.</p>
            )}
          </div>
        )}

        {/* Tab 4: Achievements */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {userAchievements?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userAchievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    onClick={() => setSelectedAchievement(achievement)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer space-y-2 shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-sm truncate">{achievement.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPositionColor(achievement.position)}`}>
                        {achievement.position}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2">{achievement.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No achievements listed yet.</p>
            )}
          </div>
        )}

      </div>

      {/* Team Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md card p-6 space-y-4 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-400" /> Invite {user.name} to Team
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300">Select Team *</label>
              {myTeamsData?.data?.teams?.length > 0 ? (
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="input w-full text-xs"
                >
                  <option value="">Choose a team...</option>
                  {myTeamsData.data.teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.team_name} {team.user_role === 'Leader' && '(Leader)'}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-gray-400">You don't have any active teams.</p>
              )}

              {myTeamsData?.data?.teams?.length > 0 && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button onClick={() => setShowInviteModal(false)} className="btn-secondary text-xs px-4 py-2 rounded-xl font-semibold">
                    Cancel
                  </button>
                  <button onClick={handleSendInvite} disabled={!selectedTeam || inviteMutation.isLoading} className="btn-sunset text-xs px-5 py-2 rounded-xl font-bold shadow-md">
                    {inviteMutation.isLoading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default UserProfile
