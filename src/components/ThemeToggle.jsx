import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-600 hover:border-slate-400'
          : 'bg-amber-50 border-amber-200 hover:border-amber-400'
      } ${className}`}
    >
      <Sun className={`w-4 h-4 transition-all duration-300 ${isDarkMode ? 'text-slate-500' : 'text-amber-500'}`} />

      {/* Track */}
      <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-amber-400'}`}>
        {/* Thumb */}
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isDarkMode ? 'left-4' : 'left-0.5'}`} />
      </div>

      <Moon className={`w-4 h-4 transition-all duration-300 ${isDarkMode ? 'text-blue-400' : 'text-slate-400'}`} />
    </button>
  )
}

export default ThemeToggle
