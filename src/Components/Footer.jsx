import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3 className="footer-heading">GoRide</h3>
          <p className="footer-text">
            GoRide is your urban mobility companion, designed to deliver fast, reliable rides and seamless service across every city route.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-list">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/services" className="footer-link">Our Services</Link></li>
            <li><Link to="/blog" className="footer-link">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-list">
            <li><Link to="/help" className="footer-link">Help Center</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h3 className="footer-heading">Newsletter</h3>
          <p className="footer-text">Stay updated with our latest offer.</p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit" className="newsletter-button" aria-label="Send email">
              <span className="send-icon" aria-hidden="true">&#10148;</span>
            </button>
          </form>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p>&copy; Copyright 2026, GoRide. All right reserved.</p>
      </div>
    </footer>
  )
}

export default Footer