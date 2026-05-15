import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api/API_CONFIG";
import { CURRENT_USER, updateCurrentUserData } from "../api/currentUser";
import { useAuth } from "../context/AuthContext";
export default function LoginPage() {
  const { login } = useAuth(); // Використовуємо функцію з контексту
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Цей виклик оновить AuthContext, збереже ID в localStorage і підключить WS
      await login(username, password);
      
      // Перехід до чату
      navigate('/profile'); 
    } catch (error) {
      // Помилка вже оброблена в AuthContext, тут можна просто вивести alert
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        
        <form onSubmit={handleLogin}>
          
          {/* Поле Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              required
            />
          </div>

          <div className="forgot-wrapper">
            <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="auth-btn">Sign In</button>
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
          <button className="social-btn" title="Apple">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" 
              alt="Apple" 
              style={{ width: '26px', height: '30px' }} 
            />
          </button>
        </div>

        <div className="bottom-text">
          Don't have an account? 
          <Link to="/signup">Sign up for free</Link>
        </div>

      </div>
    </div>
  );
}