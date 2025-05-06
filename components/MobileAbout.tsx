"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function MobileAbout() {
  return (
    <section id="mobile-about" className="mobile-section">
      <div className="mobile-section-title">
        <span className="mobile-section-japanese">(二)</span>
        <h2 className="mobile-section-heading">About Me</h2>
      </div>
      
      <motion.div 
        className="mobile-about-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p>
          I'm a passionate full-stack developer with a strong focus on data analysis. 
          My expertise includes Python, SQL, React, and working with various data visualization tools and database technologies.
        </p>
        
        <p>
          I believe in writing clean, maintainable code and creating intuitive user experiences. 
          When I'm not coding, you can find me exploring new technologies, visiting art galleries, 
          or bouldering at my local climbing gym.
        </p>
      </motion.div>
    </section>
  )
} 