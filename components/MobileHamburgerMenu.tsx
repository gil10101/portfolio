"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileHamburgerMenuProps {
  scrollToSection: (sectionId: string) => void
}

export default function MobileHamburgerMenu({ scrollToSection }: MobileHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId)
    setIsOpen(false)
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const menuItemVariants = {
    closed: { 
      opacity: 0, 
      y: 20 
    },
    open: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  }

  return (
    <>
      <div 
        className={`hamburger-menu-icon ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="mobile-menu-content">
              <motion.div 
                className="mobile-menu-item"
                custom={0}
                variants={menuItemVariants}
                onClick={() => handleNavClick("hero")}
              >
                <span className="mobile-menu-japanese">(一)</span>
                <span className="mobile-menu-text">HOME</span>
              </motion.div>
              
              <motion.div 
                className="mobile-menu-item"
                custom={1}
                variants={menuItemVariants}
                onClick={() => handleNavClick("about")}
              >
                <span className="mobile-menu-japanese">(二)</span>
                <span className="mobile-menu-text">ABOUT</span>
              </motion.div>
              
              <motion.div 
                className="mobile-menu-item"
                custom={2}
                variants={menuItemVariants}
                onClick={() => handleNavClick("skills")}
              >
                <span className="mobile-menu-japanese">(三)</span>
                <span className="mobile-menu-text">SKILLS</span>
              </motion.div>
              
              <motion.div 
                className="mobile-menu-item"
                custom={3}
                variants={menuItemVariants}
                onClick={() => handleNavClick("projects")}
              >
                <span className="mobile-menu-japanese">十</span>
                <span className="mobile-menu-text">PROJECTS</span>
              </motion.div>
              
              <motion.div 
                className="mobile-menu-item"
                custom={4}
                variants={menuItemVariants}
                onClick={() => handleNavClick("contact")}
              >
                <span className="mobile-menu-japanese">(五)</span>
                <span className="mobile-menu-text">CONTACT</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 