"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileProjects() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null)

  const toggleProject = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index)
  }

  return (
    <section id="mobile-projects" className="mobile-section">
      <div className="mobile-section-title">
        <span className="mobile-section-japanese">十</span>
        <h2 className="mobile-section-heading">Projects</h2>
      </div>
      
      <div className="mobile-projects-list">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className={`mobile-project-card ${expandedProject === index ? 'expanded' : ''}`}
            onClick={() => toggleProject(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="mobile-project-header">
              <div className="mobile-project-year">{project.year}</div>
              <div className="mobile-project-number">/ P.{String(index + 1).padStart(2, '0')}</div>
            </div>
            
            <h3 className="mobile-project-title">{project.title}</h3>
            
            <AnimatePresence>
              {expandedProject === index && (
                <motion.div 
                  className="mobile-project-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mobile-project-description">{project.description}</p>
                  
                  <div className="mobile-project-tools">
                    {project.tools.map((tool, toolIndex) => (
                      <span key={toolIndex}>{tool}</span>
                    ))}
                  </div>
                  
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mobile-project-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Project data
const projects = [
  {
    title: "NYC Vehicle Collisions Analysis",
    description: "Data analysis project examining vehicle collision patterns in New York City. Features interactive visualizations, statistical analysis, and geographic mapping of accident hotspots to identify trends and potential safety improvements.",
    link: "https://github.com/gil10101/Vehicle-Collisions-Visualization",
    tools: ["Python", "Numpy", "Pandas", "Matplotlib"],
    year: "2024"
  },
  {
    title: "Personal Expense Tracker",
    description: "Web application to help users track and manage personal finances. Features include expense categorization, budget planning, spending analytics, and visual reports to improve financial awareness and decision-making.",
    link: "https://github.com/gil10101/sokin",
    tools: ["NextJS", "TailwindCSS", "Firebase", "React"],
    year: "2024"
  },
  {
    title: "Spotify School Playlist Generator",
    description: "Collaborative platform where students share their top Spotify tracks to create school-specific playlists. The app aggregates listening data to automatically generate curated collections reflecting each school's unique music identity.",
    link: "https://github.com/gil10101/SpotifySchools",
    tools: ["NodeJS", "Firebase", "Spotify API", "React"],
    year: "2023"
  },
  {
    title: "Let's Match",
    description: "Social networking platform designed to connect people with similar interests and goals. Features include personality matching algorithms, interest-based recommendations, and communication tools to facilitate meaningful connections.",
    link: "https://github.com/letsmatch4900/Project-Lets-Match",
    tools: ["NodeJS", "React", "Firebase", "CSS"],
    year: "2024"
  },
  {
    title: "Customer Churn Analysis",
    description: "Machine learning project that analyzes customer behavior patterns to predict potential churn. Utilizes statistical models and predictive analytics to identify at-risk customers and recommend retention strategies.",
    link: "https://github.com/gil10101/Customer-Churn-Analysis-and-Prediction",
    tools: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
    year: "2023"
  }
] 