import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import api from '../services/authAPI'
import toast from 'react-hot-toast'

const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Other']
const years = [1, 2, 3, 4]
const commonSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'MongoDB',
  'MySQL', 'Machine Learning', 'Data Science', 'UI/UX', 'Flutter',
  'Blockchain', 'IoT', 'AWS', 'Docker', 'Git', 'TypeScript', 'Express.js'
]

const CompleteProfile = () => {
  const { user, loginWithToken } = useAuth()
  const navigate = useNavigate()
  const [branch, setBranch] = useState('CSE')
  const [year, setYear] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/auth/complete-profile', { branch, year, skills: selectedSkills })
      toast.success('Profile completed!')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: 'url("/images/image3.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 0 }} />
      <div className="relative z-10 w-full max-w-lg">
        <div className="card">
          <div className="text-center mb-8">
            <img src="/images/TeamZen.png" alt="TeamZen" className="h-12 w-auto mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-gray-400 mt-1">Welcome, {user?.name}! Just a few more details.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                <select className="input w-full" value={branch} onChange={e => setBranch(e.target.value)}
                  style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                  {branches.map(b => <option key={b} value={b} style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <select className="input w-full" value={year} onChange={e => setYear(e.target.value)}
                  style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>
                  {years.map(y => <option key={y} value={y} style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Skills {selectedSkills.length > 0 && <span className="text-primary-400 ml-2 text-xs">{selectedSkills.length} selected</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selectedSkills.includes(skill)
                        ? 'bg-primary-600/30 border-primary-400 text-primary-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-4 disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Complete Profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile
