import React, { useEffect, useState } from 'react'
import { FaCar } from 'react-icons/fa'

/**
 * Full-screen boot splash shown once when the app first mounts.
 *
 * It renders as a fixed overlay *on top of* the app rather than replacing
 * it, so React Router and the lazy route chunks keep loading underneath
 * while it's visible. That means the existing <Loading /> Suspense
 * fallback is untouched — it still covers slow route changes later on,
 * it just rarely gets a chance to flash on the very first paint now.
 */
function SplashScreen({ duration = 1800 }) {
  // `hiding` triggers the CSS fade; `done` unmounts once the fade ends.
  const [hiding, setHiding] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHiding(true), duration)
    return () => clearTimeout(timer)
  }, [duration])

  useEffect(() => {
    if (!hiding) return

    // Must stay in sync with the transition duration in index.css.
    const timer = setTimeout(() => setDone(true), 450)
    return () => clearTimeout(timer)
  }, [hiding])

  // Stop the page behind the overlay from scrolling while it's up.
  useEffect(() => {
    if (done) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [done])

  if (done) return null

  return (
    <div
      className={`splash-screen ${hiding ? 'hiding' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading GoRide"
    >
      <div className="splash-inner">
        <div className="splash-logo">
          <FaCar size={34} />
        </div>

        <h1 className="splash-wordmark">
          Go<span>Ride</span>
        </h1>

        <div className="splash-loader" aria-hidden="true"></div>

        <p className="splash-text">Your ride, on the way</p>
      </div>
    </div>
  )
}

export default SplashScreen
