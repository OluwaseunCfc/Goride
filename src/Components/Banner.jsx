import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  LuArrowLeft,
  LuArrowRight,
  LuStar,
  LuShieldCheck,
  LuCircleDollarSign,
  LuClock3,
  LuMapPin,
} from 'react-icons/lu'
import { AuthContext } from '../Context/AuthContext'

import slideOne from '../assets/carousel 1.png'
import slideTwo from '../assets/carousel 2.png'
import slideThree from '../assets/carousel 3.png'
import slideFour from '../assets/carousel 4.png'

const slides = [
  {
    image: slideOne,
    shortTitle: 'Ride',
    title: (
      <>
        Your Ride,
        <br />
        <span>Our Priority.</span>
      </>
    ),
    description: (
      <>
        Safe, reliable and affordable rides
        <br className="desktop-break" />
        designed to get you where you need to go.
      </>
    ),
  },
  {
    image: slideTwo,
    shortTitle: 'Safety',
    title: (
      <>
        Ride With
        <br />
        <span>Confidence.</span>
      </>
    ),
    description: (
      <>
        Every journey starts with a trusted
        <br className="desktop-break" />
        and verified driver.
      </>
    ),
  },
  {
    image: slideThree,
    shortTitle: 'Affordable',
    title: (
      <>
        Fair Prices.
        <br />
        <span>No Surprises.</span>
      </>
    ),
    description: (
      <>
        Enjoy affordable, transparent fares for
        <br className="desktop-break" />
        your everyday journeys across Lagos.
      </>
    ),
  },
  {
    image: slideFour,
    shortTitle: 'Easy Booking',
    title: (
      <>
        Your Destination
        <br />
        <span>Is Just a Few Taps Away.</span>
      </>
    ),
    description: (
      <>
        Enter your pickup location, choose your
        <br className="desktop-break" />
        destination and book your ride with ease.
      </>
    ),
  },
]

function Banner() {
  const { isAuthenticated, isDriver } =
    useContext(AuthContext)

  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const touchStart = useRef(null)

  const primaryCta = !isAuthenticated
    ? {
        to: '/login',
        label: 'Book a Ride',
      }
    : isDriver
      ? {
          to: '/dashboard',
          label: 'View Ride Requests',
        }
      : {
          to: '/book-ride',
          label: 'Book a Ride',
        }

  const changeSlide = useCallback((direction) => {
    setActiveSlide((current) => {
      return (
        (current + direction + slides.length) %
        slides.length
      )
    })
  }, [])

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      return undefined
    }

    const timer = window.setInterval(() => {
      changeSlide(1)
    }, 5500)

    return () => {
      window.clearInterval(timer)
    }
  }, [changeSlide, isPaused])

  const handleTouchStart = (event) => {
    touchStart.current =
      event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return

    const distance =
      event.changedTouches[0].clientX -
      touchStart.current

    if (Math.abs(distance) > 45) {
      changeSlide(distance > 0 ? -1 : 1)
    }

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
        if (
          !event.currentTarget.contains(
            event.relatedTarget
          )
        ) {
          setIsPaused(false)
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="hero-slides"
        aria-live="polite"
      >
        {slides.map((slide, index) => (
          <article
            key={slide.image}
            className={`hero-slide ${
              index === activeSlide
                ? 'is-active'
                : ''
            }`}
            aria-hidden={
              index !== activeSlide
            }
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
          >
            <div className="hero-overlay" />

            <div className="hero-inner">
              <div className="hero-copy">

                <span className="hero-eyebrow">
                  <LuStar
                    size={15}
                    fill="currentColor"
                    aria-hidden="true"
                  />

                  <span>
                    #1 Ride Service in Lagos
                  </span>
                </span>

                <h1>{slide.title}</h1>

                <p>{slide.description}</p>

                <Link
                  to={primaryCta.to}
                  className="hero-cta"
                  tabIndex={
                    index === activeSlide
                      ? 0
                      : -1
                  }
                >
                  <span>
                    {primaryCta.label}
                  </span>

                  <span className="hero-cta-icon">
                    <LuArrowRight
                      size={19}
                    />
                  </span>
                </Link>

              </div>
            </div>
          </article>
        ))}
      </div>

      {/* BOTTOM SLIDE NAVIGATION */}
      <div
        className="hero-bottom-controls"
        aria-label="Carousel controls"
      >
        {/* CATEGORY INDICATORS */}
        <div
          className="hero-benefits"
          aria-label="Service benefits"
        >
          {slides.map((slide, index) => (
            <React.Fragment key={slide.shortTitle}>
              <button
                type="button"
                className={
                  index === activeSlide
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveSlide(index)
                }
                aria-label={`Show ${slide.shortTitle} slide`}
                aria-current={
                  index === activeSlide
                    ? 'true'
                    : undefined
                }
              >
                <span className="benefit-dot">
                  {index === 0 && (
                    <LuShieldCheck size={12} />
                  )}

                  {index === 1 && (
                    <LuShieldCheck size={12} />
                  )}

                  {index === 2 && (
                    <LuCircleDollarSign size={12} />
                  )}

                  {index === 3 && (
                    <LuMapPin size={12} />
                  )}
                </span>

                <span>{slide.shortTitle}</span>
              </button>

              {index < slides.length - 1 && (
                <span className="benefit-line" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ARROWS */}
        <div className="hero-arrows">
          <button
            type="button"
            onClick={() =>
              changeSlide(-1)
            }
            aria-label="Previous slide"
          >
            <LuArrowLeft size={21} />
          </button>

          <button
            type="button"
            className="next"
            onClick={() =>
              changeSlide(1)
            }
            aria-label="Next slide"
          >
            <LuArrowRight size={21} />
          </button>
        </div>
      </div>

      {/* MOBILE DOTS */}
      <div
        className="hero-dots"
        role="group"
        aria-label="Choose a slide"
      >
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            className={
              index === activeSlide
                ? 'is-active'
                : ''
            }
            onClick={() =>
              setActiveSlide(index)
            }
            aria-label={`Go to slide ${index + 1}`}
            aria-current={
              index === activeSlide
                ? 'true'
                : undefined
            }
          />
        ))}
      </div>
    </section>
  )
}

export default Banner