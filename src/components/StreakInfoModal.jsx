import React from 'react'
import { Flame, Zap, Trophy, ShieldCheck, Rocket, X, Sparkles } from 'lucide-react'

const StreakInfoModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null

  const streak = user?.loginStreak || 1
  const points = user?.zenPoints || 10

  const getLevel = (pts) => {
    if (pts >= 300) return { title: 'Zen Master 👑', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }
    if (pts >= 100) return { title: 'Active Dev 💎', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)' }
    return { title: 'Explorer 🟢', color: '#4ade80', bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)' }
  }

  const currentLevel = getLevel(points)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Scrollable Container */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto card p-5 sm:p-6 border border-white/15 shadow-2xl custom-scrollbar">
        {/* Ambient Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Daily Streak & Zen Points
              </h2>
              <p className="text-xs text-gray-400">TeamZen Daily Rewards & Student Benefits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Stats Box */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-orange-400 border border-orange-500/30">
              <Flame className="w-4 h-4 fill-orange-400" /> {streak} Day Streak
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-4 h-4 text-blue-400" /> {points} Points
            </span>
          </div>

          <span
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{ color: currentLevel.color, background: currentLevel.bg, borderColor: currentLevel.border }}
          >
            {currentLevel.title}
          </span>
        </div>

        {/* Benefits List in Clean English */}
        <div className="space-y-3.5 mb-6 text-xs sm:text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Why earn Zen Points & Maintain Daily Streaks?
          </h3>

          {/* Benefit 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">1. Teammate Finder Search Priority 🚀</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Students with high Zen Points and active streaks are featured at the **top of the Teammate Finder search results**, helping team leaders discover and invite you first.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">2. Trust Score & Verified Level Badges 💎</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Unlock prestigious profile badges like **"Zen Master"** and **"Active Dev"**. This proves to team leaders that you are a dedicated, reliable, and active collaborator.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">3. Daily +10 Zen Points & Streak Bonus ⚡</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Earn **+10 Zen Points** every day you visit TeamZen. Keep your streak alive on consecutive days—missing a day will reset your streak counter back to 1!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="btn-primary w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Got it! Let's Build Teams 🚀</span>
        </button>
      </div>
    </div>
  )
}

export default StreakInfoModal
