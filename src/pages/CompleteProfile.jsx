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

import { getStartYearOptions, getEndYearOptions } from '../utils/academicUtils'

const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
const years = [1, 2, 3, 4]

const startYearsList = getStartYearOptions()
const endYearsList = getEndYearOptions()

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
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 bg-[#09090e] relative overflow-hidden"
    >
      {/* Ambient Lighting Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl my-auto">
        <div className="card border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 bg-[#0d0d14]/90 backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 border border-white/15 mb-1">
              <img src="/images/TeamZen.png" alt="TeamZen" className="h-10 w-auto" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
              Complete Your Profile <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Welcome, <span className="font-bold text-orange-400">{user?.name}</span>! Tell us about your branch, session, and skills to connect with ideal teammates.
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
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>
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
                  >
                    {years.map(y => (
                      <option key={y} value={y}>
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
                  >
                    {startYearsList.map(sy => (
                      <option key={sy} value={sy}>{sy}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Passing Year (Batch End)
                  </label>
                  <select
                    className="input w-full text-xs sm:text-sm"
                    value={endYear}
                    onChange={e => setEndYear(e.target.value)}
                  >
                    {endYearsList.map(ey => (
                      <option key={ey} value={ey}>{ey}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-400" /> Select Technical Skills
                </h3>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                  {selectedSkills.length} Selected
                </span>
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  placeholder="Type a custom skill (e.g. Next.js, Rust)..."
                  className="input flex-1 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="btn-secondary text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Skill Categories */}
              <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar p-1">
                {skillCategories.map(group => (
                  <div key={group.category} className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400">{group.category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map(skill => {
                        const isSelected = selectedSkills.includes(skill)
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span>{skill}</span>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-sunset w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-transform"
            >
              {isLoading ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <span>Complete Profile & Launch Dashboard</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
