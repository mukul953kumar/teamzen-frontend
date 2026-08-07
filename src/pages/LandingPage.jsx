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
  HelpCircle,
  Sliders,
  Check,
  ShieldCheck,
  Layers,
  Cpu,
  Flame
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
          const duration = 2000

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
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
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
  })
}

const words = ['Hackathons', 'Major Projects', 'AI Startups', 'Open Source']

const avatarColors = ['#FF6B35', '#9D4EDD', '#00A896', '#FF6B9D', '#52B788', '#F7931E', '#60a5fa', '#a78bfa']

const staticEvents = [
  { avatar: 'A', color: '#FF6B35', name: 'Aryan S.', action: 'joined TeamZen', tag: 'React · Node.js', time: 'just now' },
  { avatar: 'P', color: '#9D4EDD', name: 'Priya M.', action: 'joined TeamZen', tag: 'ML · Python', time: '2m ago' },
  { avatar: 'R', color: '#00A896', name: 'Rohan V.', action: 'joined TeamZen', tag: 'IoT · Arduino', time: '5m ago' },
  { avatar: 'S', color: '#FF6B9D', name: 'Sneha T.', action: 'joined TeamZen', tag: 'UI/UX · Figma', time: '9m ago' },
  { avatar: 'K', color: '#52B788', name: 'Karan D.', action: 'joined TeamZen', tag: 'Flutter · Firebase', time: '14m ago' },
  { avatar: 'M', color: '#F7931E', name: 'Meera J.', action: 'joined TeamZen', tag: 'Python · FastAPI', time: '20m ago' },
]

const sampleSkills = ['React', 'Node.js', 'Python', 'ML', 'UI/UX', 'Flutter', 'MongoDB', 'Docker']

const mockCandidates = [
  { name: 'Shivam R.', branch: 'IT · 4th Year', skills: ['React', 'Node.js', 'AWS'], match: 98, role: 'Full Stack Dev', avatar: 'S', statusTag: '⚡ Open for Teammates', campusTag: 'KNIT Sultanpur' },
  { name: 'Ananya S.', branch: 'CS · 3rd Year', skills: ['Python', 'ML', 'FastAPI'], match: 94, role: 'AI / ML Engineer', avatar: 'A', statusTag: '🚀 SIH 2026 Ready', campusTag: 'Campus Verified' },
  { name: 'Kavya M.', branch: 'ECE · 4th Year', skills: ['UI/UX', 'Figma', 'React'], match: 91, role: 'Product Designer', avatar: 'K', statusTag: '🎨 Design Lead', campusTag: 'KNIT Sultanpur' },
  { name: 'Rohan T.', branch: 'IT · 4th Year', skills: ['Flutter', 'Firebase', 'Dart'], match: 88, role: 'Mobile Dev', avatar: 'R', statusTag: '📱 Mobile Lead', campusTag: 'Campus Verified' },
  { name: 'Divya P.', branch: 'CSE · 3rd Year', skills: ['Node.js', 'MongoDB', 'Docker'], match: 95, role: 'Backend Engineer', avatar: 'D', statusTag: '🛡️ Backend Architect', campusTag: 'KNIT Sultanpur' },
  { name: 'Yash V.', branch: 'IT · 4th Year', skills: ['React', 'TypeScript', 'Tailwind'], match: 92, role: 'Frontend Engineer', avatar: 'Y', statusTag: '⭐ 100+ LeetCode Solved', campusTag: 'Campus Verified' },
  { name: 'Prateek K.', branch: 'ECE · 4th Year', skills: ['Python', 'PyTorch', 'OpenCV'], match: 89, role: 'Computer Vision Engineer', avatar: 'P', statusTag: '🤖 AI Researcher', campusTag: 'KNIT Sultanpur' },
  { name: 'Simran C.', branch: 'CSE · 2nd Year', skills: ['Figma', 'UI/UX', 'CSS'], match: 87, role: 'UI/UX Designer', avatar: 'S', statusTag: '✨ UI/UX Specialist', campusTag: 'Campus Verified' },
  { name: 'Varun N.', branch: 'MECH · 4th Year', skills: ['Python', 'Django', 'PostgreSQL'], match: 86, role: 'Backend Developer', avatar: 'V', statusTag: '⚡ Major Project Ready', campusTag: 'KNIT Sultanpur' },
  { name: 'Neha B.', branch: 'IT · 3rd Year', skills: ['React Native', 'Firebase'], match: 93, role: 'App Developer', avatar: 'N', statusTag: '📱 App Developer', campusTag: 'Campus Verified' },
  { name: 'Siddharth R.', branch: 'CSE · 4th Year', skills: ['Go', 'Kubernetes', 'Docker'], match: 90, role: 'DevOps Engineer', avatar: 'S', statusTag: '🚀 DevOps Lead', campusTag: 'KNIT Sultanpur' },
  { name: 'Muskan A.', branch: 'ECE · 3rd Year', skills: ['C++', 'Embedded C', 'IoT'], match: 88, role: 'Embedded Systems Dev', avatar: 'M', statusTag: '⚡ Hardware Developer', campusTag: 'Campus Verified' },
  { name: 'Chirag L.', branch: 'IT · 4th Year', skills: ['Next.js', 'GraphQL', 'Prisma'], match: 96, role: 'Full Stack Dev', avatar: 'C', statusTag: '🏆 Hackathon Finalist', campusTag: 'KNIT Sultanpur' },
  { name: 'Aditi W.', branch: 'CSE · 3rd Year', skills: ['Data Science', 'Pandas', 'SQL'], match: 91, role: 'Data Analyst', avatar: 'A', statusTag: '📊 Data Specialist', campusTag: 'Campus Verified' },
  { name: 'Tanmay J.', branch: 'IT · 4th Year', skills: ['Flutter', 'Dart', 'BLoC'], match: 89, role: 'Mobile Architect', avatar: 'T', statusTag: '📱 Mobile Lead', campusTag: 'KNIT Sultanpur' }
]

const LandingPage = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [allEvents, setAllEvents] = useState(staticEvents)
  const [visibleEvents, setVisibleEvents] = useState(staticEvents.slice(0, 4))
  const [eventIndex, setEventIndex] = useState(4)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  
  // Hero Interactive Match Sandbox State
  const [selectedSkill, setSelectedSkill] = useState('React')
  const [activeTab, setActiveTab] = useState('projects')
  
  // Real-time live candidates from backend MongoDB database with high-availability mock fallback
  const [candidates, setCandidates] = useState(mockCandidates)
  const [candidateOffset, setCandidateOffset] = useState(0)

  // Fetch real users from MongoDB for Live Match Simulator
  const fetchRealCandidates = async (skill) => {
    try {
      let res = await fetch(`${API_BASE_URL}/users/public-matches?skill=${encodeURIComponent(skill || '')}`)
      let json = null
      if (res.ok) {
        json = await res.json()
      }

      // If public-matches 404s or is empty on production backend, fallback to live endpoint /users/recent-joins
      if (!json || !json.success || !Array.isArray(json.data) || json.data.length === 0) {
        const res2 = await fetch(`${API_BASE_URL}/users/recent-joins`)
        if (res2.ok) {
          const json2 = await res2.json()
          if (json2.success && Array.isArray(json2.data) && json2.data.length > 0) {
            json = {
              success: true,
              data: json2.data.map((u, i) => ({
                _id: u._id || `user-${i}`,
                name: u.displayName || u.name,
                branch: u.branch ? `${u.branch} · Student` : 'BTech',
                skills: u.skills && u.skills.length > 0 ? u.skills : ['React', 'Node.js'],
                match: 98 - (i % 5),
                role: u.skills && u.skills.length > 0 ? `${u.skills[0]} Dev` : 'Software Developer',
                avatar: (u.displayName || u.name || 'U')[0].toUpperCase()
              }))
            }
          }
        }
      }

      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        if (json.data.length < 4) {
          const mockFillers = mockCandidates.filter(m => !json.data.some(d => d.name === m.name))
          setCandidates([...json.data, ...mockFillers.slice(0, 4 - json.data.length)])
        } else {
          setCandidates(json.data)
        }
      } else {
        const filteredMock = mockCandidates.map(c => ({
          ...c,
          match: c.skills.some(s => s.toLowerCase().includes((skill || '').toLowerCase())) ? 98 : c.match
        }))
        setCandidates(filteredMock)
      }
    } catch (err) {
      console.warn('Real candidates fetch error:', err)
      try {
        const res2 = await fetch(`${API_BASE_URL}/users/recent-joins`)
        if (res2.ok) {
          const json2 = await res2.json()
          if (json2.success && Array.isArray(json2.data) && json2.data.length > 0) {
            const mapped = json2.data.map((u, i) => ({
              _id: u._id || `user-${i}`,
              name: u.displayName || u.name,
              branch: u.branch ? `${u.branch} · Student` : 'BTech',
              skills: u.skills && u.skills.length > 0 ? u.skills : ['React', 'Node.js'],
              match: 98 - (i % 5),
              role: u.skills && u.skills.length > 0 ? `${u.skills[0]} Dev` : 'Software Developer',
              avatar: (u.displayName || u.name || 'U')[0].toUpperCase()
            }))
            if (mapped.length < 4) {
              const mockFillers = mockCandidates.filter(m => !mapped.some(d => d.name === m.name))
              setCandidates([...mapped, ...mockFillers.slice(0, 4 - mapped.length)])
            } else {
              setCandidates(mapped)
            }
            return
          }
        }
      } catch (_) {}

      const filteredMock = mockCandidates.map(c => ({
        ...c,
        match: c.skills.some(s => s.toLowerCase().includes((skill || '').toLowerCase())) ? 98 : c.match
      }))
      setCandidates(filteredMock)
    }
  }

  useEffect(() => {
    fetchRealCandidates(selectedSkill)
    // 5s Polling for newly registered DB users in real-time
    const poll = setInterval(() => {
      fetchRealCandidates(selectedSkill)
    }, 5000)
    return () => clearInterval(poll)
  }, [selectedSkill])

  // Continuous smooth auto-scroll ticker rotation ONLY if more than 4 real users exist
  useEffect(() => {
    if (candidates.length <= 4) return
    const timer = setInterval(() => {
      setCandidateOffset(prev => (prev + 1) % candidates.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [candidates.length])

  // Slice visible candidates (up to 4 at a time)
  const visibleCandidates = React.useMemo(() => {
    if (!candidates || candidates.length === 0) return mockCandidates.slice(0, 4)
    if (candidates.length <= 4) return candidates
    const result = []
    for (let i = 0; i < Math.min(4, candidates.length); i++) {
      result.push(candidates[(candidateOffset + i) % candidates.length])
    }
    return result
  }, [candidates, candidateOffset])

  const faqs = [
    {
      q: 'Who is the founder of TeamZen?',
      a: 'Mukul Kumar is the Founder and Lead Architect of TeamZen. He is a Full-Stack developer and engineering student from KNIT Sultanpur who designed TeamZen to solve the challenge BTech students face when finding balanced teammates for hackathons, major projects, and tech startups.'
    },
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
    }, 2400)
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
    }, 3000)
    return () => clearInterval(t)
  }, [eventIndex, allEvents])

  const stats = [
    { label: 'Active Students', target: 10000, suffix: '+', icon: Users, color: '#38BDF8' },
    { label: 'Teams Formed', target: 2500, suffix: '+', icon: Network, color: '#A855F7' },
    { label: 'Projects Built', target: 1800, suffix: '+', icon: Target, color: '#F97316' },
    { label: 'Match Accuracy', target: 96, suffix: '%', icon: ShieldCheck, color: '#10B981' }
  ]

  const steps = [
    {
      step: '01',
      title: 'Setup Tech Matrix',
      description: 'Define your core tech stack, branch, and target project domains in under 60 seconds.',
      icon: Cpu,
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Smart Skill Matching',
      description: 'Our engine finds teammates with zero skill overlap who complete your missing engineering stack.',
      icon: Layers,
      accent: 'from-purple-500 to-pink-500'
    },
    {
      step: '03',
      title: 'Connect & Ship',
      description: 'Chat directly in built-in team rooms, assign responsibilities, and launch your project.',
      icon: Rocket,
      accent: 'from-orange-500 to-amber-500'
    }
  ]

  const audienceData = {
    projects: {
      title: 'Final Year Major Projects',
      subtitle: 'Never struggle with unbalanced BTech project teams again.',
      tags: ['Complementary Skills', 'Branch Filter', 'Deadline Tracking'],
      metrics: '5,000+ Projects Matched'
    },
    hackathons: {
      title: 'SIH & Global Hackathons',
      subtitle: 'Build high-velocity squads with Frontend, Backend, ML, and UI/UX in minutes.',
      tags: ['Instant 1-Click Invites', 'Hackathon Badges', 'Rapid Squads'],
      metrics: '250+ Squads Formed / Mo'
    },
    startups: {
      title: 'Campus Startup Founders',
      subtitle: 'Find driven co-founders and initial tech contributors right in your college network.',
      tags: ['Co-founder Match', 'Portfolio Preview', 'Verified Profiles'],
      metrics: '120+ MVP Launches'
    }
  }

  const testimonials = [
    {
      name: 'Mukul Kumar',
      role: 'IT, KNIT Sultanpur',
      initial: 'M',
      color: 'from-orange-500 to-rose-500',
      content: 'Found our final year major project team in less than 24 hours. The match algorithm gave us zero skill overlap.',
      project: 'HealthAI Platform'
    },
    {
      name: 'Shivam Rajora',
      role: 'IT, KNIT Sultanpur',
      initial: 'S',
      color: 'from-blue-500 to-cyan-500',
      content: 'Built our SIH squad through TeamZen. Skipped thousands of spam WhatsApp messages and got real developers.',
      project: 'Smart Agriculture System'
    },
    {
      name: 'Ashish Pratap',
      role: 'IT, KNIT Sultanpur',
      initial: 'A',
      color: 'from-violet-500 to-purple-500',
      content: 'The complimentary skill match is insane. Found an ML specialist and a UI designer for our prototype in 2 clicks.',
      project: 'IoT Smart Home Hub'
    }
  ]

  return (
    <div className="min-h-screen text-slate-100 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden w-full max-w-full" style={{ backgroundColor: '#0B0D17' }}>

      {/* ── TOP FLOATING NAVBAR ── */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-2 sm:px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-14 sm:h-16 rounded-2xl flex items-center justify-between px-3 sm:px-6 border border-white/10 backdrop-blur-xl bg-[#0a0a12]/80 shadow-2xl">
          
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 group cursor-pointer"
            title="TeamZen Home"
          >
            <img src="/images/logo26.png" alt="TeamZen" className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => { e.preventDefault(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#hackathons" onClick={(e) => { e.preventDefault(); document.querySelector('#hackathons')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              <span>Hackathons</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">How It Works</a>
            <a href="#who-its-for" onClick={(e) => { e.preventDefault(); document.querySelector('#who-its-for')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Who It's For</a>
            <a href="#stories" onClick={(e) => { e.preventDefault(); document.querySelector('#stories')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Stories</a>
            <Link to="/about" className="text-xs font-semibold uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors">About Founder</Link>
            <a href="#faq" onClick={(e) => { e.preventDefault(); document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' }) }} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="shimmer-btn text-xs px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center gap-2">
              <span>Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden bg-[#0d0d16] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
            >
              {['features', 'how-it-works', 'who-its-for', 'stories', 'faq'].map((sec) => (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMobileMenuOpen(false)
                    document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm font-semibold capitalize text-slate-300 hover:text-white py-2.5 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{sec.replace('-', ' ')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </a>
              ))}
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <span>Log In to TeamZen</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION WITH TECH GRID ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden laser-border-top max-w-full">
        {/* Background Grid & Spotlight */}
        <div className="absolute inset-0 tech-grid-bg pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] rounded-full pointer-events-none overflow-hidden"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.14) 0%, rgba(255,107,53,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 w-full overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">

            {/* Left Content */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-7 flex flex-col items-start w-full overflow-hidden">
              
              {/* Tactical Developer Live Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl mb-5 sm:mb-8 border border-emerald-500/30 bg-slate-900/90 backdrop-blur-md max-w-full shadow-lg shadow-emerald-950/20 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 shadow-[0_0_8px_#10B981]" />
                <span className="text-emerald-300 text-[10px] sm:text-xs font-semibold tracking-wide uppercase truncate">
                  DB_STATUS: LIVE · 🎓 KNIT SULTANPUR HUB · ⚡ SIH 2026 READY
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-5 max-w-full overflow-hidden">
                <span className="text-white block sm:inline">Stop searching in </span>
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 bg-clip-text text-transparent block sm:inline">WhatsApp groups.</span>
                <br className="hidden sm:block" />
                <span className="text-slate-300 text-xl sm:text-3xl md:text-5xl font-semibold mt-2 block sm:inline-block">
                  <span className="block sm:inline">Build teams for</span>{' '}
                  <span className="relative inline-block text-emerald-400 font-bold font-mono min-w-0 sm:min-w-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block"
                      >
                        {words[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              <p className="text-slate-400 text-xs sm:text-lg leading-relaxed mb-6 sm:mb-10 max-w-xl">
                TeamZen matches BTech developers and designers by real complementary skills — zero overlap, zero random connections.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link to="/login" className="shimmer-btn inline-flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02]">
                  <span>Find Teammates Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 border border-slate-700/80 hover:border-emerald-500/40 bg-slate-900/60 hover:bg-slate-900 transition-all font-mono">
                  <span>./explore_engine</span>
                </a>
              </div>

              {/* Live Student Proof */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-5 border-t border-slate-800/80 w-full">
                <div className="flex -space-x-2.5 flex-shrink-0">
                  {['A','P','R','M','S'].map((letter, i) => (
                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#0B0D17] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-md"
                      style={{ background: ['#FF6B35','#9D4EDD','#00A896','#FF6B9D','#52B788'][i] }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="text-slate-300 text-xs sm:text-sm font-medium">
                    Joined by <span className="text-emerald-400 font-bold font-mono">500+ BTech builders</span> this week
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">🎓 KNIT Sultanpur Verified Campus Network</span>
                </div>
              </div>

            </motion.div>

            {/* Right — Interactive Hero Skill Match Sandbox (Clean Developer Studio Window & Student Pass Cards) */}
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="show" 
              custom={2} 
              className="lg:col-span-5 w-full overflow-hidden"
            >
              <div className="rounded-2xl p-3.5 sm:p-5 relative overflow-hidden border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-2xl max-w-full">
                
                {/* Background Accent Blur */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* VS Code Window Header (Mobile Responsive) */}
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-800/80 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 inline-block shadow-sm" />
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-300 font-bold tracking-tight truncate ml-1">
                      KNIT_STUDENT_PASS_MATRIX.exe
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex-shrink-0">
                    MATCH_V2
                  </span>
                </div>

                {/* Skill selector */}
                <p className="text-[11px] sm:text-xs font-mono text-slate-400 mb-2">Select target stack filter:</p>
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {sampleSkills.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setSelectedSkill(sk)}
                      className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border transition-all ${
                        selectedSkill === sk
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20 scale-105'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>

                {/* Dynamic Candidates Alternative Card Layout: Responsive Holographic Student ID Pass Cards */}
                <div className="space-y-2.5 min-h-[300px] relative overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {visibleCandidates.map((c, i) => (
                      <motion.div
                        key={c._id || `${c.name}-${c.role}`}
                        layout
                        initial={{ opacity: 0, y: -15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="p-2.5 sm:p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 hover:border-emerald-500/50 flex flex-col gap-2 transition-all max-w-full group shadow-lg hover:shadow-emerald-950/40 relative overflow-hidden"
                      >
                        {/* Metallic Holographic Top Border Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-amber-300 via-cyan-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                        {/* Top ID Header Bar */}
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pb-1 border-b border-slate-800/60">
                          <span className="flex items-center gap-1 text-slate-400 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            ID: <strong className="text-slate-300">KNIT-2026-0{i + 1}</strong>
                          </span>
                          <span className="text-slate-500 hidden sm:inline">||| | || ||||| |</span>
                        </div>

                        {/* Middle Student Profile Details */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-emerald-400 text-xs sm:text-sm flex-shrink-0 shadow-md ring-2 ring-emerald-500/10">
                              {c.avatar || (c.name ? c.name[0] : 'U')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                <p className="text-xs font-black text-white truncate font-mono tracking-tight">
                                  {c.name}
                                </p>
                                <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 font-mono border border-emerald-500/30 truncate">
                                  {c.campusTag || 'Verified Student'}
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                                {c.role ? `${c.role} · ${c.branch}` : c.branch}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end flex-shrink-0">
                            <span className="text-[10px] sm:text-xs font-mono font-black text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-emerald-500/40 shadow-sm shadow-emerald-950/50">
                              <Check className="w-3 h-3 text-emerald-400" /> {c.match}%
                            </span>
                          </div>
                        </div>

                        {/* Student Status Tag & Stack Pills */}
                        <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-slate-800/60 text-[9px] sm:text-[10px] gap-1">
                          <span className="text-amber-400 font-medium truncate font-mono max-w-[65%]">
                            {c.statusTag || '⚡ Open for Teammates'}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            {(c.skills || []).slice(0, 2).map((sk, sidx) => (
                              <span key={sidx} className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-slate-800/90 text-emerald-300 font-mono text-[8px] sm:text-[9px] border border-slate-700">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer status */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span>MATCH_ACCURACY: <strong className="text-emerald-400">96.4%</strong></span>
                  </span>
                  <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
                    Connect <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── HIGH-IMPACT TERMINAL CLI BANNER STRIP ── */}
      <section className="relative z-20 max-w-6xl mx-auto px-3 sm:px-6 -mt-6 mb-12">
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3 sm:p-4 font-mono text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-emerald-500 font-bold">$</span>
            <span className="text-slate-100 font-bold">teamzen match</span>
            <span className="text-amber-400 font-medium">--campus</span>
            <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">"KNIT Sultanpur"</span>
            <span className="text-purple-400 font-medium">--event</span>
            <span className="text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30 font-semibold">"SIH 2026 & Major Projects"</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4 w-full md:w-auto justify-between md:justify-start">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              STATUS: READY
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">0% Skill Overlap Match Engine</span>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE PRODUCT PREVIEW ── */}
      <InteractiveDemo />

      {/* ── LIVE CAMPUS ACTIVITY TICKER ── */}
      <section className="relative py-4 bg-slate-950 border-y border-slate-800/80 overflow-hidden font-mono text-xs">
        <div className="flex items-center gap-6 animate-pulse whitespace-nowrap px-6">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <span>⚡ CAMPUS FEED:</span>
          </span>
          <span className="text-slate-300">
            <strong className="text-white">Mukul K. (IT 4th Yr)</strong> requested ML Engineer for SIH 
            <span className="text-emerald-400 ml-1 font-sans">(KNIT Sultanpur)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            <strong className="text-white">Priya M. (CS 3rd Yr)</strong> joined HealthAI Squad 
            <span className="text-emerald-400 ml-1 font-sans">(Verified Student)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            <strong className="text-white">Shivam R. (ECE 4th Yr)</strong> published React Native Project 
            <span className="text-emerald-400 ml-1 font-sans">(BTech Major Project)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            <strong className="text-emerald-400">98% Synergy Match</strong> generated for BTech Major Project
          </span>
        </div>
      </section>
      <section className="relative py-16 border-y border-white/5" style={{ background: '#0a0a10' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/[0.03] border border-white/10" style={{ color: stat.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES (BENTO GRID ARCHITECTURE) ── */}
      <section id="features" className="relative py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10">
              Built for Engineering Speed
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-4">
              Everything you need to <span className="gradient-accent-text">ship together</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              No generic social network noise. Purpose-built tools to form balanced BTech teams fast.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-12 gap-6">

            {/* Bento 1: 3-Pillar Synergy Skill Matrix (Col 7) */}
            <div className="md:col-span-7 rounded-3xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-slate-800 bg-slate-950/80 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-mono">3-Pillar Synergy Match Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                  Stop teaming up with 4 React developers. TeamZen automatically calculates zero skill overlap across 3 core pillars.
                </p>
              </div>

              {/* 3-Pillar Visual Progress Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
                  <span>TOTAL SYNERGY ACCURACY</span>
                  <span className="text-emerald-400 font-extrabold text-sm">96.8% SCORE</span>
                </div>
                
                {/* Pillar 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">1. Skill Complementarity (40%)</span>
                    <span className="text-emerald-400">100% Match</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full w-[100%]" />
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">2. Campus & Academic Fit (30%)</span>
                    <span className="text-amber-400">94% Match</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full w-[94%]" />
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">3. Hackathon Goals & Velocity (30%)</span>
                    <span className="text-purple-400">96% Match</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: Smart Filters (Col 5) */}
            <div className="md:col-span-5 rounded-3xl p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-slate-800 bg-slate-950/80 shadow-2xl hover:border-purple-500/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-mono">Hyper-Targeted Campus Filters</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Filter candidates by exact college, BTech branch (IT, CS, ECE), year of study, and verified skills.
                </p>
              </div>

              {/* Filter pill preview */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> KNIT Sultanpur
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> IT & CS Branch
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 4th Year
                </span>
              </div>
            </div>

            {/* Bento 3: Built-in Chat (Col 5) */}
            <div className="md:col-span-5 rounded-3xl p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-slate-800 bg-slate-950/80 shadow-2xl hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-mono">Real-Time Team Rooms</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Direct messages and project group chats. Discuss code, share links, and coordinate without leaking phone numbers.
                </p>
              </div>

              {/* Mini Chat Widget */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 w-4/5">
                  <span className="font-bold block text-[10px] text-purple-400">Aryan (Frontend · Hostel 5)</span>
                  Hey! Connected MongoDB to the express server.
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 w-4/5 ml-auto text-right">
                  <span className="font-bold block text-[10px] text-emerald-400">Sneha (UI/UX · Gargi)</span>
                  Awesome! Uploaded Figma dev specs.
                </div>
              </div>
            </div>

            {/* Bento 4: Showcase & Proof (Col 7) */}
            <div className="md:col-span-7 rounded-3xl p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-slate-800 bg-slate-950/80 shadow-2xl hover:border-amber-500/40 transition-all hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-mono">Verified Project Showcase</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Display your GitHub repos, live project URLs, hackathon certificates, and departmental badges directly on your profile.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 font-mono text-xs">
                {['🏆 SIH 2025 Finalist', '⭐ Top Department Project', '⚡ 15+ Verified Skills', '🚀 4 Completed Projects'].map((b, idx) => (
                  <span key={idx} className="px-3.5 py-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/30 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {b}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── LIVE HACKATHONS & FLAGSHIP COMPETITIONS SHOWCASE ── */}
      <section id="hackathons" className="py-20 max-w-7xl mx-auto px-4 md:px-8 relative z-20 border-t border-white/5" style={{ background: '#0B0D17' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-950/80 text-orange-400 border border-orange-500/40 inline-flex items-center gap-1.5 shadow-md animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-orange-400" /> Live Automated Hackathons Engine
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Discover Live Student Hackathons & Flagship Competitions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Real-time active student competitions synced directly from Unstop, SIH 2026, Google Solution Challenge, Flipkart GRiD & Devfolio. Find teammates & apply in 1-click!
          </p>
        </div>

        {/* Sample Live Hackathon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-mono">
          {/* Card 1: SIH 2026 */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl space-y-4 relative group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                🏆 National Flagship
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                ⚡ 22d left
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Smart India Hackathon (SIH 2026)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Ministry of Education & AICTE</p>
            </div>
            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between"><span>Prize Pool:</span><strong className="text-emerald-400">₹1,00,000 / Problem</strong></div>
              <div className="flex justify-between"><span>Mode:</span><strong className="text-white">Hybrid (Internal + Grand Finale)</strong></div>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <Link to="/login" className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-center shadow-md hover:scale-[1.02] transition-transform">
                Find SIH Teammates ↗
              </Link>
            </div>
          </div>

          {/* Card 2: Google Solution Challenge */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl space-y-4 relative group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
                🌐 Global Event
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                ⚡ Active Registration
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Google Solution Challenge 2026
              </h3>
              <p className="text-xs text-slate-400 mt-1">Google Developer Student Clubs</p>
            </div>
            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between"><span>Prize Pool:</span><strong className="text-emerald-400">$10,000 + Google Mentorship</strong></div>
              <div className="flex justify-between"><span>Mode:</span><strong className="text-white">Online Global</strong></div>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <Link to="/login" className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-center shadow-md hover:scale-[1.02] transition-transform">
                Find GDSC Teammates ↗
              </Link>
            </div>
          </div>

          {/* Card 3: Flipkart GRiD 6.0 */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl space-y-4 relative group hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                💻 Software Track
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                ⚡ IIT / NIT Campus Live
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Flipkart GRiD 6.0 Software Track
              </h3>
              <p className="text-xs text-slate-400 mt-1">Flipkart Engineering</p>
            </div>
            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between"><span>Prize Pool:</span><strong className="text-emerald-400">₹5,25,000 + PPI Offers</strong></div>
              <div className="flex justify-between"><span>Mode:</span><strong className="text-white">Online + Onsite Finale</strong></div>
            </div>
            <div className="flex items-center gap-2 pt-2 text-xs">
              <Link to="/login" className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-center shadow-md hover:scale-[1.02] transition-transform">
                Find GRiD Teammates ↗
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/login" className="shimmer-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-white shadow-2xl hover:scale-105 transition-all">
            <Rocket className="w-5 h-5 text-white" />
            <span>Explore All Live Student Hackathons (12+ Active Events)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative py-28 border-t border-white/5" style={{ background: '#0a0a12' }}>
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10">
              3 Simple Steps
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4">How TeamZen Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bento-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                  <span className="text-6xl font-black text-white/5 absolute top-4 right-6 pointer-events-none">
                    {item.step}
                  </span>

                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.accent} flex items-center justify-center text-white mb-6 shadow-xl`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Step {item.step} Complete
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── WHO IT'S FOR (INTERACTIVE AUDIENCE SPOTLIGHT) ── */}
      <section id="who-its-for" className="relative py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10">
              Tailored Workflows
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4">Built for every BTech builder</h2>
          </div>

          {/* Interactive Audience Tabs */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {[
              { id: 'projects', label: 'Final Year Major Projects', icon: GraduationCap },
              { id: 'hackathons', label: 'Hackathon Squads', icon: Code },
              { id: 'startups', label: 'Campus Startups', icon: Briefcase }
            ].map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 border transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/25'
                      : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Tab Spotlight Showcase Card */}
          <div className="bento-card rounded-3xl p-8 sm:p-12 border border-orange-500/20 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-3xl font-extrabold text-white">
                  {audienceData[activeTab].title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  {audienceData[activeTab].subtitle}
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {audienceData[activeTab].tags.map((tg, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-orange-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-orange-400" /> {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center p-6 rounded-2xl bg-black/40 border border-white/10 text-center lg:text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Impact Metric</p>
                <p className="text-3xl font-black text-white mb-4">{audienceData[activeTab].metrics}</p>
                <Link to="/login" className="shimmer-btn text-xs px-5 py-2.5 rounded-xl font-bold bg-orange-500 text-white flex items-center gap-2">
                  <span>Create Requirement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="stories" className="relative py-28 border-t border-white/5" style={{ background: '#0a0a12' }}>
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10">
              Student Stories
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4">Loved by engineering students</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bento-card rounded-3xl p-7 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.content}"</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${t.color} flex items-center justify-center font-bold text-white text-sm`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{t.name}</p>
                    <p className="text-slate-400 text-[11px]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── MEET THE FOUNDER SECTION ── */}
      <section id="about-founder" className="relative py-28 border-t border-white/5 overflow-hidden" style={{ background: '#0a0a10' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10">
              Meet The Architect
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4">
              Who is behind <span className="gradient-accent-text">TeamZen?</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Designed and built by Mukul Kumar to help BTech engineering students connect, collaborate, and ship real projects.
            </p>
          </div>

          <div className="bento-card rounded-3xl p-8 sm:p-12 border border-orange-500/20 relative overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 p-1 shadow-xl mb-4 overflow-hidden">
                  <div className="w-full h-full rounded-[14px] bg-[#0d0d16] overflow-hidden flex items-center justify-center border border-white/10">
                    <img
                      src="/images/mukul2.png"
                      alt="Mukul Kumar - Founder of TeamZen"
                      className="w-full h-full object-cover rounded-[14px]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Mukul Kumar</h3>
                <p className="text-xs text-orange-400 font-semibold mb-2">Founder & Lead Architect</p>
                <span className="text-[11px] text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  KNIT Sultanpur (BTech IT)
                </span>
              </div>

              <div className="md:col-span-8 space-y-5">
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  "Solving BTech team matching with intelligent matrix algorithms."
                </h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Mukul created TeamZen to fix a problem every BTech student faces: finding reliable teammates for Hackathons, Major Projects, and Startups without skill overlap or WhatsApp group clutter.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/about"
                    className="shimmer-btn text-xs px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <span>Read Full Founder Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="https://github.com/mukul953kumar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-5 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2"
                  >
                    <span>GitHub Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-28">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-purple-500/20 bg-purple-500/10 text-purple-300">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={index}
                  className="bento-card rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-white font-semibold text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-400' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── CTA FOOTER BANNER ── */}
      <section className="relative py-28 border-t border-white/10 overflow-hidden" style={{ background: '#08080d' }}>
        <div className="absolute inset-0 tech-grid-bg pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Join 10,000+ Engineering Students</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Ready to find your <br />
            <span className="gradient-accent-text">perfect project squad?</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-lg mx-auto">
            Build your team in minutes. Free for all BTech & college students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="shimmer-btn inline-flex items-center justify-center gap-2.5 text-base px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/25">
              <span>Start Building Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
