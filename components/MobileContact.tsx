"use client"

import { useState } from "react"
import type React from "react"

export default function MobileContact() {
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
    <section id="mobile-contact" className="mobile-section">
      <div className="mobile-section-title">
        <span className="mobile-section-japanese">(五)</span>
        <h2 className="mobile-section-heading">Contact</h2>
      </div>
      
      <div className="contact-flex-container">
        <div className="contact-info">
          <p>
            I'm always open to new opportunities and growing through new experiences. 
            Feel free to reach out if you'd like to connect, collaborate, or 
            just want to say hello!
          </p>
          <p>
            You can contact me directly at <strong>email@email.com</strong> or through this form.
          </p>
        </div>
        
        <div className="social-links">
          <a href="https://linkedin.com/in/profile" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:email@email.com">
            email@email.com
          </a>
          <a href="https://github.com/gil10101" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
      
      <div className="contact-form">
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label htmlFor="mobile-name">Name</label>
            <input
              type="text"
              id="mobile-name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="contact-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile-email">Email</label>
            <input
              type="email"
              id="mobile-email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
              placeholder="Your email address"
              className="contact-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile-message">Message</label>
            <textarea
              id="mobile-message"
              name="message"
              rows={4}
              value={formState.message}
              onChange={handleChange}
              required
              placeholder="Your message"
              className="contact-input"
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
    </section>
  )
} 