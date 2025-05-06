"use client"

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, -1])
  
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