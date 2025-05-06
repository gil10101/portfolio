"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './header'
import MenuToggle from './MenuToggle'
import FullscreenMenu from './FullscreenMenu'
import { useProjects } from './ProjectsContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggleExpand } = useProjects()
  
  return (
    <div className="site-container">
      <Header />
      <div className="content-wrapper">
        <AnimatePresence mode="wait">
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="main-content"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="japanese-numerals">
            <a href="#" className="sidebar-item">
              <span className="japanese-char">(一)</span>
              <span className="sidebar-text">HOME</span>
            </a>
            <a href="#about" className="sidebar-item">
              <span className="japanese-char">(二)</span>
              <span className="sidebar-text">ABOUT</span>
            </a>
            <a href="#skills" className="sidebar-item">
              <span className="japanese-char">(三)</span>
              <span className="sidebar-text">SKILLS</span>
            </a>
            <a href="#contact" className="sidebar-item">
              <span className="japanese-char">(四)</span>
              <span className="sidebar-text">CONTACT</span>
            </a>
            <div style={{ marginTop: "2rem" }}></div>
            <div 
              className="sidebar-item"
              onClick={toggleExpand}
              style={{ cursor: 'pointer' }}
            >
              <span className="japanese-char">十</span>
              <span className="sidebar-text">PROJECTS</span>
            </div>
          </div>
        </div>
      </div>
      <MenuToggle isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)} />
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}