import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/Navbar.css";
import { Calendar, Settings, Gift } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="brand-logo">
          <Gift className="brand-icon" />
        </div>
        <h2>Reminday</h2>
      </div>
      
      <ul className="nav-links">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' || location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <Calendar className="nav-icon" />
            <span>Calendar</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;