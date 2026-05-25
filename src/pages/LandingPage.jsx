import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
import NET from "vanta/dist/vanta.net.min";
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
  Sparkles,
  Target,
  Globe,
  Layers,
  Cpu,
  Network,
  Heart,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  Play,
  Pause,
  Volume2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronDown,
  Menu,
  X,
  Send,
  Lock,
  Clock,
  MapPin,
  Calendar,
  Filter,
  Grid,
  List,
  Settings,
  Bell,
  User,
  LogOut,
  Home
} from 'lucide-react'

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [likedFeatures, setLikedFeatures] = useState(new Set())
  const containerRef = useRef(null)
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Vanta.js 3D Background Effect - CDN Version
  useEffect(() => {
    const initVanta = () => {
      if (window.VANTA && vantaRef.current && !vantaEffect) {
        const effect = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff3f6c,          // Pink/Red network lines
          backgroundColor: 0x23153c, // Purple/Dark background
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00,
          showDots: true
        })
        setVantaEffect(effect)
      }
    }

    // Check if scripts are already loaded
    if (window.VANTA) {
      initVanta()
    } else {
      // Wait for scripts to load
      const checkVanta = setInterval(() => {
        if (window.VANTA) {
          initVanta()
          clearInterval(checkVanta)
        }
      }, 100)

      // Cleanup interval after 5 seconds
      setTimeout(() => clearInterval(checkVanta), 5000)
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  // Generate particles for background
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  const features = [
    {
      icon: Users,
      title: 'AI-Powered Matching',
      description: 'Smart algorithm finds your perfect teammates based on skills, personality, and project goals',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Advanced Discovery',
      description: 'Filter through thousands of students by college, branch, skills, and availability',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Collaboration',
      description: 'Built-in chat, video calls, and project management tools for seamless teamwork',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Showcase your projects, hackathons, and certifications with a comprehensive portfolio',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '10K+', icon: Users },
    { label: 'Teams Formed', value: '2.5K+', icon: Network },
    { label: 'Projects Completed', value: '1.8K+', icon: Target },
    { label: 'Success Rate', value: '95%', icon: Trophy }
  ]

  const howItWorks = [
    { 
      step: '1', 
      title: 'Create Your Profile', 
      description: 'Build a comprehensive profile showcasing your skills, projects, and aspirations',
      icon: Sparkles,
      color: 'from-blue-500 to-purple-500'
    },
    { 
      step: '2', 
      title: 'Discover & Connect', 
      description: 'Use our smart matching system to find teammates who complement your skills',
      icon: Search,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      step: '3', 
      title: 'Build & Succeed', 
      description: 'Collaborate on amazing projects and achieve your goals together',
      icon: Rocket,
      color: 'from-pink-500 to-orange-500'
    }
  ]

  const targetUsers = [
    { 
      icon: GraduationCap, 
      title: 'BTech Students', 
      description: 'Find the perfect classmates for your academic projects and assignments',
      stats: '5000+ Active Students'
    },
    { 
      icon: Code, 
      title: 'Hackathon Warriors', 
      description: 'Build winning teams for hackathons and coding competitions',
      stats: '200+ Teams Monthly'
    },
    { 
      icon: Briefcase, 
      title: 'Project Innovators', 
      description: 'Connect with talented individuals for your final year and startup projects',
      stats: '150+ Projects/Week'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Computer Engineering, IIT Delhi',
      avatar: '👩‍💻',
      content: 'TeamZen helped me find amazing teammates for my final year project. We built an AI-powered healthcare app that won first prize!',
      rating: 5,
      project: 'HealthAI App',
      likes: 234
    },
    {
      name: 'Mukul Kumar',
      role: 'Computer Science Engineering, KNIT Sultanpur',
      avatar: '👨‍🔧',
      content: 'Found my hackathon team through TeamZen. We won Smart India Hackathon 2023! The platform is incredibly intuitive.',
      rating: 5,
      project: 'Smart Agriculture System',
      likes: 189
    },
    {
      name: 'Ananya Patel',
      role: 'Electronics Engineering, BITS Pilani',
      avatar: '👩‍🔬',
      content: 'The AI matching algorithm is spot-on! Found teammates with complementary skills for our IoT startup.',
      rating: 5,
      project: 'IoT Smart Home',
      likes: 156
    }
  ]

  const liveProjects = [
    {
      title: 'AI Study Buddy',
      team: 'CodeCrafters',
      members: 4,
      progress: 75,
      category: 'AI/ML',
      urgency: 'High',
      looking: 'Backend Developer'
    },
    {
      title: 'EcoTracker App',
      team: 'GreenTech',
      members: 3,
      progress: 60,
      category: 'Environment',
      urgency: 'Medium',
      looking: 'UI/UX Designer'
    },
    {
      title: 'Blockchain Voting',
      team: 'CryptoDevs',
      members: 5,
      progress: 45,
      category: 'Blockchain',
      urgency: 'Low',
      looking: 'Smart Contract Developer'
    }
  ]

  return (
    <div className="parallax-bg" ref={containerRef} style={{ backgroundColor: '#000000' }}>
      {/* Main Content - No navbar, so no top padding needed */}
      <div style={{ backgroundColor: 'transparent' }}>
      {/* Hero Section with Vanta.js 3D Background - Clean, no overlay */}
       <section className="py-24 relative"
               style={{
                 backgroundImage: 'url("https://img.magnific.com/free-photo/abstract-digital-grid-black-background_53876-97647.jpg?semt=ais_hybrid&w=740&q=80")',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative',
                 backgroundSize: 'cover'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Unique Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-3d mb-8"
              style={{ 
                background: 'var(--warm-gradient)',
                border: '1px solid rgba(255, 248, 243, 0.3)'
              }}
            >
              <Sparkles style={{ color: 'var(--sunset-orange)' }} className="w-5 h-5" />
              <span style={{ color: 'var(--warm-gray)' }} className="text-sm font-bold">🔥 Trending: 10,000+ Students</span>
            </motion.div>

            {/* Unique Main Heading */}
            <h1 className="mb-8 leading-tight">
              <span className="text-sunset text-6xl md:text-8xl font-bold block mb-3">TeamZen</span>
              <span className="text-teal text-4xl md:text-6xl font-bold">Where Teams Are Born</span>
            </h1>
            
            {/* Unique Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
              style={{ color: 'var(--cream-white)' }}
            >
              Stop searching. Start building. Connect with passionate BTech students and create projects that matter.
            </motion.p>

            {/* Unique CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link to="/signup" className="btn-sunset inline-flex items-center">
                <span>Start Building Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link to="/login" className="glass-3d px-8 py-4 rounded-2xl border border-white/20 hover:border-orange-400/50 transition-all cursor-pointer">
                <span style={{ color: 'var(--cream-white)' }} className="text-lg font-semibold">Watch Demo</span>
              </Link>
            </motion.div>

            {/* Unique Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
                    style={{ 
                      background: `var(--${['sunset-orange', 'deep-teal', 'coral-pink', 'mint-green', 'soft-purple'][i-1]})`,
                      borderColor: 'var(--warm-gray)'
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ color: 'var(--cream-white)' }} className="text-lg">
                  <span className="font-bold">500+ students</span> joined this week
                </p>
                <p style={{ color: 'var(--deep-teal)' }} className="text-sm">⚡ 4.9/5 rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image3.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold neon-gradient-text mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image2.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Why Choose </span>
              <span className="neon-gradient-text">TeamZen?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of team collaboration with our cutting-edge features designed for student success
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group"
                  onHoverStart={() => setActiveFeature(index)}
                  onHoverEnd={() => setActiveFeature(null)}
                >
                  <div className={`glass-3d rounded-3xl p-8 h-full hover-3d transition-all duration-300 border border-white/10 ${
                    activeFeature === index ? 'border-primary-400/50 shadow-neon scale-105' : 'hover:border-primary-400/30'
                  }`}>
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      activeFeature === index ? 'scale-110 rotate-6' : 'group-hover:scale-110'
                    }`}>
                      <Icon className={`w-10 h-10 text-white transition-transform duration-300 ${
                        activeFeature === index ? 'animate-pulse' : ''
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 text-center transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-center leading-relaxed">{feature.description}</p>
                    
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <button className="w-full py-2 bg-gradient-to-r from-primary-500/20 to-purple-600/20 text-primary-400 rounded-xl font-semibold hover:from-primary-500/30 hover:to-purple-600/30 transition-all duration-300">
                          Learn More
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden"
               style={{
                 backgroundImage: 'url("/images/image3.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-3d mb-6">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--sunset-orange)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--cream-white)' }}>Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">How </span>
              <span className="neon-gradient-text">It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your journey to finding the perfect teammates is just three simple steps away
            </p>
          </motion.div>
          
          {/* Steps Container */}
          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -translate-y-1/2 z-0" />
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {howItWorks.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Step Card */}
                    <div className="glass-3d rounded-3xl p-8 hover-3d transition-all duration-500 border border-white/10 hover:border-orange-400/30 relative overflow-hidden">
                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                           style={{ background: `var(--${['sunset-gradient', 'ocean-gradient', 'coral-gradient'][index]})` }} />
                      
                      {/* Step Number */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl z-20"
                           style={{ background: `var(--${['sunset-gradient', 'ocean-gradient', 'coral-gradient'][index]})` }}>
                        {item.step}
                      </div>
                      
                      {/* Icon Container */}
                      <div className="relative mb-6 mt-4">
                        <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}
                             style={{ background: `var(--${['sunset-gradient', 'ocean-gradient', 'coral-gradient'][index]})` }}>
                          <Icon className="w-10 h-10 text-white transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        
                        {/* Pulse Effect */}
                        <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl animate-pulse opacity-30`}
                             style={{ background: `var(--${['sunset-gradient', 'ocean-gradient', 'coral-gradient'][index]})` }} />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4 text-center">{item.title}</h3>
                      <p className="text-gray-300 text-center leading-relaxed mb-6">{item.description}</p>
                      
                      {/* Arrow Indicator */}
                      <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center glass-3d group-hover:scale-110 transition-transform duration-300">
                          <ArrowRight className="w-5 h-5" style={{ color: 'var(--sunset-orange)' }} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Connection Arrow */}
                    {index < howItWorks.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-6">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <ChevronDown className="w-4 h-4" style={{ color: 'var(--sunset-orange)' }} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="glass-3d rounded-3xl p-8 border border-orange-400/30 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">Join thousands of students who have already found their perfect teams</p>
              <Link 
                to="/signup" 
                className="btn-sunset inline-flex items-center gap-2 px-8 py-4 text-lg hover:scale-105 shadow-lg"
              >
                Start Your Journey
                <Rocket className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image1.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 0
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">Perfect For</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Whatever your goal, we have the right team for you
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {targetUsers.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass-3d rounded-3xl p-8 hover-3d transition-all duration-300 border border-white/10 hover:border-primary-400/30"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-400 text-center mb-6 leading-relaxed">{item.description}</p>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-full text-primary-400 font-semibold">
                      <Star className="w-4 h-4" />
                      {item.stats}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image1.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Success </span>
              <span className="neon-gradient-text">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from students who found their perfect teams and built amazing projects
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-3d rounded-3xl p-8 h-full hover-3d transition-all duration-300 border border-white/10 hover:border-primary-400/30 relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary-400" />
                      <span className="text-sm text-primary-400">{testimonial.project}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newLikes = new Set(likedFeatures)
                        if (newLikes.has(index)) {
                          newLikes.delete(index)
                        } else {
                          newLikes.add(index)
                        }
                        setLikedFeatures(newLikes)
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${likedFeatures.has(index) ? 'fill-red-400 text-red-400' : ''}`} />
                      <span className="text-sm">{testimonial.likes + (likedFeatures.has(index) ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Projects Showcase */}
      <section id="live-projects" className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image2.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="neon-gradient-text">Live Projects</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join these exciting projects that are looking for talented teammates like you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {liveProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-3d rounded-3xl p-6 h-full hover-3d transition-all duration-300 border border-white/10 hover:border-primary-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.urgency === 'High' ? 'bg-red-500/20 text-red-400' :
                      project.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {project.urgency} Priority
                    </span>
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-semibold">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">by {project.team}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-primary-400 font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{project.members} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Search className="w-4 h-4" />
                      <span className="text-sm">{project.looking}</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300">
                    Join Project
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Newsletter Section */}
      <section className="py-24 relative"
               style={{
                 backgroundImage: 'url("/images/image2.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 0
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-3d rounded-3xl p-12 border border-primary-400/30 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Bell className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Stay Updated with </span>
              <span className="neon-gradient-text">TeamZen</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get the latest project opportunities, team updates, and exclusive tips delivered to your inbox
            </p>
            
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-dark-800/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 transition-colors"
                  />
                  <button
                    onClick={() => setSubscribed(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Subscribe
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center gap-3 text-primary-400"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Successfully subscribed!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden"
               style={{
                 backgroundImage: 'url("/images/image1.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative'
               }}>
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1
        }} />
        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-3d rounded-3xl p-16 border border-primary-400/30"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Ready to Find Your </span>
              <span className="neon-gradient-text">Perfect Team?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of BTech students already using TeamZen to build amazing projects and launch their careers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/signup" 
                className="group relative overflow-hidden px-10 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-lg font-semibold rounded-2xl hover-3d transition-all duration-300 shadow-neon"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  <Rocket className="w-5 h-5" />
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </div>
  )
}

export default LandingPage
