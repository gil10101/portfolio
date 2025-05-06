"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KineticTypography from './KineticTypography'

interface FullscreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const menuVariants = {
    hidden: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const containerVariants = {
    hidden: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="menu-overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
        >
          <motion.div 
            className="menu-content"
            variants={containerVariants}
          >
            <motion.a 
              href="#"
              className="menu-item"
              variants={itemVariants}
              onClick={() => onClose()}
            >
              <span className="japanese-numeral">(一)</span>
              <span className="menu-text">HOME</span>
            </motion.a>
            
            <motion.a 
              href="#about"
              className="menu-item"
              variants={itemVariants}
              onClick={() => onClose()}
            >
              <span className="japanese-numeral">(二)</span>
              <span className="menu-text">ABOUT</span>
            </motion.a>
            
            <motion.a 
              href="#projects"
              className="menu-item"
              variants={itemVariants}
              onClick={() => onClose()}
            >
              <span className="japanese-numeral">(三)</span>
              <span className="menu-text">PROJECTS</span>
            </motion.a>
            
            <motion.a 
              href="#contact"
              className="menu-item"
              variants={itemVariants}
              onClick={() => onClose()}
            >
              <span className="japanese-numeral">(四)</span>
              <span className="menu-text">CONTACT</span>
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 