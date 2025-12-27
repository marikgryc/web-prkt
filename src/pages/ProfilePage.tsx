import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css'; // Використаємо ті самі стилі

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{textAlign: 'center'}}>
        <h1 className="auth-title">My Profile</h1>
        
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Avatar"
            style={{width: '100px', borderRadius: '10px', margin: '20px 0'}} 
        />
        
        <h3 style={{color: 'white'}}>Hello, {user?.name || 'Guest'}!</h3>
        <p style={{color: '#888', marginBottom: '30px'}}>{user?.email}</p>

        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button className="auth-btn" onClick={() => navigate('/')}>
                Go to Home
            </button>
            
            <button 
                className="auth-btn" 
                style={{background: '#333', border: '1px solid #555'}}
                onClick={handleLogout}
            >
                Log Out
            </button>
        </div>
      </div>
    </div>
  );
}