import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">


        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <h3 className="footer-heading">Контакти</h3>

          <div className="contact-grid">
            <div className="contact-block">
              <span className="contact-label">Телефон</span>
              <a href="tel:+380773277231" className="contact-item">+380 (77) 32 77 23</a>
            </div>

            <div className="contact-block">
              <span className="contact-label">Email</span>
              <a href="mailto:info@cinelink.com" className="contact-item">info@cinelink.com</a>
            </div>

            <div className="contact-block">
              <span className="contact-label">Адреса</span>
              <span className="contact-text">вул. Антона Чехова, 20<br />Коломия, Івано-Франківська обл.</span>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} Cinelink. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
