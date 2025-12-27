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
          <button className="social-btn" style={{ background: '#ffffff', border: 'none' }}>
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" 
               alt="Google" 
               style={{ width: '30px', height: '30px' }} 
             />
          </button>
          
          <button className="social-btn" style={{ background: '#1877F2', border: 'none' }}>
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" 
               alt="Facebook" 
               style={{ width: '40px', height: '40px' }} 
             />
          </button>

          {}
          <button className="social-btn">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" 
               alt="Apple" 
               style={{ width: '26px', height: '30px' }} 
             />
          </button>
        </div>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}