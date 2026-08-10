import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCar } from 'react-icons/fa'
import { LuLayoutDashboard, LuLogOut, LuUser, LuChevronDown } from 'react-icons/lu'
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

  // The menu remembers which route it was opened on. Comparing that to the
  // current route closes it automatically after navigation, without an
  // effect that calls setState (which would cause a cascading render).
  const [menuState, setMenuState] = useState({ open: false, path: location.pathname })
  const menuOpen = menuState.open && menuState.path === location.pathname
  const menuRef = useRef(null)

  const closeMenu = () => setMenuState({ open: false, path: location.pathname })
  const toggleMenu = () => setMenuState({ open: !menuOpen, path: location.pathname })

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuState({ open: false, path: location.pathname })
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuState({ open: false, path: location.pathname })
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen, location.pathname])

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
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-sm sticky-top">
      <div className="container d-flex justify-content-between align-items-center">

        <Link className="navbar-brand" to="/">
          <FaCar className="logo me-1" />
          GoRide
        </Link>

        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="collapsibleNavId">
          <ul className="navbar-nav mx-auto gap-4">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')}>Testimonial</a>
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
            <div className="d-flex gap-2 align-items-center">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="nav-btn">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
