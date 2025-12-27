import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  // Змінні, де зберігається текст
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Перевірка: чи не пусті поля?
    if (email.trim().length > 0 && password.trim().length > 0) {
       console.log("Вводимо:", email, password); // Для перевірки в консолі
       
       await login(email, password); // Викликаємо вхід
       navigate('/profile'); // Переходимо в профіль
    } else {
        alert("Please enter email and password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card">
          <h1 className="auth-title">Sign In</h1>
          
          <form onSubmit={handleLogin}>
            {/* Поле Email */}
            <input 
              type="text" 
              className="form-input" 
              placeholder="Email or phone number"
              value={email} // 👈 Важливо: прив'язка до змінної
              onChange={(e) => setEmail(e.target.value)} // 👈 Важливо: оновлення змінної
            />
            
            {/* Поле Password */}
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password"
              value={password} // 👈 Важливо
              onChange={(e) => setPassword(e.target.value)} // 👈 Важливо
            />
            
            <button type="submit" className="auth-btn">Sign In</button>
            
            <div className="auth-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/help" className="auth-link">Need help?</Link>
            </div>
          </form>

          <div className="auth-footer">
            <span className="gray">New to Cinelink? </span>
            <Link to="/signup" className="white-link">Sign up now.</Link>
            <p className="recaptcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. 
              <span className="blue-link"> Learn more.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}