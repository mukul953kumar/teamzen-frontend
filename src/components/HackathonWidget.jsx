import React from 'react'
import { useQuery } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Rocket, Trophy, ExternalLink, Users, ChevronRight, Clock } from 'lucide-react'
import api from '../services/authAPI'

const HackathonWidget = () => {
  const navigate = useNavigate()

  const { data: hackathonData, isLoading } = useQuery(
    'dashboardHackathons',
    async () => {
      const response = await api.get('/hackathons/upcoming?featured=true&limit=3')
      return response.data.data
    },
    { refetchInterval: 120000 }
  )

  const hackathons = hackathonData?.hackathons || []

  if (isLoading || hackathons.length === 0) return null

  return (
    <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950/90 shadow-2xl space-y-4 font-mono text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Student Hackathons</h2>
            <p className="text-[11px] text-slate-400">SIH 2026, Flipkart GRiD, Google Solution Challenge</p>
          </div>
        </div>

        <Link
          to="/hackathons"
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {hackathons.map((h) => (
          <div
            key={h._id}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800 truncate max-w-[120px]">
                  🏛️ {h.organizer}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                  🏆 {h.prize_pool || 'Prizes'}
                </span>
              </div>

              <h3 className="text-xs font-bold text-white leading-snug line-clamp-1">
                {h.title}
              </h3>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {h.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <a
                href={h.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-bold flex items-center gap-1 shrink-0"
              >
                <span>Apply</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => navigate(`/teammate-finder?search=${encodeURIComponent(h.title)}`)}
                className="flex-1 px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded font-bold flex items-center justify-center gap-1 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Users className="w-3 h-3" />
                <span>Find Teammates</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HackathonWidget
