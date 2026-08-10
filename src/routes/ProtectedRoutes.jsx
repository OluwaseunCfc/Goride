import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // `replace` keeps the protected URL out of history, so the browser
    // back button doesn't bounce between /login and the guarded page.
    // `state.from` lets Login send the user back where they intended.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
