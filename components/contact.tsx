"use client"

import type React from "react"

import { useState, type FormEvent } from "react"

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormState({
        name: "",
        email: "",
        message: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Contact Me</h2>
        <div className="contact-content">
          <div className="contact-info">
            <p>
              I'm always open to new opportunities and growing through new experiences. 
              Feel free to reach out if you'd like to connect, collaborate, or 
              just want to say hello!
            </p>
            <p>
              You can contact me directly at <strong>gillu1212@gmail.com</strong> or through this form.
            </p>
            
            <div className="social-links" style={{ marginTop: "120px" }}>
              <a href="https://linkedin.com/in/profile" target="_blank" rel="noopener noreferrer" className="social-link" style={{ 
                display: "block", 
                marginBottom: "32px", 
                backgroundImage: "linear-gradient(90deg, #ffffff 0%, #e5e5e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                LinkedIn
              </a>
              <a href="mailto:gillu1212@gmail.com" className="social-link" style={{ 
                display: "block", 
                marginBottom: "32px", 
                backgroundImage: "linear-gradient(90deg, #ffffff 0%, #e5e5e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                gillu1212@gmail.com
              </a>
              <a href="https://github.com/gil10101" target="_blank" rel="noopener noreferrer" className="social-link" style={{ 
                display: "block", 
                backgroundImage: "linear-gradient(90deg, #ffffff 0%, #e5e5e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                GitHub
              </a>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              
              <div className={`success-message ${showSuccess ? "visible" : ""}`}>
                Thank you for your message! I'll get back to you soon.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
