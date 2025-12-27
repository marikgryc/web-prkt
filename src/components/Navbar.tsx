import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Логотип */}
        <Link to="/" className="navbar-logo">
          Cinelink <span style={{ color: '#4ade80' }}>.</span>
        </Link>

        {/* Меню */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>

        <Link to="/login" className="nav-linl">Login</Link>

      </div>
    </nav>
  );
}