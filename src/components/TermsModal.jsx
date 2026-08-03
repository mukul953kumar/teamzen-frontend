import React, { useState } from 'react'
import { X, ShieldAlert, CheckCircle, Lock, AlertTriangle, FileText } from 'lucide-react'

const TermsModal = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{
          background: '#0d0d14',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center border border-orange-500/30">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Legal Terms & Community Safety</h2>
              <p className="text-xs text-gray-400">Please review TeamZen rules & conditions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-white/5">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'terms'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Terms of Service & Rules
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'privacy'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-sm leading-relaxed text-gray-300">
          
          {/* Important Mandatory Banner */}
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>⚠️ Strict Deletion Policy</span>
            </div>
            <p className="text-xs md:text-sm text-red-300 font-medium leading-relaxed">
              <strong>Mandatory Rule:</strong> Engaging in spam, harassment, abusive speech, illegal chat, or unauthorized unlawful activity will result in <span className="underline ml-1 font-bold text-white">PERMANENT ACCOUNT DELETION</span> without prior warning (Zero Tolerance Policy).
            </p>
          </div>

          {activeTab === 'terms' ? (
            <>
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  1. Acceptance of Terms & Conditions
                </h3>
                <p className="text-gray-400">
                  By accessing or using the TeamZen platform, you acknowledge and agree that you accept all platform rules, community safety guidelines, and privacy policies. If you do not agree with any part of these terms, you must discontinue using the website immediately.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  2. Zero Tolerance for Illegal Activity & Spam
                </h3>
                <p className="text-gray-400">
                  TeamZen is exclusively intended for academic, project, and hackathon collaboration among students. The following behaviors are strictly prohibited:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 pl-2">
                  <li>Any illegal chat, harassment, hate speech, or explicit/inappropriate content.</li>
                  <li>Spamming, unsolicited marketing, phishing links, or scam messages.</li>
                  <li>Falsifying student credentials or attempting unauthorized data access.</li>
                </ul>
                <p className="text-red-400 font-semibold pt-1">
                  Violation of any community rule will result in immediate and permanent account deletion.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  3. User Responsibility & Account Termination
                </h3>
                <p className="text-gray-400">
                  You are solely responsible for all activities and content sent through your account. TeamZen reserves the right to terminate accounts and report unlawful conduct to relevant authorities.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">1. Data Privacy & Protection</h3>
                <p className="text-gray-400">
                  TeamZen respects your data privacy. We only collect necessary profile information (Name, College, Branch, Skills) required for teammate matching and project collaboration.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">2. Communication Safety</h3>
                <p className="text-gray-400">
                  Chat interactions are safeguarded under platform guidelines to maintain a safe, respectful, and spam-free environment for students.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-white">3. Account & Data Removal</h3>
                <p className="text-gray-400">
                  When an account is deleted by a user or terminated due to policy violations, all associated messages, profile data, and team entries are permanently erased.
                </p>
              </section>
            </>
          )}

        </div>

        {/* Bottom Footer Action */}
        <div className="p-4 border-t border-white/10 flex justify-end bg-white/5">
          <button
            onClick={onClose}
            className="btn-sunset px-6 py-2 rounded-xl text-xs font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
