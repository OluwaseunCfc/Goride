import React, { useContext, useEffect, useState } from 'react'
import img from '../assets/taxi.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const h1Texts = [
  "Book a ride anywhere",
  "Safe rides always",
  "Verified drivers only",
];

function Banner() {
  const { isAuthenticated, isDriver } = useContext(AuthContext);
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Signed-in users shouldn't be sent back to the login screen.
  const primaryCta = !isAuthenticated
    ? { to: '/login', label: 'Book a Ride' }
    : isDriver
      ? { to: '/dashboard', label: 'View Ride Requests' }
      : { to: '/book-ride', label: 'Book a Ride' };

  useEffect(() => {
    const currentText = h1Texts[textIndex];

    if (!isDeleting && displayed === currentText) {
      // Fully typed — wait 2 seconds then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setTextIndex(prev => (prev + 1) % h1Texts.length);
      return;
    }

    const speed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      setDisplayed(prev =>
        isDeleting
          ? prev.slice(0, -1)
          : currentText.slice(0, prev.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, textIndex]);

  return (
    <div>
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-eyebrow">#1 Ride Service in the City</span>

          <h1 id='banner-heading'>
            {displayed}
            <span className="typing-cursor">|</span>
          </h1>

          <p>
            Safe, fast and reliable taxi service anytime.<br />
            Experience the new standard of urban mobility with GoRide.
          </p>

          <div className="banner-buttons">
            <Link to={primaryCta.to} className='banner-btn'>{primaryCta.label}</Link>
            {!isAuthenticated ? (
              <Link to="/signup" className='banner-btn outline'>Become a Driver</Link>
            ) : (
              <Link to="/dashboard" className='banner-btn outline'>Go to Dashboard</Link>
            )}
          </div>

          <div className="banner-stats">

            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Happy Riders</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Drivers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.7★</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="banner-img">
          <img src={img} alt="Banner img" />
        </div>
      </div>
    </div>
  )
}

export default Banner