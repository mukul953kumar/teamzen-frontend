export const getDomainBadgeStyle = (domain) => {
  const d = String(domain || '').toLowerCase()
  if (d.includes('web')) return { icon: '💻', color: 'bg-blue-500/20 text-blue-300 border-blue-500/35' }
  if (d.includes('app') || d.includes('android') || d.includes('ios') || d.includes('flutter')) return { icon: '📱', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35' }
  if (d.includes('ai') || d.includes('machine') || d.includes('ml') || d.includes('data')) return { icon: '🤖', color: 'bg-purple-500/20 text-purple-300 border-purple-500/35' }
  if (d.includes('cloud') || d.includes('devops') || d.includes('aws')) return { icon: '☁️', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/35' }
  if (d.includes('design') || d.includes('ui') || d.includes('ux') || d.includes('figma')) return { icon: '🎨', color: 'bg-pink-500/20 text-pink-300 border-pink-500/35' }
  if (d.includes('cyber') || d.includes('security') || d.includes('hack')) return { icon: '🔒', color: 'bg-red-500/20 text-red-300 border-red-500/35' }
  if (d.includes('block') || d.includes('web3') || d.includes('crypto')) return { icon: '⛓️', color: 'bg-amber-500/20 text-amber-300 border-amber-500/35' }
  if (d.includes('game') || d.includes('unity')) return { icon: '🎮', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/35' }
  if (d.includes('competitive') || d.includes('dsa') || d.includes('cpp')) return { icon: '⚡', color: 'bg-orange-500/20 text-orange-300 border-orange-500/35' }
  if (d.includes('open') || d.includes('source')) return { icon: '🌐', color: 'bg-teal-500/20 text-teal-300 border-teal-500/35' }
  return { icon: '🚀', color: 'bg-primary-500/20 text-primary-300 border-primary-500/35' }
}

export const POPULAR_DOMAINS = [
  'Web Development',
  'App Development',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'UI/UX Design',
  'Cybersecurity',
  'Blockchain & Web3',
  'Game Development',
  'Competitive Programming',
  'Open Source'
]
