import React from 'react';

export default function Projects() {
  const [showAll, setShowAll] = React.useState(false);
  
  const toggleProjects = (show: boolean) => {
    setShowAll(show);
  };
  
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Projects</h2>
        <div className="projects-grid">
          {/* First 6 projects (always visible) */}
          {projects.slice(0, 6).map((project, index) => (
            <a 
              key={index} 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-card"
              onClick={(e) => {
                if (!project.link) {
                  e.preventDefault();
                }
              }}
            >
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tools">
                {project.tools.map((tool, toolIndex) => (
                  <span key={toolIndex}>{tool}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
        
        {/* Additional projects container with transition */}
        <div className={`additional-projects ${showAll ? 'expanded' : 'collapsed'}`}>
          <div className="projects-grid">
            {projects.slice(6).map((project, index) => (
              <a 
                key={index + 6} 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-card"
                onClick={(e) => {
                  if (!project.link) {
                    e.preventDefault();
                  }
                }}
              >
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tools">
                  {project.tools.map((tool, toolIndex) => (
                    <span key={toolIndex}>{tool}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="view-more-container">
          {!showAll ? (
            <button 
              className="view-button view-more-button"
              onClick={() => toggleProjects(true)}
            >
              View More
            </button>
          ) : (
            <button 
              className="view-button view-less-button"
              onClick={() => toggleProjects(false)}
            >
              View Less
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// Sample project data
const projects = [
  {
    title: "NYC Vehicle Collisions Analysis",
    description: "Data analysis project examining vehicle collision patterns in New York City. Features interactive visualizations, statistical analysis, and geographic mapping of accident hotspots to identify trends and potential safety improvements.",
    link: "https://github.com/gil10101/Vehicle-Collisions-Visualization",
    tools: ["Python", "Numpy", "Seaborn", "Folium", "Scipy", "Pandas", "Matplotlib", "Geopandas"]
  },
  {
    title: "Personal Expense Tracker",
    description: "Web application to help users track and manage personal finances. Features include expense categorization, budget planning, spending analytics, and visual reports to improve financial awareness and decision-making.",
    link: "https://github.com/gil10101/sokin",
    tools: ["NextJS", "TailwindCSS", "Firebase", "React", "Typescript", "AWS"]
  },
  {
    title: "Spotify School Playlist Generator",
    description: "Collaborative platform where students share their top Spotify tracks to create school-specific playlists. The app aggregates listening data to automatically generate curated collections reflecting each school's unique music identity and preferences.",
    link: "https://github.com/gil10101/SpotifySchools",
    tools: ["NodeJS", "Firebase", "Spotify API", "React", "TailwindCSS"]
  },
  {
    title: "Let's Match",
    description: "Social networking platform designed to connect people with similar interests and goals. Features include personality matching algorithms, interest-based recommendations, and communication tools to facilitate meaningful connections.",
    link: "https://github.com/letsmatch4900/Project-Lets-Match",
    tools: ["NodeJS", "React", "Firebase", "CSS", "HTML"]
  },
  {
    title: "Customer Churn Analysis and Prediction",
    description: "Machine learning project that analyzes customer behavior patterns to predict potential churn. Utilizes statistical models and predictive analytics to identify at-risk customers and recommend retention strategies.",
    link: "https://github.com/gil10101/Customer-Churn-Analysis-and-Prediction",
    tools: ["Python", "SQLite", "TensorFlow", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "SciPy"]
  },
  {
    title: "License Plate Recognition System",
    description: "Computer vision application that detects and recognizes vehicle license plates from images and video streams. Implements deep learning models and optical character recognition to extract plate information for various applications.",
    link: "https://github.com/gil10101/License-Plate-Recognition-System",
    tools: ["Python", "TensorFlow", "Flask", "SSD", "Tessact OCR", "OpenCV"]
  },
  {
    title: "ThreeJS Objects Repository",
    description: "Collection of 3D objects and interactive scenes created using Three.js. Features a variety of geometries, materials, lighting effects, and animations demonstrating the capabilities of WebGL for creating immersive web experiences.",
    link: "https://github.com/gil10101/Sphere",
    tools: ["JavaScript", "Three.js", "GSAP"]
  },
  {
    title: "Fibonacci Spiral Generator",
    description: "Python application that generates and visualizes Fibonacci spirals with customizable parameters. Creates mathematically accurate spiral patterns based on the Fibonacci sequence and golden ratio, with options for different visualization styles.",
    link: "https://github.com/gil10101/fibonacci",
    tools: ["Python", "NumPy", "Pillow", "SciPy", "Matplotlib", "Manim"]
  }
]; 