"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileSkills() {
  const [expanded, setExpanded] = useState(false)

  const toggleSkills = () => {
    setExpanded(!expanded)
  }

  return (
    <section id="mobile-skills" className="mobile-section">
      <div className="mobile-section-title">
        <span className="mobile-section-japanese">(三)</span>
        <h2 className="mobile-section-heading">Skills</h2>
      </div>
      
      <AnimatePresence>
        <div className={`mobile-skills-content ${expanded ? 'expanded' : 'collapsed'}`}>
          {/* Languages Category */}
          <div className="mobile-skill-category">
            <h3>Languages</h3>
            <div className="mobile-skills-grid">
              <motion.div 
                className="mobile-skill-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="mobile-skill-icon">P</div>
                <div className="mobile-skill-info">
                  <h4>Python</h4>
                  <p>General-purpose programming</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="mobile-skill-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mobile-skill-icon">J</div>
                <div className="mobile-skill-info">
                  <h4>JavaScript</h4>
                  <p>Web development language</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="mobile-skill-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mobile-skill-icon">S</div>
                <div className="mobile-skill-info">
                  <h4>SQL</h4>
                  <p>Database query language</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="mobile-skill-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="mobile-skill-icon">J</div>
                <div className="mobile-skill-info">
                  <h4>Java</h4>
                  <p>Object-oriented programming language</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="mobile-skill-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="mobile-skill-icon">R</div>
                <div className="mobile-skill-info">
                  <h4>R</h4>
                  <p>Statistical computing language</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Technologies Category */}
          {expanded && (
            <div className="mobile-skill-category">
              <h3>Technologies</h3>
              <div className="mobile-skills-grid">
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">R</div>
                  <div className="mobile-skill-info">
                    <h4>React</h4>
                    <p>UI component library</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">N</div>
                  <div className="mobile-skill-info">
                    <h4>NextJS</h4>
                    <p>React framework</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">F</div>
                  <div className="mobile-skill-info">
                    <h4>Firebase</h4>
                    <p>Backend cloud platform</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">A</div>
                  <div className="mobile-skill-info">
                    <h4>AWS</h4>
                    <p>Cloud computing service</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">M</div>
                  <div className="mobile-skill-info">
                    <h4>MongoDB Compass</h4>
                    <p>Database management tool</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">G</div>
                  <div className="mobile-skill-info">
                    <h4>Git</h4>
                    <p>Version control system</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Libraries Category */}
          {expanded && (
            <div className="mobile-skill-category">
              <h3>Libraries</h3>
              <div className="mobile-skills-grid">
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">T</div>
                  <div className="mobile-skill-info">
                    <h4>TensorFlow</h4>
                    <p>Machine learning library</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">T</div>
                  <div className="mobile-skill-info">
                    <h4>Three.js</h4>
                    <p>3D graphics library</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">M</div>
                  <div className="mobile-skill-info">
                    <h4>Matplotlib</h4>
                    <p>Data visualization library</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">S</div>
                  <div className="mobile-skill-info">
                    <h4>Seaborn</h4>
                    <p>Statistical data visualization</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">P</div>
                  <div className="mobile-skill-info">
                    <h4>Pandas</h4>
                    <p>Data analysis tool</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mobile-skill-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="mobile-skill-icon">N</div>
                  <div className="mobile-skill-info">
                    <h4>NumPy</h4>
                    <p>Numerical computing library</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </AnimatePresence>
      
      <div className="mobile-toggle-container">
        <motion.button 
          className="mobile-toggle-button"
          onClick={toggleSkills}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`mobile-toggle-arrow ${expanded ? 'expanded' : ''}`}>
            {expanded ? '▲ Show Less' : '▼ Show More'}
          </span>
        </motion.button>
      </div>
    </section>
  )
} 