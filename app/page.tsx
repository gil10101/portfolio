"use client"

import { useEffect, useRef, useState } from "react"
import FibonacciSphere from "@/components/fibonacci-sphere"
import RubiksCube from "@/components/rubik's-cube"
import Header from "@/components/header"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Contact from "@/components/contact"

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      return mobile
    }
    
    // Initial check
    checkMobile()
    
    // Add scroll event listener for animations if needed
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (mainRef.current) {
        // Add scroll-based animations here if needed
      }
    }

    // Handle window resize to recheck mobile status
    const handleResize = () => {
      checkMobile()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="app" ref={mainRef}>
      {/* Background Animation - Conditional based on device type */}
      <div className="background-canvas">
        {isMobile ? <RubiksCube isBackground={true} /> : <FibonacciSphere />}
      </div>
      
      <Header />
      <section className="hero">
      </section>
      <About />
      <Projects />
      <Skills />
      <Contact />
    </div>
  )
}
