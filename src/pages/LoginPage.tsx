import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api/API_CONFIG";
import { CURRENT_USER, updateCurrentUserData } from "../api/currentUser";

export default function LoginPage() {
  const navigate = useNavigate();

  // Використовуємо правильні назви стейтів
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      const data = await response.json();

      // Тепер ми чітко бачимо, що треба писати data.results.user_id
      if (response.ok && data.results && data.results.user_id) {
        const user = data.results;

        // 1. Зберігаємо ID та JWT (він вам знадобиться пізніше для захищених роутів)
        localStorage.setItem('cinelink_user_id', String(user.user_id));
        if (user.jwt) {
          localStorage.setItem('jwt', user.jwt);
        }
        
        // 2. Оновлюємо глобальний об'єкт CURRENT_USER відразу з результатів логіну
        // Це швидше, ніж робити ще один запит на профіль
        CURRENT_USER.UID = user.user_id;
        CURRENT_USER.firstName = user.first_name || "";
        CURRENT_USER.lastName = user.last_name || "";
        CURRENT_USER.username = user.username || "";

        console.log("Логін успішний, переходимо в чат...");
        
        // 3. ПЕРЕХІД
        navigate('/chat/3'); 
      } else {
        alert(data.message || "Помилка авторизації");
      }
    } catch (error) {
      console.error("Помилка логіну:", error);
      alert("Не вдалося з'єднатися з сервером");
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