import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LuLayoutDashboard,
  LuLogOut,
  LuUser,
  LuChevronDown,
  LuMenu,
  LuX,
} from 'react-icons/lu'
import { AuthContext } from '../Context/AuthContext'

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

  if (first || last) {
    return [first, last].filter(Boolean).join(' ')
  }

  return user?.email?.split('@')[0] ?? 'Account'
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuthenticated, isDriver, user, logout } =
    useContext(AuthContext)

  const [scrolled, setScrolled] = useState(false)

  const [menuState, setMenuState] = useState({
    open: false,
    path: location.pathname,
  })

  const [navState, setNavState] = useState({
    open: false,
    path: location.pathname,
  })

  const menuOpen =
    menuState.open && menuState.path === location.pathname

  const navOpen =
    navState.open && navState.path === location.pathname

  const menuRef = useRef(null)
  const navRef = useRef(null)

  const closeMenu = () => {
    setMenuState({
      open: false,
      path: location.pathname,
    })
  }

  const toggleMenu = () => {
    setMenuState({
      open: !menuOpen,
      path: location.pathname,
    })
  }

  const closeNav = () => {
    setNavState({
      open: false,
      path: location.pathname,
    })
  }

  const toggleNav = () => {
    setNavState({
      open: !navOpen,
      path: location.pathname,
    })
  }

  useEffect(() => {
    if (!menuOpen && !navOpen) return

    const handlePointerDown = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu()
      }

      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        closeNav()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
        closeNav()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen, navOpen, location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToSection = (event, id) => {
    event.preventDefault()
    closeNav()

    if (location.pathname === '/') {
      const section = document.getElementById(id)

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
        })

        window.history.replaceState(
          null,
          '',
          `/#${id}`
        )

        return
      }
    }

    navigate({
      pathname: '/',
      hash: `#${id}`,
    })
  }

  const handleLogout = () => {
    closeMenu()
    closeNav()
    logout()
    navigate('/')
  }

  const bookRidePath =
    isAuthenticated && !isDriver
      ? '/book-ride'
      : isAuthenticated
        ? '/dashboard'
        : '/login'

  return (
    <nav
      ref={navRef}
      className={`
        goride-navbar
        ${location.pathname === '/' ? 'navbar-home' : 'navbar-default'}
        ${scrolled ? 'scrolled' : ''}
      `}
    >
      <div className="navbar-shell">

        {/* BRAND */}
        <Link
          className="goride-brand"
          to="/"
          aria-label="GoRide home"
          onClick={closeNav}
        >
          <span className="brand-badge">G</span>

          <span className="brand-wordmark">
            Go<span>Ride</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div
          className={`goride-nav-menu ${
            navOpen ? 'mobile-open' : ''
          }`}
        >
          <ul
            className="goride-nav-links"
            onClick={closeNav}
          >
            <li>
              <Link
                className={
                  location.pathname === '/' &&
                  !location.hash
                    ? 'active'
                    : ''
                }
                to="/"
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="/#about"
                onClick={(event) =>
                  scrollToSection(event, 'about')
                }
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="/#services"
                onClick={(event) =>
                  scrollToSection(event, 'services')
                }
              >
                Services
              </a>
            </li>

            <li>
              <Link
                className={
                  location.pathname === '/signup'
                    ? 'active'
                    : ''
                }
                to="/signup"
              >
                Become a Driver
              </Link>
            </li>

            <li>
              <Link
                className={
                  location.pathname === '/contact'
                    ? 'active'
                    : ''
                }
                to="/contact"
              >
                Contact
              </Link>
            </li>

            {isAuthenticated && (
              <li className="mobile-dashboard-link">
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* RIGHT SIDE */}
          {isAuthenticated ? (
            <div
              className="nav-user"
              ref={menuRef}
            >
              <button
                type="button"
                className="nav-user-trigger"
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="nav-user-avatar">
                  {getInitials(user)}

                  <span
                    className="nav-user-status"
                    aria-hidden="true"
                  />
                </span>

                <span className="nav-user-meta">
                  <span className="nav-user-name">
                    {getDisplayName(user)}
                  </span>

                  <span className="nav-user-role">
                    {isDriver ? 'Driver' : 'Passenger'}
                  </span>
                </span>

                <LuChevronDown
                  size={16}
                  className={`nav-user-caret ${
                    menuOpen ? 'open' : ''
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  className="nav-user-menu"
                  role="menu"
                >
                  <div className="nav-user-menu-header">
                    <p className="nav-user-menu-name">
                      {getDisplayName(user)}
                    </p>

                    <p className="nav-user-menu-email">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="nav-user-menu-item"
                    role="menuitem"
                  >
                    <LuLayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>

                  {!isDriver && (
                    <Link
                      to="/book-ride"
                      className="nav-user-menu-item"
                      role="menuitem"
                    >
                      <LuUser size={16} />
                      <span>Book a Ride</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className="nav-user-menu-item nav-user-menu-logout"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LuLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={bookRidePath}
              className="nav-book-btn"
              onClick={closeNav}
            >
              Book a Ride
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="goride-menu-toggle"
          onClick={toggleNav}
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          {navOpen ? (
            <LuX size={25} />
          ) : (
            <LuMenu size={25} />
          )}
        </button>

      </div>
    </nav>
  )
}

export default Navbar