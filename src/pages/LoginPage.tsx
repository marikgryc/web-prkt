import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 404) {
        setError("Невірний логін або пароль");
      } else {
        setError("Помилка сервера. Спробуйте пізніше.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="forgot-wrapper">
            <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Вхід...' : 'Sign In'}
          </button>
        </form>

        <div className="divider"><span>Or sign in with</span></div>

        <div className="social-row">
          <button className="social-btn" style={{ background: '#ffffff', border: 'none' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google" style={{ width: '30px', height: '30px' }} />
          </button>
          <button className="social-btn" style={{ background: '#1877F2', border: 'none' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" style={{ width: '40px', height: '40px' }} />
          </button>
          <button className="social-btn" title="Apple">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="Apple" style={{ width: '26px', height: '30px' }} />
          </button>
        </div>

        <div className="bottom-text">
          Don't have an account? <Link to="/signup">Sign up for free</Link>
        </div>
      </div>
    </div>
  );
}
