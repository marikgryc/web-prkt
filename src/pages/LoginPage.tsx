import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде логіка входу через API
    navigate('/'); // Поки просто перекидаємо на головну
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <h2 className="auth-title">Log In</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot-wrapper">
             <Link to="/forgot-password" class="auth-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">Continue</button>
        </form>

        <div className="divider">
          <span>Or sign in with</span>
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
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}