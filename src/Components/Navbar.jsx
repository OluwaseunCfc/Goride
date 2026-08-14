import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LuLayoutDashboard, LuLogOut, LuUser, LuChevronDown, LuMenu, LuX } from 'react-icons/lu'
import { AuthContext } from '../Context/AuthContext'

/** "john.doe@mail.com" -> "JD", "Ada Lovelace" -> "AL" */
function getInitials(user) {
  const first = user?.first_name?.trim()
  const last = user?.last_name?.trim()

  if (first || last) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
  }

  const handle = user?.email?.split('@')[0] ?? ''
  const parts = handle.split(/[._-]+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return handle.slice(0, 2).toUpperCase() || 'U'
}

function getDisplayName(user) {
  const first = user?.first_name?.trim()
  const last = user?.last_name?.trim()

  if (first || last) return [first, last].filter(Boolean).join(' ')

  return user?.email?.split('@')[0] ?? 'Account'
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isDriver, user, logout } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)

  // Both menus remember which route they were opened on. Comparing that to
  // the current route closes them automatically after navigation, without an
  // effect that calls setState (which would cause a cascading render).
  const [menuState, setMenuState] = useState({ open: false, path: location.pathname })
  const menuOpen = menuState.open && menuState.path === location.pathname
  const menuRef = useRef(null)

  // The mobile hamburger collapse. This is driven by React rather than
  // Bootstrap's `data-bs-toggle="collapse"` data API: that plugin keeps the
  // open/closed state inside Bootstrap's own JS, so nothing on the React side
  // could close it and it stayed open until you clicked the button again.
  const [navState, setNavState] = useState({ open: false, path: location.pathname })
  const navOpen = navState.open && navState.path === location.pathname
  const navRef = useRef(null)

  const closeMenu = () => setMenuState({ open: false, path: location.pathname })
  const toggleMenu = () => setMenuState({ open: !menuOpen, path: location.pathname })

  const closeNav = () => setNavState({ open: false, path: location.pathname })
  const toggleNav = () => setNavState({ open: !navOpen, path: location.pathname })

  // Close whichever menu is open on an outside click or Escape.
  useEffect(() => {
    if (!menuOpen && !navOpen) return

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuState({ open: false, path: location.pathname })
      }

      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavState({ open: false, path: location.pathname })
      }
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return

      setMenuState({ open: false, path: location.pathname })
      setNavState({ open: false, path: location.pathname })
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen, navOpen, location.pathname])

  const scrollToSection = (event, id) => {
    event.preventDefault()

    if (location.pathname === '/') {
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `/#${id}`)
        return
      }
    }

    navigate({ pathname: '/', hash: `#${id}` })
  }

  const handleLogout = () => {
    closeMenu()
    closeNav()
    logout()
    navigate('/')
  }

  // Keep navbar visible on scroll: toggle scrolled class and body padding.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Add a body padding helper while the fixed navbar is active on the homepage
  useEffect(() => {
    const bodyClass = 'has-fixed-nav'
    // We want the homepage hero to be full-viewport beneath the transparent navbar,
    // so only add body padding on non-home pages where the navbar shouldn't overlap content.
    if (location.pathname !== '/') document.body.classList.add(bodyClass)
    else document.body.classList.remove(bodyClass)
    return () => document.body.classList.remove(bodyClass)
  }, [location.pathname])

  const bookRidePath = isAuthenticated && !isDriver ? '/book-ride' : isAuthenticated ? '/dashboard' : '/login'

  return (
    <nav className={`navbar navbar-expand-lg goride-navbar ${location.pathname === '/' ? 'navbar-home' : 'navbar-default'} ${scrolled ? 'scrolled' : ''}`} ref={navRef}>
      <div className="container-fluid navbar-shell d-flex justify-content-between align-items-center">

        <Link className="navbar-brand" to="/" aria-label="GoRide home" onClick={closeNav}>
          <span className="brand-badge" aria-hidden="true">G</span>
          <span className="brand-wordmark">Go<span>Ride</span></span>
        </Link>

        <button
          className={`navbar-toggler ${navOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleNav}
          aria-controls="collapsibleNavId"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          {navOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
        </button>

        <div
          className={`collapse navbar-collapse justify-content-between ${navOpen ? 'show' : ''}`}
          id="collapsibleNavId"
        >
          {/* One handler on the list closes the menu when any link inside is
              clicked, including a link back to the page you're already on
              (where the route never changes). */}
          <ul className="navbar-nav mx-auto" onClick={closeNav}>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' && !location.hash ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about" onClick={(e) => scrollToSection(e, 'about')}>About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#services" onClick={(e) => scrollToSection(e, 'services')}>Services</a>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`} to="/signup">Become a Driver</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} to="/contact">Contact</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>

          {isAuthenticated ? (
            <div className="nav-user" ref={menuRef}>
              <button
                type="button"
                className="nav-user-trigger"
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >

                <span className="nav-user-avatar">
                  {getInitials(user)}
                  <span className="nav-user-status" aria-hidden="true"></span>
                </span>
                <span className="nav-user-meta">
                  <span className="nav-user-name">{getDisplayName(user)}</span>
                  <span className="nav-user-role">{isDriver ? 'Driver' : 'Passenger'}</span>
                </span>
                <LuChevronDown
                  size={16}
                  className={`nav-user-caret ${menuOpen ? 'open' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="nav-user-menu" role="menu">
                  <div className="nav-user-menu-header">
                    <p className="nav-user-menu-name">{getDisplayName(user)}</p>
                    <p className="nav-user-menu-email">{user?.email}</p>
                  </div>

                  <Link to="/dashboard" className="nav-user-menu-item" role="menuitem">
                    <LuLayoutDashboard size={16} /> <span>Dashboard</span>
                  </Link>

                  {!isDriver && (
                    <Link to="/book-ride" className="nav-user-menu-item" role="menuitem">
                      <LuUser size={16} /> <span>Book a Ride</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className="nav-user-menu-item nav-user-menu-logout"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LuLogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-actions" onClick={closeNav}>
              <Link to={bookRidePath} className="nav-btn">Book a Ride</Link>
            </div>

          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
