"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from './AnimatedText';
import KineticTypography from './KineticTypography';
import { useProjects } from './ProjectsContext';

export default function Projects() {
  const { isExpanded } = useProjects();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const toggleProject = (index: number) => {
    setSelectedProject(selectedProject === index ? null : index);
  };

  return (
    <section id="projects" className={`projects ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="container">
        <div className="section-title-container">
          <div className="section-title">
            <span className="japanese">十</span>
            <h2>Projects</h2>
          </div>
          <div className="section-title-line"></div>
        </div>
        
        <div className="projects-section">
          {/* Display all projects in a vertical list */}
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={`project-item ${selectedProject === index ? 'selected' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => toggleProject(index)}
            >
              <div className="project-year">{project.year}</div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-number">/ P.{String(index + 1).padStart(2, '0')}</div>
                
                {/* Expanded project details */}
                <AnimatePresence>
                  {selectedProject === index && (
                    <motion.div 
                      className="project-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="project-description">{project.description}</p>
                      
                      <div className="project-tools">
                        {project.tools.map((tool, toolIndex) => (
                          <span key={toolIndex}>{tool}</span>
                        ))}
                      </div>
                      
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="project-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Updated project data with years
const projects = [
  {
    title: "NYC Vehicle Collisions Analysis",
    description: "Data analysis project examining vehicle collision patterns in New York City. Features interactive visualizations, statistical analysis, and geographic mapping of accident hotspots to identify trends and potential safety improvements.",
    shortDescription: "Data analysis project with interactive visualizations of NYC vehicle collision patterns.",
    link: "https://github.com/gil10101/Vehicle-Collisions-Visualization",
    tools: ["Python", "Numpy", "Seaborn", "Folium", "Scipy", "Pandas", "Matplotlib", "Geopandas"],
    tags: ["DATA ANALYSIS", "VISUALIZATION"],
    year: "2024"
  },
  {
    title: "Personal Expense Tracker",
    description: "Web application to help users track and manage personal finances. Features include expense categorization, budget planning, spending analytics, and visual reports to improve financial awareness and decision-making.",
    shortDescription: "Finance tracking web app with analytics and budget planning.",
    link: "https://github.com/gil10101/sokin",
    tools: ["NextJS", "TailwindCSS", "Firebase", "React", "Typescript", "AWS"],
    tags: ["WEB APP", "FINANCIAL TOOL"],
    year: "2024"
  },
  {
    title: "Spotify School Playlist Generator",
    description: "Collaborative platform where students share their top Spotify tracks to create school-specific playlists. The app aggregates listening data to automatically generate curated collections reflecting each school's unique music identity and preferences.",
    shortDescription: "Collaborative platform generating school-specific Spotify playlists.",
    link: "https://github.com/gil10101/SpotifySchools",
    tools: ["NodeJS", "Firebase", "Spotify API", "React", "TailwindCSS"],
    tags: ["API INTEGRATION", "MUSIC"],
    year: "2023"
  },
  {
    title: "Let's Match",
    description: "Social networking platform designed to connect people with similar interests and goals. Features include personality matching algorithms, interest-based recommendations, and communication tools to facilitate meaningful connections.",
    shortDescription: "Social platform connecting users with similar interests and goals.",
    link: "https://github.com/letsmatch4900/Project-Lets-Match",
    tools: ["NodeJS", "React", "Firebase", "CSS", "HTML"],
    tags: ["SOCIAL NETWORK", "FRONTEND"],
    year: "2024"
  },
  {
    title: "Customer Churn Analysis and Prediction",
    description: "Machine learning project that analyzes customer behavior patterns to predict potential churn. Utilizes statistical models and predictive analytics to identify at-risk customers and recommend retention strategies.",
    shortDescription: "ML project predicting customer churn with predictive analytics.",
    link: "https://github.com/gil10101/Customer-Churn-Analysis-and-Prediction",
    tools: ["Python", "SQLite", "TensorFlow", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "SciPy"],
    tags: ["MACHINE LEARNING", "PREDICTION"],
    year: "2023"
  },
  {
    title: "License Plate Recognition System",
    description: "Computer vision application that detects and recognizes vehicle license plates from images and video streams. Implements deep learning models and optical character recognition to extract plate information for various applications.",
    shortDescription: "CV application for license plate detection using deep learning.",
    link: "https://github.com/gil10101/License-Plate-Recognition-System",
    tools: ["Python", "TensorFlow", "Flask", "SSD", "Tessact OCR", "OpenCV"],
    tags: ["COMPUTER VISION", "DEEP LEARNING"],
    year: "2023"
  },
  {
    title: "ThreeJS Objects Repository",
    description: "Collection of 3D objects and interactive scenes created using Three.js. Features a variety of geometries, materials, lighting effects, and animations demonstrating the capabilities of WebGL for creating immersive web experiences.",
    shortDescription: "3D object collection demonstrating WebGL capabilities.",
    link: "https://github.com/gil10101/Sphere",
    tools: ["JavaScript", "Three.js", "GSAP"],
    tags: ["3D", "WEBGL"],
    year: "2022"
  },
  {
    title: "Fibonacci Spiral Generator",
    description: "Python application that generates and visualizes Fibonacci spirals with customizable parameters. Creates mathematically accurate spiral patterns based on the Fibonacci sequence and golden ratio, with options for different visualization styles.",
    shortDescription: "Python application generating customizable Fibonacci spirals.",
    link: "https://github.com/gil10101/fibonacci",
    tools: ["Python", "NumPy", "Pillow", "SciPy", "Matplotlib", "Manim"],
    tags: ["VISUALIZATION", "MATHEMATICS"],
    year: "2022"
  }
]; 