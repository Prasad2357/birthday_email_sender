import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/Navbar.css";
import { Calendar, PlusCircle, Settings, Home } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Birthday App</h2>
      </div>
      
      <ul className="nav-links">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/calendar" 
            className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <Calendar className="nav-icon" />
            <span>Calendar</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/userform" 
            className={`nav-link ${location.pathname === '/userform' ? 'active' : ''}`}
          >
            <PlusCircle className="nav-icon" />
            <span>Add Birthday</span>
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