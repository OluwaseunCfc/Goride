import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'

/**
 * Floating "back to top" button.
 *
 * Stays hidden until the user has scrolled past `showAfter` pixels so it
 * never covers content on a short screen, then fades in bottom-right.
 */
function ScrollToTop({ showAfter = 400 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > showAfter)
    }

    // Run once on mount so the button is correct when the page loads
    // already scrolled (e.g. arriving at /#testimonials, or a reload
    // that restores the previous scroll position).
    handleScroll()

    // `passive` tells the browser we won't preventDefault, so it can keep
    // scrolling smooth instead of waiting on this listener.
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfter])

  const scrollUp = () => {
    // Honour the OS "reduce motion" setting: animating a full-page scroll
    // can be uncomfortable for motion-sensitive users.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      className={`scroll-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll back to top"
      title="Back to top"
      // Hidden from keyboard and screen readers while off-screen, so users
      // can't tab to an invisible control.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <FaArrowUp size={16} />
    </button>
  )
}

export default ScrollToTop
