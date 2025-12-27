import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css'; // Підключаємо твій CSS файл

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 0 && password.trim().length > 0) {
       await login(email, password); 
       navigate('/profile'); 
    } else {
        alert("Please enter email and password");
    }
  };

  return (
    <div className="auth-container">
      {/* Картка по центру */}
      <div className="auth-card">
        
        {/* Заголовок */}
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        
        <form onSubmit={handleLogin}>
          
          {/* Поле Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Поле Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password (справа, як у стилях) */}
          <div className="forgot-wrapper">
            <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
          </div>
          
          {/* Кнопка входу */}
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        {/* Розділювач */}
        <div className="divider">
          <span>Or sign in with</span>
        </div>

        {/* Соцмережі */}
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
          <button className="social-btn" title="Apple"> <img 
               src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" 
               alt="Apple" 
               style={{ width: '26px', height: '30px' }} 
             />
          </button>
        </div>

        {/* Підвал картки */}
        <div className="bottom-text">
          Don't have an account? 
          <Link to="/signup">Sign up for free</Link>
        </div>

      </div>
    </div>
  );
}