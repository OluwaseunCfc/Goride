import React, { useState, useContext } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FaCar } from 'react-icons/fa'
import { LuEye, LuEyeClosed } from 'react-icons/lu'
import { loginUser } from '../api/auth'
import { AuthContext } from '../Context/AuthContext'

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useContext(AuthContext);

  // Where ProtectedRoute wanted to send them before the redirect.
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data.user, { access: data.access, refresh: data.refresh });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  // Already signed in? Don't show the form again.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="login-page">

      <div className="login-split-card">

        {/* Left Panel */}
        <div className="login-left-panel">
          <div className="login-left-inner">
            <div className="login-brand-badge">
              <FaCar size={16} /> GoRide
            </div>
            <h2 className="login-left-heading">Welcome Back!</h2>
            <p className="login-left-sub">
              Sign in to continue your journey and enjoy seamless rides across the city.
            </p>
            <div className="login-left-stats">
              <div className="login-stat">
                <span className="login-stat-number">10K+</span>
                <span className="login-stat-label">Happy Riders</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-number">500+</span>
                <span className="login-stat-label">Drivers</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-number">4.9★</span>
                <span className="login-stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <div className="login-right-inner">
            <h3 className="login-form-title">Sign In</h3>
            <p className="login-form-sub">Enter your details to access your account.</p>

            {error && <div className="alert alert-danger mt-3">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form mt-4">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="oluwaseun@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-1 d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <div className="mb-4 position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control custom-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn border-0 position-absolute login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEye /> : <LuEyeClosed />}
                </button>
              </div>

              <button
                type="submit"
                className="btn-login w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="login-divider">or</div>

              <button
                type="button"
                className="google-btn w-100 d-flex align-items-center justify-content-center gap-2"
                disabled
                title="Not implemented"
              >
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-36.4-4.3-53.7H272.1v101.7h146.9c-6.4 34.8-25.6 64.3-54.5 84.1v69.8h88.2c51.6-47.5 80.8-117.6 80.8-201.9z" />
                  <path fill="#34A853" d="M272.1 544.3c73.8 0 135.8-24.5 181-66.5l-88.2-69.8c-24.4 16.4-55.4 26-92.8 26-71.4 0-132-48.2-153.6-113.1H28.5v70.9c45.7 90.6 139.9 152.5 243.6 152.5z" />
                  <path fill="#FBBC05" d="M118.5 324.7c-10.5-31.4-10.5-65.5 0-96.9V156.9H28.5c-39.5 79.4-39.5 173.7 0 253.1l90-84.3z" />
                  <path fill="#EA4335" d="M272.1 107.7c39.8 0 75.4 13.7 103.5 40.6l77.6-77.6C412.2 24.6 345.4 0 272.1 0 168.4 0 74.2 61.9 28.5 152.5l90 70.9C140.1 156 200.7 107.7 272.1 107.7z" />
                </svg>
                Sign in with Google
              </button>
            </form>

            <p className="text-center text-muted small mt-4 mb-0">
              Don't have an account?{' '}
              <Link to="/signup" className="link-primary text-decoration-none fw-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login