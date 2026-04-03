import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; 
import logo from '../assets/Logo.png';
// Твій імпорт тут:
import { SearchDropdown } from '../components/SearchDropdown';

export default function Navbar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`nav ${show && "nav-black"}`}>
      <div className="nav-contents">
        
        {/* Логотип */}
        <Link to="/">
           <img 
             src={logo} 
             alt="Cinelink" 
             className="nav-logo" 
           />
        </Link>
        <div className="nav-links">
           <Link to="/">Home</Link>
           {isAuthenticated && <Link to="/profile">My List</Link>}
        </div>

        {/* 👇 ОСЬ ТУТ ДОДАЄМО КОМПОНЕНТ ПОШУКУ 👇 */}
        <SearchDropdown />

        {isAuthenticated ? (
            <img
              onClick={() => navigate("/profile")}
              className="nav-avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Avatar"
            />
        ) : (
            <button 
                className="nav-btn"
                onClick={() => navigate("/login")}
            >
                Sign In
            </button>
        )}
      </div>
    </div>
  );
}