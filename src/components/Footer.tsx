import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Верхня частина: Логотип і Навігація */}
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">Cinelink</h2>
            <p className="footer-desc">Твій провідник у світ кіно.</p>
          </div>
          
          <div className="footer-nav">
            <Link to="/" className="footer-link">Головна</Link>
            <Link to="/movies" className="footer-link">Фільми</Link>
            <Link to="/profile" className="footer-link">Профіль</Link>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Нижня частина: КОНТАКТИ (як на твоєму скріншоті) */}
        <div className="footer-bottom">
          <h3 className="footer-heading">КОНТАКТИ</h3>
          
          <div className="contact-grid">
            {/* Ліва колонка: Телефони */}
            <div className="contact-column">
              <a href="tel:+38077327723" className="contact-item">
                + 380 (77) 32 77 23
              </a>
              <a href="tel:+38077327723" className="contact-item">
                + 380 (77) 32 77 23
              </a>
            </div>

            <div className="contact-column">
              <a href="mailto:info@yourfishstore.com" className="contact-item">
                info@cinelink.com
              </a>
              <span className="contact-text">
              вул. Антона Чехова, 20, Коломия, Івано-Франківська область,
              </span>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Cinelink. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;