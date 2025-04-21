"use client"

import { useEffect, useRef } from "react"
import FibonacciSphere from "@/components/fibonacci-sphere"
import Header from "@/components/header"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Contact from "@/components/contact"

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add scroll event listener for animations if needed
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (mainRef.current) {
        // Add scroll-based animations here if needed
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="app" ref={mainRef}>
      {/* Background Fibonacci Sphere */}
      <div className="background-canvas">
        <FibonacciSphere />
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
