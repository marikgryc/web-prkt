import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Posts');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
      return <div className="loading-text">Loading user info...</div>;
  }

  const avatarUrl = user.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
  const bgUrl = user.bg_img_url; 

  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString() 
    : "Unknown date";

  return (
    <div className="profile-page">
      
      <div 
        className="profile-cover" 
        style={{
           backgroundImage: bgUrl ? `url(${bgUrl})` : undefined 
        }}
      ></div>

      {/* Основний контейнер контенту */}
      <div className="profile-container">
        
        {/* --- ШАПКА ПРОФІЛЮ --- */}
        <div className="profile-header">
          
          {/* Аватарка (заїжджає на обкладинку) */}
          <img 
            src={avatarUrl} 
            alt={user.username} 
            className="profile-avatar-large"
            onError={(e) => {
              e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
            }}
          />

          <div className="profile-info">
            <div className="profile-names">
                <h1 className="profile-name">
                {user.first_name} {user.last_name}
                </h1>
                <p className="profile-handle">@{user.username}</p>
            </div>

            {/* 2. БІОГРАФІЯ (Виводимо, тільки якщо є текст) */}
            {user.bio && (
                <div className="profile-bio">
                    {user.bio}
                </div>
            )}

            <span className="profile-joined">Joined {joinDate}</span>

            {/* Статистика */}
            <div className="profile-stats-row">
              <div className="stat-box">
                  <strong>{user.followings || 0}</strong> Following
              </div>
              <div className="stat-box">
                  <strong>{user.followers || 0}</strong> Followers
              </div>
              
              <div className="stat-box logout-btn" onClick={handleLogout}>
                 Log Out
              </div>
            </div>
          </div>
        </div>

        {/* --- ВКЛАДКИ --- */}
        <div className="profile-tabs">
          {['Posts', 'Playlist', 'Saved stories', 'Wishlist'].map((tab) => (
            <button 
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- КОНТЕНТ ВКЛАДОК --- */}
        <div className="posts-section">
          <div style={{color: '#666', fontSize: '1.2rem', marginTop: '20px'}}>
              Content for <b>{activeTab}</b> will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}