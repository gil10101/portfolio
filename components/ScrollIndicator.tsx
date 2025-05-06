"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, -1])
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }
    
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Don't render on mobile
  if (isMobile) return null
  
  return (
    <motion.div 
      className="scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="scroll-progress">
        <motion.div 
          className="scroll-progress-fill"
          style={{ 
            scaleY: scrollProgress 
          }}
        ></motion.div>
      </div>
      <div className="scroll-text">SCROLL</div>
    </motion.div>
  )
} 