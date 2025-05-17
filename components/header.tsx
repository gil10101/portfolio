"use client"

import { useState, useEffect } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      <div className="logo">
        <span className={`greeting font-semibold text-lg ${scrolled ? 'text-gray-100' : 'text-gray-900'}`}>Hey, I'm Gil</span>
      </div>
      <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav className={mobileMenuOpen ? 'nav-open' : ''}>
        <ul>
          <li>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className={scrolled ? 'text-gray-100' : 'text-gray-900'}>About</a>
          </li>
          <li>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className={scrolled ? 'text-gray-100' : 'text-gray-900'}>Projects</a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={scrolled ? 'text-gray-100' : 'text-gray-900'}>Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
