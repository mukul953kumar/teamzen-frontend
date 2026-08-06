import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import {
  Code2,
  Sparkles,
  Github,
  Mail,
  Linkedin,
  Rocket,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Heart,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Award,
  Users,
  Compass,
  ArrowLeft
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

const AboutFounder = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Who is the Founder of TeamZen? - Mukul Kumar | TeamZen"
  }, [])

  const founderSkills = [
    'Full Stack Web Development',
    'React.js & Node.js Architecture',
    'RESTful & GraphQL API Design',
    'MongoDB & Database Optimization',
    'UI/UX & Interactive Design',
    'System Scaling & Realtime Chat'
  ]

  const milestones = [
    {
      year: '2024 - 2025',
      title: 'Conceptualized TeamZen',
      desc: 'Identified the critical bottleneck engineering students face while forming balanced hackathon and major project teams.'
    },
    {
      year: '2025',
      title: 'Architected & Built TeamZen',
      desc: 'Engineered zero-overlap skill matching algorithm, real-time socket communication, and verified campus project showcases.'
    },
    {
      year: 'Present',
      title: 'Empowering 10,000+ Student Builders',
      desc: 'Leading continuous platform growth, campus partnerships, and AI-driven match features for BTech developers across India.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#08080c] text-white selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">

      {/* ── SEO Schema JSON-LD Script ── */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Mukul Kumar",
          "jobTitle": "Founder & Lead Architect",
          "worksFor": {
            "@type": "Organization",
            "name": "TeamZen",
            "url": "https://teamzenconnect.vercel.app/"
          },
          "alumniOf": "Kamla Nehru Institute of Technology (KNIT Sultanpur)",
          "email": "mukul.knit26@gmail.com",
          "sameAs": [
            "https://github.com/mukul953kumar"
          ],
          "description": "Mukul Kumar is the Founder and Lead Architect of TeamZen, an AI-powered BTech teammate & co-founder finder platform."
        })}
      </script>

      {/* ── HEADER NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080c]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo26.png"
              alt="TeamZen Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              onError={(e) => { e.target.src = '/images/TeamZen.png' }}
            />

          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/login"
              className="shimmer-btn text-xs sm:text-sm px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center gap-1.5"
            >
              <span>Join Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-20 overflow-hidden laser-border-top">
        <div className="absolute inset-0 tech-grid-bg pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, rgba(157,78,221,0.1) 50%, transparent 70%)', filter: 'blur(90px)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Official Founder Spotlight</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Who is the Founder of <br className="hidden sm:block" />
              <span className="gradient-accent-text">TeamZen?</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Meet <strong className="text-white font-bold">Mukul Kumar</strong> — the visionary developer and lead architect behind TeamZen. Dedicated to transforming how engineering students connect, collaborate, and ship tech innovations.
            </p>
          </motion.div>

          {/* Founder Profile Bento Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="bento-card rounded-3xl p-6 sm:p-10 border border-orange-500/20 shadow-2xl relative overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-center">

              {/* Left Column: Avatar / Badge */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-purple-600 p-1 shadow-2xl shadow-orange-500/20">
                    <div className="w-full h-full rounded-[22px] bg-[#0c0c14] flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
                      {/* Founder Photo */}
                      <img
                        src="/images/mukul2.png"
                        alt="Mukul Kumar - Founder of TeamZen"
                        className="w-full h-full object-cover rounded-[22px]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5" /> Founder & Architect
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Mukul Kumar</h2>
                <p className="text-orange-400 font-medium text-xs sm:text-sm mb-3 flex items-center justify-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-400" /> KNIT Sultanpur (BTech IT)
                </p>

                {/* Social Connect Buttons */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  <a
                    href="https://github.com/mukul953kumar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="mailto:mukul.knit26@gmail.com"
                    className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Bio Summary & Fast Facts */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-orange-400" />
                    About Mukul Kumar
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Mukul Kumar is the Founder of TeamZen and a B.Tech IT student at KNIT Sultanpur. After experiencing how difficult it was for students to find the right teammates for hackathons and major projects, he built TeamZen to make team formation faster, smarter, and more organized.
                    He enjoys building scalable web applications with modern technologies, focusing on clean architecture, real-time collaboration, and intuitive user experiences. <strong className="text-white">TeamZen</strong>.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Primary Role</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">Founder & Creator</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Institution</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">KNIT Sultanpur</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Flagship Venture</p>
                    <p className="text-sm font-extrabold text-orange-400 mt-0.5">TeamZen Platform</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Tech Focus</p>
                    <p className="text-sm font-extrabold text-purple-400 mt-0.5">Full Stack & Systems</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ── THE STORY BEHIND TEAMZEN ── */}
      <section className="relative py-20 border-t border-white/5 bg-[#0a0a12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-10 items-center">

            <div className="md:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10">
                The Founder's Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Why Mukul Built <span className="gradient-accent-text">TeamZen</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                During his time in engineering college, Mukul noticed a recurring problem: brilliant developers, UI/UX designers, and ML enthusiasts were constantly struggling to find complementary team members.
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Most students resorted to spamming WhatsApp groups or random college forums, ending up with teams of 4 frontend devs and 0 backend devs. Mukul created TeamZen to eliminate skill overlap and systematically pair students based on real complementary technical strengths.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Zero Skill Overlap: Automated matrix matching',
                  'Verified Campus Badges & GitHub Portfolios',
                  'Built-in Team Chat & Instant Invite Workflows'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="bento-card rounded-3xl p-6 border border-white/10 space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <Code2 className="w-5 h-5 text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Technical Expertise</span>
                </div>

                <div className="space-y-3">
                  {founderSkills.map((sk, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-200">{sk}</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MILESTONES & JOURNEY ── */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10">
              Evolution & Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              Building TeamZen Step-by-Step
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="bento-card rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between border border-white/10">
                <div>
                  <span className="text-xs font-extrabold text-orange-400 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 inline-block mb-4">
                    {m.year}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3">{m.title}</h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Phase 0{idx + 1}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER FAQ SECTION FOR GOOGLE SEARCH ── */}
      <section className="relative py-20 border-t border-white/5 bg-[#0a0a12]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10">
              Quick Reference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              Frequently Asked Founder Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bento-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                Who is the founder of TeamZen?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                <strong>Mukul Kumar</strong> is the Founder and Lead Architect of TeamZen. He is a Full-Stack developer and engineering student from KNIT Sultanpur who designed TeamZen to match BTech developers by complementary skills.
              </p>
            </div>

            <div className="bento-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                What is the mission of Mukul Kumar with TeamZen?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                The mission is to empower over 100,000+ engineering students to easily discover co-founders, hackathon teammates, and project contributors without relying on random WhatsApp messages or manual coordination.
              </p>
            </div>

            <div className="bento-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                How can I contact Mukul Kumar?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                You can reach Mukul Kumar directly via email at <a href="mailto:mukul.knit26@gmail.com" className="text-orange-400 underline font-semibold">mukul.knit26@gmail.com</a> or view his engineering repositories on <a href="https://github.com/mukul953kumar" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline font-semibold">GitHub (mukul953kumar)</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ── */}
      <section className="relative py-20 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Build your next squad with <span className="gradient-accent-text">TeamZen</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Created by Mukul Kumar for developers, designers, and campus innovators.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="shimmer-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25 text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}

export default AboutFounder
