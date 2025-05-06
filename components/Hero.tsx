"use client"

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';
import KineticTypography from './KineticTypography';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div className="hero-title-wrapper">
            <AnimatedText 
              text="JOHN DOE" 
              type="heading1" 
              splitType="letters"
              animationType="wave"
              className="hero-title"
            />
            <motion.div
              className="portfolio-label"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              (PORTFOLIO)
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <KineticTypography textStyle="float">
            <p className="hero-subtitle">
              Full Stack Developer & Data Analyst
            </p>
          </KineticTypography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="hero-cta"
        >
          <motion.a 
            href="#projects"
            className="primary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          
          <motion.a 
            href="#contact"
            className="secondary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 