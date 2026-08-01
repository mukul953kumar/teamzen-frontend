import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
import InteractiveDemo from '../components/InteractiveDemo'
import { API_BASE_URL } from '../config/api'
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
  Target,
  Network,
  Sparkles,
  Wifi,
  Menu,
  X,
  HelpCircle
} from 'lucide-react'

// ── Smooth Animated Counter Component ──
const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime = null
          const duration = 2000 // 2s smooth counting animation

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            // Ease-out exponential for smooth decelerating counter motion
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const currentVal = Math.floor(easeOutExpo * target)
            setCount(currentVal)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.15 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, hasAnimated])

  const formatValue = (num) => {
    if (target >= 10000) {
      const kVal = (num / 1000).toFixed(num >= 10000 ? 0 : 1)
      return `${prefix}${kVal}K${suffix}`
    }
    if (target >= 1000) {
      const kVal = (num / 1000).toFixed(1)
      return `${prefix}${num < 1000 ? num : kVal + 'K'}${suffix}`
    }
    return `${prefix}${num}${suffix}`
  }

  return (
    <span ref={ref} className="inline-block tabular-nums font-black">
      {formatValue(count)}
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
}

const words = ['hackathons', 'final year projects', 'startup ideas', 'open source']

const avatarColors = ['#FF6B35','#9D4EDD','#00A896','#FF6B9D','#52B788','#F7931E','#60a5fa','#a78bfa']

const staticEvents = [
  { avatar: 'A', color: '#FF6B35', name: 'Aryan S.', action: 'joined TeamZen', tag: 'React · Node.js', time: 'just now' },
  { avatar: 'P', color: '#9D4EDD', name: 'Priya M.', action: 'joined TeamZen', tag: 'ML · Python', time: '2m ago' },
  { avatar: 'R', color: '#00A896', name: 'Rohan V.', action: 'joined TeamZen', tag: 'IoT · Arduino', time: '5m ago' },
  { avatar: 'S', color: '#FF6B9D', name: 'Sneha T.', action: 'joined TeamZen', tag: 'UI/UX · Figma', time: '9m ago' },
  { avatar: 'K', color: '#52B788', name: 'Karan D.', action: 'joined TeamZen', tag: 'Flutter · Firebase', time: '14m ago' },
  { avatar: 'M', color: '#F7931E', name: 'Meera J.', action: 'joined TeamZen', tag: 'Python · FastAPI', time: '20m ago' },
]

const floatingSkills = [
  'React', 'Node.js', 'Python', 'Flutter', 'ML', 'UI/UX',
  'MongoDB', 'AWS', 'Docker', 'TypeScript', 'Figma', 'IoT'
]

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(null)
  const [wordIndex, setWordIndex] = useState(0)
  const [allEvents, setAllEvents] = useState(staticEvents)
  const [visibleEvents, setVisibleEvents] = useState(staticEvents.slice(0, 4))
  const [eventIndex, setEventIndex] = useState(4)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const faqs = [
    {
      q: 'How does skill-based teammate matching work?',
      a: 'TeamZen compares your target project skills, branch, and experience level with other students to highlight profiles with complementary tech stacks and zero skill overlap.'
    },
    {
      q: 'Is TeamZen completely free for college students?',
      a: 'Yes, 100%! TeamZen is free for BTech and college students to search candidates, create team listings, chat, and showcase achievements.'
    },
    {
      q: 'Can I find teammates outside my branch or college?',
      a: 'Absolutely. You can filter by specific branch (IT, CS, ECE, ME, etc.), year of study, or search broadly across colleges for cross-functional teams.'
    },
    {
      q: 'How do I build a team for hackathons like SIH?',
      a: 'You can create a project requirement post, specify roles (e.g. 1 ML engineer, 1 React dev, 1 UI/UX designer), and invite matching applicants in 1 click.'
    },
    {
      q: 'Is there a built-in messaging system?',
      a: 'Yes! TeamZen features built-in direct messaging and team group chats so you can discuss project details without sharing personal phone numbers.'
    }
  ]

  useEffect(() => {
    const t = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  // Fetch real recent joins (public endpoint, no auth)
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/recent-joins`)
        const json = await res.json()
        if (json.success && json.data.length > 0) {
          const mapped = json.data.map((u, i) => ({
            avatar: u.displayName[0].toUpperCase(),
            color: avatarColors[i % avatarColors.length],
            name: u.displayName,
            action: 'joined TeamZen',
            tag: u.skills.length ? u.skills.join(' · ') : u.branch,
            time: u.timeAgo
          }))
          setAllEvents(mapped)
          setVisibleEvents(mapped.slice(0, 4))
          setEventIndex(4)
        }
      } catch (_) { /* keep static fallback */ }
    }
    fetchRecent()
    const poll = setInterval(fetchRecent, 30000)
    return () => clearInterval(poll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setVisibleEvents(prev => {
        const next = allEvents[eventIndex % allEvents.length]
        return [next, ...prev.slice(0, 3)]
      })
      setEventIndex(i => i + 1)
    }, 2800)
    return () => clearInterval(t)
  }, [eventIndex, allEvents])

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
    { label: 'Active Students', target: 10000, suffix: '+', icon: Users },
    { label: 'Teams Formed', target: 2500, suffix: '+', icon: Network },
    { label: 'Projects Built', target: 1800, suffix: '+', icon: Target },
    { label: 'Success Rate', target: 95, suffix: '%', icon: Trophy }
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
      name: 'Mukul Kumar',
      role: 'IT, KNIT Sultanpur',
      initial: 'P',
      color: 'from-pink-500 to-rose-500',
      content: 'Found my final year project team in 2 days. We ended up winning the departmental showcase.',
      project: 'HealthAI App'
    },
    {
      name: 'Garv Rajora',
      role: 'IT, KNIT Sultanpur',
      initial: 'M',
      color: 'from-blue-500 to-cyan-500',
      content: 'Built my SIH team through TeamZen. The skill filter saved hours of searching in random WhatsApp groups.',
      project: 'Smart Agriculture System'
    },
    {
      name: 'Ashish Pratap',
      role: 'IT, KNIT Sultanpur',
      initial: 'A',
      color: 'from-violet-500 to-purple-500',
      content: 'The match percentage actually works. My team had zero skill overlap — everyone brought something different.',
      project: 'IoT Smart Home'
    }
  ]

  return (
    <div style={{ backgroundColor: '#0a0a0f' }}>

      {/* ── TOP NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(10, 10, 15, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/images/logo26.png" alt="TeamZen" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#who-its-for" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Who It's For</a>
            <a href="#stories" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Stories</a>
            <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="btn-sunset text-xs px-5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
              <span>Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 px-6 py-6 flex flex-col gap-4"
              style={{ background: '#0a0a0f' }}
            >
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white py-1">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white py-1">How It Works</a>
              <a href="#who-its-for" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white py-1">Who It's For</a>
              <a href="#stories" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white py-1">Stories</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-300 hover:text-white py-1">FAQ</a>
              
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-sunset w-full text-center py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Deep bg */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,107,53,0.1) 0%, transparent 60%), #0a0a0f' }} />

        {/* Floating skill tags */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingSkills.map((skill, i) => (
            <div
              key={skill}
              className="absolute text-xs font-medium px-3 py-1 rounded-full border"
              style={{
                left: `${8 + (i * 7.5) % 84}%`,
                bottom: '-2rem',
                color: 'rgba(255,255,255,0.25)',
                borderColor: 'rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                animation: `floatUp ${10 + (i * 1.7) % 8}s linear ${(i * 1.3) % 6}s infinite`
              }}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — Text */}
            <motion.div variants={fadeUp} initial="hidden" animate="show">

              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-green-500/25 bg-green-500/8"
                style={{ background: 'rgba(52,211,153,0.07)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm font-medium">247 students active right now</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Find teammates</span>
                <br />
                <span className="text-white">for </span>
                <span className="relative inline-block" style={{ minWidth: '280px' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35 }}
                      className="text-sunset inline-block"
                    >
                      {words[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                TeamZen matches BTech students by real skills — not random WhatsApp groups. Build your team in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/login" className="btn-sunset inline-flex items-center justify-center gap-2 text-xs sm:text-base px-4 py-2.5 sm:px-6 sm:py-3">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  See how it works
                </a>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {['A','P','R','M','S'].map((letter, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ['#FF6B35','#9D4EDD','#00A896','#FF6B9D','#52B788'][i], borderColor: '#0a0a0f' }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm">
                  <span className="text-white font-semibold">500+</span> students joined this week
                </p>
              </div>
            </motion.div>

            {/* Right — Live Activity Feed */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="flex flex-col gap-3">

              {/* Feed header */}
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">Live Activity</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>

              {/* Feed cards */}
              <div className="relative overflow-hidden" style={{ height: '280px' }}>
                <AnimatePresence initial={false}>
                  {visibleEvents.map((event, i) => (
                    <motion.div
                      key={`${event.name}-${event.time}-${i}`}
                      initial={{ opacity: 0, y: -40, scale: 0.96 }}
                      animate={{ opacity: 1 - i * 0.18, y: i * 84, scale: 1 - i * 0.02 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute left-0 right-0 flex items-center gap-3 px-4 py-3 rounded-2xl border"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        borderColor: i === 0 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)',
                        boxShadow: i === 0 ? '0 0 20px rgba(139,92,246,0.08)' : 'none'
                      }}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: event.color }}>
                        {event.avatar}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white leading-tight">
                          <span className="font-semibold">{event.name}</span>
                          <span className="text-gray-400"> {event.action}</span>
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {event.tag}
                        </span>
                      </div>
                      {/* Time */}
                      <span className="text-xs text-gray-600 flex-shrink-0">{event.time}</span>
                      {/* New indicator */}
                      {i === 0 && <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bottom stat strip */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl mt-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Teams today', target: 38 },
                  { label: 'Matches made', target: 124 },
                  { label: 'Online now', target: 247 },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-white font-bold text-lg">
                      <AnimatedCounter target={s.target} />
                    </p>
                    <p className="text-gray-600 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </div>
      </section>

      {/* ── INTERACTIVE PRODUCT PREVIEW (Hero Follow-up) ── */}
      <InteractiveDemo />

      {/* ── STATS ── */}
      <section className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d14 50%, #0a0a0f 100%)' }}>

        {/* Glowing center line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(255,107,53,0.3), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.4), transparent)' }} />

        {/* Ambient blobs */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem', overflow: 'hidden' }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon
              const colors = ['#a78bfa', '#60a5fa', '#34d399', '#fb923c']
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex flex-col items-center justify-center py-10 px-6 text-center group hover:bg-white/[0.02] transition-colors"
                  style={{ background: '#0d0d14' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${colors[i]}18`, border: `1px solid ${colors[i]}30` }}>
                    <Icon className="w-6 h-6" style={{ color: colors[i] }} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative py-24 overflow-hidden" style={{ background: '#0a0a0f' }}>

        {/* Mesh gradient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(255,107,53,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white max-w-xl leading-tight">
              Everything you need to<br />
              <span className="text-sunset">build a great team</span>
            </h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Big card — Skill Matching */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              className="lg:col-span-2 relative rounded-3xl p-8 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-3">Skill-Based Matching</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">Find teammates whose skills complement yours — not just random connections. See match percentage instantly.</p>
                {/* Skill pills demo */}
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'MongoDB', 'ML', 'Flutter'].map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Small card — Smart Filters */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="relative rounded-3xl p-7 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.1) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Smart Filters</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Filter by college, branch, year, and tech stack to find exactly who you need.</p>
              </div>
            </motion.div>

            {/* Small card — Built-in Chat */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
              className="relative rounded-3xl p-7 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(52,211,153,0.1) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Built-in Chat</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Team chat and private messaging — no need for external tools.</p>
              </div>
            </motion.div>

            {/* Big card — Showcase */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}
              className="lg:col-span-2 relative rounded-3xl p-8 overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(251,146,60,0.08) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.4), transparent)' }} />
              <div className="relative z-10 flex items-start justify-between gap-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-3">Showcase Your Work</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">Add projects, hackathon wins, and certifications to your profile. Let your work speak louder than your resume.</p>
                </div>
                {/* Trophy badges demo */}
                <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                  {['🏆 SIH Winner', '🥈 HackFest 2nd', '⭐ Top Contributor'].map((b, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap"
                      style={{ background: 'rgba(251,146,60,0.1)', color: '#fdba74', border: '1px solid rgba(251,146,60,0.2)' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative py-24 overflow-hidden" style={{ background: '#0d0d14' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.3), transparent)' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">How it works</h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[52px] left-[20%] right-[20%] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(255,107,53,0.5))' }} />
            {/* Connector dots */}
            <div className="hidden md:block absolute top-[48px] left-[20%] w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
            <div className="hidden md:block absolute top-[48px] right-[20%] w-2 h-2 rounded-full" style={{ background: '#f97316' }} />

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((item, i) => {
                const Icon = item.icon
                const borderColors = ['rgba(99,102,241,0.25)', 'rgba(168,85,247,0.25)', 'rgba(249,115,22,0.25)']
                const glowColors = ['rgba(99,102,241,0.08)', 'rgba(168,85,247,0.08)', 'rgba(249,115,22,0.08)']
                return (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                    className="relative rounded-3xl p-8 overflow-hidden group"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColors[i]}` }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${glowColors[i]} 0%, transparent 70%)` }} />
                    {/* Step number watermark */}
                    <span className="absolute top-4 right-6 text-6xl font-black select-none"
                      style={{ color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{item.step}</span>
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section id="who-its-for" className="relative py-24 overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#fb923c' }}>Who is it for</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Built for every kind of builder</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {forWho.map((item, i) => {
              const Icon = item.icon
              const accents = [
                { grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.2)', shimmer: 'rgba(99,102,241,0.4)' },
                { grad: 'linear-gradient(135deg,#f97316,#ef4444)', glow: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.2)', shimmer: 'rgba(249,115,22,0.4)' },
                { grad: 'linear-gradient(135deg,#059669,#34d399)', glow: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)', shimmer: 'rgba(52,211,153,0.4)' },
              ][i]
              return (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className="relative rounded-3xl p-8 overflow-hidden group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accents.border}` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 30% 30%, ${accents.glow} 0%, transparent 60%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${accents.shimmer}, transparent)` }} />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: accents.grad }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{item.description}</p>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: `${accents.glow}`, color: 'rgba(255,255,255,0.7)', border: `1px solid ${accents.border}` }}>
                      <CheckCircle className="w-3 h-3" />{item.tag}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="stories" className="relative py-24 overflow-hidden" style={{ background: '#0d0d14' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Stories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What students say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="relative rounded-3xl p-7 overflow-hidden group flex flex-col"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 60%)' }} />
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{t.content}"</p>
                  {/* Project tag */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-5 self-start"
                    style={{ background: 'rgba(251,146,60,0.1)', color: '#fdba74', border: '1px solid rgba(251,146,60,0.2)' }}>
                    <Rocket className="w-3 h-3" />{t.project}
                  </span>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-24 overflow-hidden" style={{ background: '#0a0a0f' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)' }} />
        
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-purple-500/20"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#a78bfa' }}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              Everything you need to know about finding your project teammates and using TeamZen.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={index}
                  className="rounded-2xl border transition-all duration-300 overflow-hidden"
                  style={{
                    background: isOpen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: isOpen ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.07)',
                    boxShadow: isOpen ? '0 4px 20px rgba(139, 92, 246, 0.08)' : 'none'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-white font-semibold text-base md:text-lg">
                      {faq.q}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                      style={{
                        background: isOpen ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isOpen ? '#a78bfa' : '#9ca3af',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-gray-300 text-sm md:text-base leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 overflow-hidden" style={{ background: '#0a0a0f' }}>
        {/* Glowing orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,107,53,0.08) 40%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(255,107,53,0.3), transparent)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-purple-500/25"
              style={{ background: 'rgba(139,92,246,0.08)' }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Join 10,000+ students</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stop searching in<br />
              <span className="text-sunset">WhatsApp groups.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Your next teammate is already on TeamZen. Find them in minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/login" className="btn-sunset inline-flex items-center justify-center gap-2 text-xs sm:text-base px-4 py-2.5 sm:px-6 sm:py-3">
                <span>Start Building Your Team</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <a href="#features"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                Explore Features
              </a>
            </div>
            {/* Trust line */}
            <p className="text-gray-500 text-xs sm:text-sm mt-8 leading-relaxed">
              Free forever · Built for BTech students · By using TeamZen, you agree to all <span className="text-gray-300 font-medium">Terms & Privacy Policy</span> conditions (Zero Tolerance for Spam & Illegal Activity).
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
