"use client"

import React, { useState, useEffect, useRef } from 'react'
import MobileFibonacciSphere from './MobileFibonacciSphere'
import MobileAbout from './MobileAbout'
import MobileSkills from './MobileSkills'
import MobileProjects from './MobileProjects'
import MobileContact from './MobileContact'
import MobileHamburgerMenu from './MobileHamburgerMenu'
import FibonacciSphere from './fibonacci-sphere'

export default function PortfolioMobile() {
  const [scrollActive, setScrollActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Handle scroll to activate background overlay
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      // Activate background when scrolled 50px or more
      if (window.scrollY > 50) {
        setScrollActive(true)
      } else {
        setScrollActive(false)
      }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Initial check
    handleScroll()
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(`mobile-${sectionId}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="portfolio-mobile-container" ref={containerRef}>
      {/* Background overlay */}
      <div className={`mobile-background ${scrollActive ? 'active' : ''}`}></div>
      
      {/* Decorative background elements */}
      <div className="mobile-decorative-element"></div>
      <div className="mobile-decorative-element"></div>
      
      <header className="portfolio-mobile-header">
        <div className="portfolio-mobile-name">John Doe</div>
        <div className="portfolio-mobile-title">DEVELOPER / DATA ANALYST</div>
        
        {/* Hamburger Menu */}
        <MobileHamburgerMenu scrollToSection={scrollToSection} />
      </header>
      
      <div className="portfolio-mobile-hero" id="mobile-hero">
        
        {/* Hero Image */}
        {/* <img src="/hero.png" alt="Hero Image" className="mobile-hero-image" /> */}
        
        <FibonacciSphere />

        
      </div>
      
      {/* About Section */}
      <MobileAbout />
      
      {/* Skills Section */}
      <MobileSkills />
      
      {/* Projects Section */}
      <MobileProjects />
      
      {/* Contact Section */}
      <MobileContact />
    </div>
  )
} 