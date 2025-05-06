"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import KineticTypography from "./KineticTypography"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    </header>
  )
}
