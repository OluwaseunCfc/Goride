import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuArrowLeft, LuArrowRight, LuStar } from 'react-icons/lu'
import { AuthContext } from '../Context/AuthContext'
import slideOne from '../assets/carousel 1.png'
import slideTwo from '../assets/carousel 2.png'
import slideThree from '../assets/carousel 3.png'
import slideFour from '../assets/carousel 4.png'

const slides = [
  {
    image: slideOne,
    title: <>Your Ride,<br /><span>Our Priority.</span></>,
    description: <>Safe, reliable and affordable rides<br className="desktop-break" /> designed to get you where you need to go.</>,
  },
  {
    image: slideTwo,
    title: <>Ride With<br /><span>Confidence.</span></>,
    description: <>Every journey starts with a trusted and verified driver.</>,
  },
  {
    image: slideThree,
    title: <>Fair Prices.<br /><span>No Surprises.</span></>,
    description: <>Enjoy affordable, transparent fares for your everyday journeys across Lagos.</>,
  },
  {
    image: slideFour,
    title: <>Your Destination<br /><span>Is Just a Few Taps Away.</span></>,
    description: <>Enter your pickup location, choose your destination and book your ride with ease.</>,
  },
]

function Banner() {
  const { isAuthenticated, isDriver } = useContext(AuthContext)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStart = useRef(null)

  // Signed-in users shouldn't be sent back to the login screen.
  const primaryCta = !isAuthenticated
    ? { to: '/login', label: 'Book a Ride' }
    : isDriver
      ? { to: '/dashboard', label: 'View Ride Requests' }
      : { to: '/book-ride', label: 'Book a Ride' }

  const changeSlide = useCallback((direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => changeSlide(1), 5500)
    return () => window.clearInterval(timer)
  }, [changeSlide, isPaused])

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return

    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) changeSlide(distance > 0 ? -1 : 1)
    touchStart.current = null
  }

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="GoRide services"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slides" aria-live="polite">
        {slides.map((slide, index) => (
          <article
            className={`hero-slide ${index === activeSlide ? 'is-active' : ''}`}
            key={slide.image}
            aria-hidden={index !== activeSlide}
            style={{ backgroundImage: `url("${slide.image}")` }}
          >
            <div className="hero-overlay" />
            <div className="hero-inner">
              <div className="hero-copy">
                <span className="hero-eyebrow"><LuStar aria-hidden="true" /> #1 Ride Service in Lagos</span>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <Link to={primaryCta.to} className="hero-cta" tabIndex={index === activeSlide ? 0 : -1}>
                  {primaryCta.label}<span aria-hidden="true"><LuArrowRight /></span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hero-dots" role="group" aria-label="Choose a slide">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            className={index === activeSlide ? 'is-active' : ''}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeSlide ? 'true' : undefined}
          />
        ))}
      </div>

      <div className="hero-arrows">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide"><LuArrowLeft /></button>
        <button type="button" className="next" onClick={() => changeSlide(1)} aria-label="Next slide"><LuArrowRight /></button>
      </div>

      {/* <div className="hero-benefits" aria-label="Service benefits">
        <span className="active">Ride</span>
        <span>Safety</span>
        <span>Affordable</span>
        <span>Easy Booking</span>
      </div> */}
    </section>
  )
}

export default Banner