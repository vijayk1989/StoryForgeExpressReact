import { useState, useEffect } from 'react'
import { Home, Search, BookOpen, Feather, User, Menu, X, Sun, Moon } from 'lucide-react'

export default function Layout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const navLinks = [
    { icon: <Home className="w-6 h-6" />, label: 'Home' },
    { icon: <Search className="w-6 h-6" />, label: 'Explore' },
    { icon: <BookOpen className="w-6 h-6" />, label: 'Library' },
    { icon: <Feather className="w-6 h-6" />, label: 'Write' },
    { icon: <User className="w-6 h-6" />, label: 'Profile' },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-20 bg-white dark:bg-gray-800 shadow-lg">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href="#"
            className="p-4 text-gray-600 hover:bg-amber-100 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-200 transition-colors duration-200"
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="mt-auto p-4 text-gray-600 hover:bg-amber-100 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-200 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center z-20 shadow-md">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="text-gray-600 dark:text-gray-300"
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
        >
          {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 dark:from-indigo-400 dark:to-purple-400">StoryVerse</span>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-600 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
          isMobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className={`flex flex-col w-64 h-full bg-white dark:bg-gray-800 p-4 transition-transform duration-300 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {navLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="p-4 text-gray-600 hover:bg-amber-100 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-200 flex items-center transition-colors duration-200"
              onClick={() => setIsMobileNavOpen(false)}
            >
              {link.icon}
              <span className="ml-4">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
