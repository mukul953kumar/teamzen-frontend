import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import api from '../services/authAPI'
import toast from 'react-hot-toast'
import { 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Code, 
  Plus, 
  Check, 
  X,
  Cpu,
  Smartphone,
  Globe,
  Database,
  Shield,
  Palette,
  Terminal
} from 'lucide-react'

const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
const years = [1, 2, 3, 4]

const startYearsList = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
const endYearsList = [2024, 2025, 2026, 2027, 2028, 2029, 2030]

const skillCategories = [
  {
    category: '🤖 AI, ML & Data Science',
    skills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'OpenCV', 'Data Science', 'NLP', 'GenAI / LLMs', 'Python']
  },
  {
    category: '📱 Android & Mobile Dev',
    skills: ['Flutter', 'Android (Kotlin)', 'Android (Java)', 'React Native', 'iOS (Swift)', 'Dart']
  },
  {
    category: '🌐 Web & Fullstack',
    skills: ['React', 'Node.js', 'Express.js', 'JavaScript', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML/CSS']
  },
  {
    category: '⚙️ Backend & Systems',
    skills: ['Java', 'C++', 'C Language', 'Go (Golang)', 'Django', 'FastAPI', 'Spring Boot', 'PHP']
  },
  {
    category: '🛢️ Databases & Cloud',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Redis', 'AWS', 'Docker', 'Git & GitHub']
  },
  {
    category: '🎨 UI/UX & Design',
    skills: ['UI/UX Design', 'Figma', 'Canva', 'Adobe XD']
  },
  {
    category: '🛡️ Cybersecurity & Hardware',
    skills: ['Cybersecurity', 'Ethical Hacking', 'IoT & Embedded', 'Blockchain', 'Open Source']
  }
]

const CompleteProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [branch, setBranch] = useState('CSE')
  const [year, setYear] = useState(1)
  const [startYear, setStartYear] = useState(2023)
  const [endYear, setEndYear] = useState(2027)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleAddCustomSkill = (e) => {
    e.preventDefault()
    const trimmed = customSkillInput.trim()
    if (!trimmed) return
    if (selectedSkills.includes(trimmed)) {
      toast.error('Skill already selected')
      return
    }
    setSelectedSkills(prev => [...prev, trimmed])
    setCustomSkillInput('')
    toast.success(`Added "${trimmed}" to your skills`)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (selectedSkills.length === 0) {
      toast.error('Please select at least 1 skill to complete your profile')
      return
    }

    setIsLoading(true)
    try {
      await api.post('/auth/complete-profile', {
        branch,
        year: parseInt(year),
        startYear: parseInt(startYear),
        endYear: parseInt(endYear),
        skills: selectedSkills
      })
      toast.success('Profile completed successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12"
      style={{
        backgroundImage: 'url("/images/image3.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 12, 0.82)', backdropFilter: 'blur(8px)', zIndex: 0 }} />

      <div className="relative z-10 w-full max-w-2xl my-auto">
        <div className="card border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 border border-white/15 mb-1">
              <img src="/images/TeamZen.png" alt="TeamZen" className="h-10 w-auto" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              Complete Your Profile <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Welcome, <span className="font-bold text-primary-300">{user?.name}</span>! Tell us about your branch, session, and skills to connect with ideal teammates.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Academic Details Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Academic Branch & Session
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Branch / Stream *</label>
                  <select
                    className="input w-full text-xs sm:text-sm"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    style={{ backgroundColor: '#181824', color: '#f1f5f9' }}
                  >
                    {branches.map(b => (
                      <option key={b} value={b} style={{ backgroundColor: '#181824', color: '#f1f5f9' }}>
                        {b === 'CSE' ? 'CSE (Computer Science)' :
                         b === 'ECE' ? 'ECE (Electronics)' :
                         b === 'EEE' ? 'EEE (Electrical)' :
                         b === 'MECH' ? 'MECH (Mechanical)' :
                         b === 'CIVIL' ? 'CIVIL (Civil Eng.)' :
                         b === 'IT' ? 'IT (Information Tech)' : b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Current Study Year *</label>
                  <select
                    className="input w-full text-xs sm:text-sm"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    style={{ backgroundColor: '#181824', color: '#f1f5f9' }}
                  >
                    {years.map(y => (
                      <option key={y} value={y} style={{ backgroundColor: '#181824', color: '#f1f5f9' }}>
                        {y}{y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th'} Year Student
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start & End Batch Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Starting Year (Batch Start)
                  </label>
                  <select
                    className="input w-full text-xs sm:text-sm"
                    value={startYear}
                    onChange={e => setStartYear(e.target.value)}
                    style={{ backgroundColor: '#181824', color: '#f1f5f9' }}
                  >
                    {startYearsList.map(sy => (
                      <option key={sy} value={sy} style={{ backgroundColor: '#181824', color: '#f1f5f9' }}>
                        {sy} (Joined)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Ending Year (Graduation)
                  </label>
                  <select
                    className="input w-full text-xs sm:text-sm"
                    value={endYear}
                    onChange={e => setEndYear(e.target.value)}
                    style={{ backgroundColor: '#181824', color: '#f1f5f9' }}
                  >
                    {endYearsList.map(ey => (
                      <option key={ey} value={ey} style={{ backgroundColor: '#181824', color: '#f1f5f9' }}>
                        {ey} (Passout)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 text-center font-medium pt-1">
                Academic Batch: <span className="text-amber-400 font-bold">{startYear} – {endYear}</span> ({endYear - startYear} Year Degree Program)
              </div>
            </div>

            {/* Technical Skills Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary-400" />
                  Select Your Skills
                </h3>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {selectedSkills.length} Selected
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex overflow-x-auto gap-1.5 pb-2 custom-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === 'All'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  All Domains
                </button>
                {skillCategories.map(cat => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setActiveCategory(cat.category)}
                    className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat.category
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-3 p-1">
                {skillCategories
                  .filter(cat => activeCategory === 'All' || activeCategory === cat.category)
                  .map(cat => (
                    <div key={cat.category} className="space-y-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{cat.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map(skill => {
                          const isSelected = selectedSkills.includes(skill)
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-primary-600/30 border-primary-400 text-primary-300 shadow-md shadow-primary-500/20 scale-105'
                                  : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:text-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary-400" />}
                              <span>{skill}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Custom Skill Input */}
              <div className="pt-3 border-t border-white/10">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Don't see your skill? Add Custom Skill:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={e => setCustomSkillInput(e.target.value)}
                    placeholder="e.g. Solana, PySpark, Figma, Swift UI..."
                    className="input flex-1 text-xs sm:text-sm"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddCustomSkill(e) }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="btn-secondary text-xs px-4 py-2 flex items-center gap-1 font-semibold rounded-xl"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              {/* Selected Pills Display */}
              {selectedSkills.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-gray-400 mb-1.5">Your Selected Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="hover:text-red-400 transition-colors ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-sm sm:text-base font-bold shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 rounded-xl"
            >
              {isLoading ? 'Saving Your Profile...' : 'Complete Profile & Get Started →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
