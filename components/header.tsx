"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    // Toggle the 'open' class on nav element
    const navElement = document.querySelector('.mobile-only-nav')
    if (navElement) {
      navElement.classList.toggle('open')
    }
  }

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <motion.div 
        className="logo"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <KineticTypography textStyle="wave">
          <span className={`greeting font-semibold text-lg ${scrolled ? 'text-gray-100' : 'text-gray-900'}`}>
            John Doe
          </span>
        </KineticTypography>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="subtitle"
        >
          DEVELOPER / DATA ANALYST
        </motion.div>
      </motion.div>

      <div className="container">
        {/* Navigation is hidden on desktop and tablets, visible only on mobile when menu is opened */}
        <nav className="mobile-only-nav">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  )
}
