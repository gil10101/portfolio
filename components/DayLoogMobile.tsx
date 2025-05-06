"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useProjects } from './ProjectsContext'

export default function DayLoogMobile() {
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
  
  const entries = [
    {
      id: 1,
      date: 'Mar 7, 2023',
      title: '사소이야기 (1-7)',
      image: '/images/blog1.jpg'
    },
    {
      id: 2,
      date: 'Apr 2, 2023',
      title: '주승근 (1-11)',
      image: '/images/blog2.jpg'
    },
    {
      id: 3,
      date: 'Mar 26, 2023',
      title: '동계 애프터파티의 의혹을 담은 명',
      image: '/images/blog3.jpg'
    },
    {
      id: 4,
      date: 'Mar 26, 2023',
      title: '영혼과 육체와 빛의 이야',
      image: '/images/blog4.jpg'
    },
    {
      id: 5,
      date: 'Mar 26, 2023',
      title: '보여주는 정보 유출',
      image: '/images/blog5.jpg'
    },
    {
      id: 6,
      date: 'Mar 26, 2023',
      title: '각자의 장벽같은 전에 나머지 다 같',
      image: '/images/blog6.jpg'
    },
    {
      id: 7,
      date: 'Mar 26, 2023',
      title: '나는 포토포리오가 마음에듬',
      image: '/images/blog7.jpg'
    }
  ]

  return (
    <div className="day-loog-container" ref={containerRef}>
      {/* Background overlay */}
      <div className={`mobile-background ${scrollActive ? 'active' : ''}`}></div>
      
      {/* Decorative background elements */}
      <div className="mobile-decorative-element"></div>
      <div className="mobile-decorative-element"></div>
      
      <div className="day-loog-header">
        <h2 className="day-loog-title">DAY LOOG</h2>
        <div className="day-loog-menu">
          <span>ImageMode</span>
        </div>
      </div>
      
      <div className="day-loog-entries">
        {entries.map(entry => (
          <div key={entry.id} className="day-loog-entry">
            <div className="day-loog-entry-thumbnail">
              {entry.image && (
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                  {/* Placeholder for image - in a real app, you'd use Next.js Image component */}
                </div>
              )}
            </div>
            <div className="day-loog-entry-content">
              <div className="day-loog-entry-date">{entry.date}</div>
              <h3 className="day-loog-entry-title">{entry.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 