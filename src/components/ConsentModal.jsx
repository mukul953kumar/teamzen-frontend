import React, { useState } from 'react'
import { ShieldAlert, CheckSquare, Square, ArrowRight, Lock, AlertOctagon } from 'lucide-react'

const ConsentModal = ({ isOpen, onAccept, onOpenFullTerms }) => {
  const [hasAgreed, setHasAgreed] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl p-6 space-y-6 overflow-hidden"
        style={{
          background: '#0d0d14',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.15)'
        }}>

        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center flex-shrink-0 border border-red-500/30">
            <AlertOctagon className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-snug">
              TeamZen Community Terms & Safety Consent
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Mandatory platform guidelines before proceeding to Login
            </p>
          </div>
        </div>

        {/* Mandatory Warning Box */}
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Strict Zero Tolerance Policy</span>
          </div>
          <p className="text-xs text-red-200 leading-relaxed">
            If you engage in any <strong className="text-white">spam, harassment, abusive/illegal chat, fraud, or unlawful activity</strong>, your account will be <strong>PERMANENTLY DELETED</strong> without warning.
          </p>
        </div>

        {/* Key Conditions */}
        <div className="space-y-2 text-xs text-gray-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
            <p>
              By accessing or using this website, you <strong className="text-white">accept and agree</strong> to all platform terms and rules.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
            <p>
              No spamming, offensive messages, or inappropriate links allowed in chats, teams, or project listings.
            </p>
          </div>
        </div>

        {/* Checkbox agreement */}
        <button
          type="button"
          onClick={() => setHasAgreed(!hasAgreed)}
          className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left w-full cursor-pointer"
        >
          <div className="mt-0.5 text-orange-400 flex-shrink-0">
            {hasAgreed ? (
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            ) : (
              <Square className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <span className="text-xs text-gray-300 leading-relaxed">
            I agree to TeamZen Terms & Privacy Policy and understand that any spam or illegal chat will result in <strong className="text-red-400">immediate permanent account deletion</strong>.
          </span>
        </button>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            disabled={!hasAgreed}
            onClick={onAccept}
            className="btn-sunset w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Accept & Proceed to Google Sign-In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenFullTerms}
            className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            Read Full Terms & Privacy Policy
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConsentModal
