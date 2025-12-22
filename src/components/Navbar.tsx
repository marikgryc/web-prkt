import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Логотип */}
        <Link to="/" className="navbar-logo">
          Leafy <span style={{ color: '#4ade80' }}>.</span>
        </Link>

        {/* Меню */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>

        {/* Аватарка (заглушка) */}
        <Link to="/profile" className="navbar-profile">
          <div className="avatar-circle">U</div>
        </Link>
      </div>
    </nav>
  );
}