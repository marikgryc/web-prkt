import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
      >
        <h2 className="auth-title">Sign up</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input type="password" className="form-input" />
          </div>

          <button type="submit" className="auth-btn" style={{marginTop: '10px'}}>Continue</button>
        </form>

        <div className="divider">
          <span>Or sign up with</span>
        </div>

        <div className="social-row">
          <button className="social-btn">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="24" />
          </button>
          <button className="social-btn" style={{background: '#1877F2', border: 'none'}}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button className="social-btn">
             <svg width="24" height="24" viewBox="0 0 384 512" fill="white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 89.8 126.7 25.6 0 38.2-19.7 63.2-19.7 25.2 0 34.8 19.7 63.2 19.7 39.9 0 66.4-68.9 76.5-98.3-25.7-11.2-46.8-35-46.8-74.3zM255 86.5c19.1-29.4 53.1-49.8 89.5-49.8a.9.9 0 0 1 .5.1c-.2 32.5-19.8 63-47.4 78.5-20.7 11.5-54.3 9.4-78.7-27.4z"/></svg>
          </button>
        </div>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}