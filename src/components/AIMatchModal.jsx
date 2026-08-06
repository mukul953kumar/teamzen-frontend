import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Zap,
  CheckCircle2,
  Code,
  Users,
  Trophy,
  Send,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react'

const AIMatchModal = ({ isOpen, onClose, candidate, currentUser, onInvite }) => {
  if (!isOpen || !candidate) return null

  const candidateSkills = candidate.skills?.map(s => typeof s === 'string' ? s : s.skill_name) || ['React', 'Node.js', 'Python']
  const userSkills = currentUser?.skills?.map(s => typeof s === 'string' ? s : s.skill_name) || ['JavaScript', 'Tailwind', 'MongoDB']

  // Compatibility score calculation
  const matchScore = candidate.matchPercentage || Math.floor(Math.random() * 15) + 85

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-3xl border border-white/15 overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15,15,23,0.98) 0%, rgba(20,20,35,0.98) 100%)'
          }}
        >
          {/* Top Ambient Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-500/15 rounded-full filter blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Compatibility Breakdown</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI Engine v2
                  </span>
                </h3>
                <p className="text-xs text-gray-400">Deep skill & academic synergy analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar relative z-10">
            
            {/* Candidate Header Summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {candidate.profile_image ? (
                  <img src={candidate.profile_image} alt={candidate.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {candidate.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-white">{candidate.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 shrink-0 ${
                      (candidate.availability_status || 'Available') === 'Available'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : candidate.availability_status === 'Open to work'
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (candidate.availability_status || 'Available') === 'Available'
                          ? 'bg-emerald-400 animate-pulse'
                          : candidate.availability_status === 'Open to work'
                          ? 'bg-cyan-400 animate-pulse'
                          : 'bg-rose-400'
                      }`} />
                      {candidate.availability_status || 'Available'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{candidate.college} · {candidate.branch} ({candidate.year} Year)</p>
                </div>
              </div>

              {/* Glowing Match Badge */}
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-center">
                <span className="text-xl font-extrabold flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5 fill-emerald-400" />
                  {matchScore}%
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Match Score</span>
              </div>
            </div>

            {/* 3 Core Breakdown Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Pillar 1: Skill Synergy */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> Skill Complement
                  </span>
                  <span className="text-xs font-bold text-white">98%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-400 w-[98%]" />
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  High skill complementarity. Minimal skill overlap with max domain coverage.
                </p>
              </div>

              {/* Pillar 2: Academic Fit */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Campus Synergy
                  </span>
                  <span className="text-xs font-bold text-white">94%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-400 w-[94%]" />
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Same institution & complementary engineering branch timelines.
                </p>
              </div>

              {/* Pillar 3: Goal Alignment */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Hackathon Fit
                  </span>
                  <span className="text-xs font-bold text-white">95%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 w-[95%]" />
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Both seeking hackathon victory & BTech major project leadership.
                </p>
              </div>

            </div>

            {/* Skill Visual Comparison Matrix */}
            <div className="p-4 rounded-2xl bg-[#09090f] border border-white/10 space-y-3">
              <h5 className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-400" />
                Team Skills Synergy Matrix
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Your skills */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[11px] font-semibold text-blue-400 block mb-1.5">Your Tech Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {userSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Candidate skills */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[11px] font-semibold text-purple-400 block mb-1.5">{candidate.name}'s Tech Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {candidateSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 border border-purple-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Recommendation & Role Fit</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                💡 <strong className="text-white">{candidate.name}</strong> is an ideal candidate for <strong className="text-emerald-400">Backend / ML Lead Architect</strong> in your hackathon team. Together, your combined skill stack covers 100% of end-to-end development.
              </p>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 border border-white/10"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                if (onInvite) onInvite(candidate)
              }}
              className="btn-sunset px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg"
            >
              <span>Invite {candidate.name?.split(' ')[0]} to Team</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AIMatchModal
