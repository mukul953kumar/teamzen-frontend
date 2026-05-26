import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import {
  Users,
  Search,
  MessageCircle,
  Trophy,
  ArrowRight,
  Star,
  Code,
  Briefcase,
  GraduationCap,
  Zap,
  Rocket,
  CheckCircle,
  ChevronDown,
  Github,
  Linkedin,
  Target,
  Network,
  Sparkles
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
}

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(null)

  const features = [
    {
      icon: Users,
      title: 'Skill-Based Matching',
      description: 'Find teammates whose skills complement yours — not just random connections.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Smart Filters',
      description: 'Filter by college, branch, year, and tech stack to find exactly who you need.',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: MessageCircle,
      title: 'Built-in Chat',
      description: 'Team chat and private messaging — no need for external tools.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Trophy,
      title: 'Showcase Work',
      description: 'Add projects, hackathon wins, and certifications to your profile.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '10K+', icon: Users },
    { label: 'Teams Formed', value: '2.5K+', icon: Network },
    { label: 'Projects Built', value: '1.8K+', icon: Target },
    { label: 'Success Rate', value: '95%', icon: Trophy }
  ]

  const steps = [
    {
      step: '01',
      title: 'Build Your Profile',
      description: 'Add your skills, projects, college info, and what kind of team you are looking for.',
      icon: Sparkles,
      color: 'from-blue-500 to-violet-500'
    },
    {
      step: '02',
      title: 'Find Your Match',
      description: 'Browse students filtered by skills, branch, and year. See match percentage instantly.',
      icon: Search,
      color: 'from-violet-500 to-pink-500'
    },
    {
      step: '03',
      title: 'Build Together',
      description: 'Create a team, invite members, chat, and ship your project.',
      icon: Rocket,
      color: 'from-pink-500 to-orange-500'
    }
  ]

  const forWho = [
    {
      icon: GraduationCap,
      title: 'Final Year Students',
      description: 'Find the right people for your major project before deadlines hit.',
      tag: '5000+ Active'
    },
    {
      icon: Code,
      title: 'Hackathon Teams',
      description: 'Build a balanced team fast — frontend, backend, ML, design — all in one place.',
      tag: '200+ Teams/Month'
    },
    {
      icon: Briefcase,
      title: 'Startup Builders',
      description: 'Looking for a co-founder or early team? Find driven students here.',
      tag: '150+ Projects/Week'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'CSE, IIT Delhi',
      initial: 'P',
      color: 'from-pink-500 to-rose-500',
      content: 'Found my final year project team in 2 days. We ended up winning the departmental showcase.',
      project: 'HealthAI App'
    },
    {
      name: 'Mukul Kumar',
      role: 'CSE, KNIT Sultanpur',
      initial: 'M',
      color: 'from-blue-500 to-cyan-500',
      content: 'Built my SIH team through TeamZen. The skill filter saved hours of searching in random WhatsApp groups.',
      project: 'Smart Agriculture System'
    },
    {
      name: 'Ananya Patel',
      role: 'ECE, BITS Pilani',
      initial: 'A',
      color: 'from-violet-500 to-purple-500',
      content: 'The match percentage actually works. My team had zero skill overlap — everyone brought something different.',
      project: 'IoT Smart Home'
    }
  ]

  return (
    <div style={{ backgroundColor: '#0f0f0f' }}>

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url("/images/image1.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)' }} />

        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-orange-500/30 bg-orange-500/10">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-medium">For BTech Students</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Find teammates</span>
                <br />
                <span className="text-sunset">who actually</span>
                <br />
                <span className="text-white">show up.</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
                TeamZen connects BTech students for hackathons, final year projects, and startup ideas — based on real skills, not just who you know.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-sunset inline-flex items-center justify-center gap-2 text-base">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
                  Already have an account?
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {['P','R','A','M','S'].map((letter, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ['#FF6B35','#00A896','#9D4EDD','#FF6B9D','#52B788'][i] }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-semibold">500+</span> students joined this week
                </p>
              </div>
            </motion.div>

            {/* Right — Feature cards */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, label: 'Skill Matching', sub: 'Find by tech stack', color: 'text-blue-400' },
                { icon: MessageCircle, label: 'Team Chat', sub: 'Built-in messaging', color: 'text-emerald-400' },
                { icon: Trophy, label: 'Achievements', sub: 'Showcase your wins', color: 'text-orange-400' },
                { icon: Search, label: 'Smart Search', sub: 'Filter by college', color: 'text-violet-400' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={i + 3}
                    className="glass-3d rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <Icon className={`w-7 h-7 ${item.color} mb-3`} />
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 border-y border-white/5" style={{ background: '#111' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-orange-400 mx-auto mb-3" />
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        className="py-24 relative"
        style={{
          backgroundImage: 'url("/images/image2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-orange-400 font-semibold mb-3 uppercase tracking-widest text-sm">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white max-w-xl">
              Everything you need to build a great team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  onHoverStart={() => setActiveFeature(i)}
                  onHoverEnd={() => setActiveFeature(null)}
                  className={`glass-3d rounded-2xl p-6 border transition-all duration-300 cursor-default ${
                    activeFeature === i ? 'border-orange-400/40 scale-105' : 'border-white/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24" style={{ background: '#111' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-semibold mb-3 uppercase tracking-widest text-sm">Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">How it works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

            {steps.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass-3d rounded-2xl p-8 border border-white/10 hover:border-orange-400/30 transition-all relative"
                >
                  <span className="text-5xl font-black text-white/5 absolute top-4 right-6 select-none">{item.step}</span>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section
        className="py-24 relative"
        style={{
          backgroundImage: 'url("/images/image3.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.80)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-semibold mb-3 uppercase tracking-widest text-sm">Who is it for</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Built for every kind of builder</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {forWho.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass-3d rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.description}</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/15 text-orange-400 text-xs font-semibold rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {item.tag}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24" style={{ background: '#111' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-400 font-semibold mb-3 uppercase tracking-widest text-sm">Stories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What students say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="glass-3d rounded-2xl p-7 border border-white/10 hover:border-white/20 transition-all flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                  <span className="ml-auto text-xs text-orange-400 font-medium">{t.project}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative"
        style={{
          backgroundImage: 'url("/images/image2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.80)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stop looking in<br />
              <span className="text-sunset">WhatsApp groups.</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Your next teammate is already on TeamZen. Find them today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-sunset inline-flex items-center justify-center gap-2 text-base">
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
