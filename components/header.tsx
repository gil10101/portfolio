"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import KineticTypography from "./KineticTypography"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    // When menu is opened, prevent body scrolling
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const closeMenu = () => {
    setMobileMenuOpen(false)
    document.body.style.overflow = ''
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-[var(--header-height)]">
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <KineticTypography textStyle="wave">
              <span className={`font-semibold text-lg md:text-xl ${
                scrolled ? 'text-gray-100' : 'text-gray-900 dark:text-white'
              }`}>
                Johnny Doe
              </span>
            </KineticTypography>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-xs tracking-wider ${
                scrolled ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              DEVELOPER / DATA ANALYST
            </motion.div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className={`font-medium hover:text-indigo-500 transition-colors ${
                      scrolled ? 'text-gray-100' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span className={`${scrolled ? 'bg-white' : 'bg-gray-900'}`}></span>
                <span className={`${scrolled ? 'bg-white' : 'bg-gray-900'}`}></span>
                <span className={`${scrolled ? 'bg-white' : 'bg-gray-900'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />
      
      <motion.div 
        className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 z-50 shadow-lg md:hidden overflow-hidden"
        initial={{ height: 0 }}
        animate={{ 
          height: mobileMenuOpen ? '100vh' : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="pt-[var(--header-height)] p-6">
          <nav>
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <Link 
                    href={link.href}
                    className="block py-2 px-4 text-xl font-medium text-gray-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>
    </header>
  )
}
