"use client"

import { useState } from "react"

export default function Skills() {
  const [expanded, setExpanded] = useState(false)

  const toggleSkills = () => {
    setExpanded(!expanded)
  }

  return (
    <section id="skills" className="skills" aria-label="Skills section">
      <div className="container">
        <h2>Skills</h2>
        
        <div className={`skills-content ${expanded ? 'expanded' : 'collapsed'}`} 
             aria-expanded={expanded}>
          {/* Frontend Category */}
          <div className="skill-category">
            <h3>Languages</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/python.svg" 
                    alt="Python"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Python</h4>
                  <p>General-purpose programming</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/java.svg" 
                    alt="Java"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Java</h4>
                  <p>Object-oriented programming language</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/sql.svg" 
                    alt="SQL"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>SQL</h4>
                  <p>Database query language</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/r.svg" 
                    alt="R"
                    style={{ filter: 'grayscale(100%) brightness(0.3) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>R</h4>
                  <p>Statistical computing language</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/javascript.svg" 
                    alt="JavaScript"
                    style={{ filter: 'grayscale(100%) brightness(0.5) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>JavaScript</h4>
                  <p>Web development language</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Backend Category */}
          <div className="skill-category">
            <h3>Technologies</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/firebase.svg" 
                    alt="Firebase"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Firebase</h4>
                  <p>Backend cloud platform</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/aws.svg" 
                    alt="AWS"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>AWS</h4>
                  <p>Cloud computing service</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/mongodb.svg" 
                    alt="MongoDB Compass"
                    style={{ filter: 'brightness(0.5) invert(1) grayscale(100%)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>MongoDB Compass</h4>
                  <p>Database management tool</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/git.svg" 
                    alt="Git"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Git</h4>
                  <p>Version control system</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Categories */}
          <div className="skill-category">
            <h3>Libraries</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/react.svg" 
                    alt="ReactJS"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>ReactJS</h4>
                  <p>UI component library</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/matplotlib-white.svg" 
                    alt="Matplotlib"
                  />
                </div>
                <div className="skill-content">
                  <h4>Matplotlib</h4>
                  <p>Data visualization library</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/seaborn.svg" 
                    alt="Seaborn"
                    width={48}
                    height={48}
                    style={{ filter: 'grayscale(100%)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Seaborn</h4>
                  <p>Statistical data visualization</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/pandas.svg" 
                    alt="Pandas"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Pandas</h4>
                  <p>Data analysis tool</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/numpy.svg" 
                    alt="NumPy"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>NumPy</h4>
                  <p>Numerical computing library</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/threejs.svg" 
                    alt="Three.js"
                    style={{ filter: 'grayscale(100%)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>Three.js</h4>
                  <p>3D graphics library</p>
                </div>
              </div>
              
              <div className="skill-card">
                <div className="skill-icon">
                  <img 
                    src="/icons/tensorflow.svg" 
                    alt="TensorFlow"
                    style={{ filter: 'grayscale(100%)' }}
                  />
                </div>
                <div className="skill-content">
                  <h4>TensorFlow</h4>
                  <p>Machine learning library</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="toggle-container">
          <button 
            className="toggle-button"
            onClick={toggleSkills}
            aria-label={expanded ? "Collapse skills" : "Expand skills"}
            aria-controls="skills-content"
          >
            <span className={`toggle-arrow ${expanded ? 'expanded' : ''}`}>
              {expanded ? '▲' : '▼'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
} 