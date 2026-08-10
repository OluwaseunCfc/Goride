import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { LuLayoutDashboard, LuCar, LuLogOut, LuClipboardList } from 'react-icons/lu'

function Sidebar() {
  const { isDriver, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path;


  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-links">
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LuLayoutDashboard size={18} /> <span>Dashboard</span>
        </Link>

        {isDriver ? (
          <Link to="/dashboard" className="sidebar-link">
            <LuClipboardList size={18} /> <span>Ride Requests</span>
          </Link>
        ) : (
          <Link to="/book-ride" className={`sidebar-link ${isActive('/book-ride') ? 'active' : ''}`}>
            <LuCar size={18} /> <span>Book a Ride</span>
          </Link>
        )}
      </div>

      <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
        <LuLogOut size={18} /> <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;