import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { 
  Rocket, 
  Search, 
  Calendar, 
  Trophy, 
  ExternalLink, 
  Users, 
  Clock, 
  Sparkles,
  MapPin,
  CheckCircle2,
  Zap,
  Filter,
  Plus,
  X
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/useAuth'
import { Trash2 } from 'lucide-react'

// Live Countdown Component
const CountdownBadge = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline) - new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [deadline])

  const isExpired = new Date(deadline) < new Date()

  if (isExpired) {
    return (
      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-900/40">
        Ended / Closed
      </span>
    )
  }

  return (
    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
      <Clock className="w-3 h-3 text-amber-400" />
      <span>{timeLeft.days}d {timeLeft.hours}h left</span>
    </span>
  )
}

const Hackathons = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMode, setSelectedMode] = useState('All')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    description: '',
    mode: 'Online',
    prize_pool: '',
    registration_deadline: '',
    official_url: '',
    tags: ''
  })

  const { data: hackathonData, isLoading } = useQuery(
    ['upcomingHackathons', selectedMode, searchTerm],
    async () => {
      const params = new URLSearchParams()
      if (selectedMode !== 'All') params.append('mode', selectedMode)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await api.get(`/hackathons/upcoming?${params.toString()}`)
      return response.data.data
    },
    { refetchInterval: 60000 }
  )

  const submitMutation = useMutation(
    (data) => api.post('/hackathons', data),
    {
      onSuccess: () => {
        toast.success('Hackathon submitted successfully!')
        setShowSubmitModal(false)
        setFormData({
          title: '',
          organizer: '',
          description: '',
          mode: 'Online',
          prize_pool: '',
          registration_deadline: '',
          official_url: '',
          tags: ''
        })
        queryClient.invalidateQueries('upcomingHackathons')
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to submit hackathon')
      }
    }
  )

  const deleteMutation = useMutation(
    (id) => api.delete(`/hackathons/${id}`),
    {
      onSuccess: () => {
        toast.success('Hackathon deleted successfully!')
        queryClient.invalidateQueries('upcomingHackathons')
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to delete hackathon')
      }
    }
  )

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.organizer || !formData.official_url || !formData.registration_deadline) {
      return toast.error('Please fill required fields (Title, Organizer, URL, Deadline)')
    }
    submitMutation.mutate(formData)
  }

  const hackathons = hackathonData?.hackathons || []

  const handleFindTeammates = (hackathonTitle) => {
    navigate(`/teammate-finder?search=${encodeURIComponent(hackathonTitle)}`)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12 font-mono text-slate-100">
      
      {/* ── Hero Banner Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4 bg-slate-950/90">
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AUTOMATED_EVENT_FEED: LIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Rocket className="w-7 h-7 text-amber-400" />
              <span>Upcoming Student Hackathons</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Discover active Indian & global student hackathons, win prizes, and find verified teammates with 1-click.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/40 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Event</span>
            </button>

            <button
              onClick={() => navigate('/teams')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Post Your Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search & Mode Filters ── */}
      <div className="rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-950/90 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Mode Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 mr-1 font-bold">
              <Filter className="w-3.5 h-3.5" /> Mode:
            </span>
            {['All', 'Online', 'Hybrid', 'Offline'].map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedMode === mode
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              placeholder="Search SIH 2026, Devfolio, AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Hackathon Cards Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Active Student Hackathons ({hackathons.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Auto-synced every 12 hours</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="large" />
          </div>
        ) : hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hackathons.map((h) => (
              <div
                key={h._id}
                className="relative group rounded-xl overflow-hidden bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 p-5 shadow-xl"
              >
                {/* Top Metallic Border for Featured Events */}
                {h.is_featured && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />
                )}

                <div className="space-y-3.5">
                  {/* Top Row: Organizer & Countdown */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800 truncate max-w-[160px]">
                      🏛️ {h.organizer}
                    </span>
                    <CountdownBadge deadline={h.registration_deadline} />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {h.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                      {h.description}
                    </p>
                  </div>

                  {/* Prize & Mode Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">PRIZE POOL</span>
                      <span className="text-xs font-bold text-amber-400 truncate block">{h.prize_pool || 'TBA'}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold block">EVENT MODE</span>
                      <span className="text-xs font-bold text-emerald-400 truncate block">🌐 {h.mode || 'Online'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {h.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {h.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800 text-xs">
                  <a
                    href={h.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                    title="Official Registration Page"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleFindTeammates(h.title)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Find Teammates</span>
                  </button>

                  {/* Delete Button for Submitter */}
                  {user && (h.submitted_by === user._id || h.submitted_by?._id === user._id) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(h._id, h.title)}
                      className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-800 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
                      title="Delete Submitted Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-3">
            <Rocket className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No hackathons found</h3>
            <p className="text-xs text-slate-400">Try adjusting your mode filter or search keyword.</p>
          </div>
        )}
      </div>

      {/* ── Submit Hackathon Modal ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-amber-400" />
                <span>Submit Campus / Online Hackathon</span>
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Hackathon Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KNIT Innovate 2026 / Hacktoberfest"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Organizer / College *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KNIT Sultanpur / GDSC"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Event Mode</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  >
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Prize Pool</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 / $5,000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Registration Deadline *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Official Registration Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  value={formData.official_url}
                  onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of problem statements, tracks, eligibility..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isLoading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md hover:scale-105 transition-transform"
                >
                  {submitMutation.isLoading ? 'Submitting...' : 'Submit Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Hackathons
