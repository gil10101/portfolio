"use client"

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';
import KineticTypography from './KineticTypography';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title-container">
          <div className="section-title">
            <span className="japanese">(二)</span>
            <h2>About Me</h2>
          </div>
          <div className="section-title-line"></div>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <KineticTypography textStyle="reveal" delay={0.1}>
              <p>
                I'm a passionate full-stack developer with a strong focus on data analysis. 
                My expertise includes Python, SQL, React, and working with various data visualization tools and database technologies.
              </p>
            </KineticTypography>
            
            <KineticTypography textStyle="reveal" delay={0.3}>
              <p>
                I believe in writing clean, maintainable code and creating intuitive user experiences. 
                When I'm not coding, you can find me exploring new technologies, visiting art galleries, 
                or bouldering at my local climbing gym.
              </p>
            </KineticTypography>
          </div>
          <div className="about-image">
            <motion.div 
              className="image-placeholder"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
