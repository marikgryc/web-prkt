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

  return (
    <div className="profile-page">
      
      {/* --- HEADER SECTION --- */}
      <div className="profile-header">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
          alt="Avatar" 
          className="profile-avatar-large"
        />

        <div className="profile-info">
          <h1 className="profile-name">{user?.name || "Guest"}</h1>
          <p className="profile-handle">@{user?.email?.split('@')[0] || "guest_user"}</p>
          <span className="profile-joined">Joined 02.11.2025</span>

          <div className="profile-stats-row">
            <div className="stat-box">67 Following</div>
            <div className="stat-box">14 Followers</div>
            <div className="stat-box">Posts: 1</div>
            <div className="stat-box" onClick={handleLogout} style={{borderColor: '#e50914', color: '#e50914'}}>
               Log Out
            </div>
          </div>

          <div className="top-genres">
            <span className="genre-label">Top Genres</span>
            <span className="genre-tag genre-drama">Drama</span>
            <span className="genre-tag genre-action">Action</span>
          </div>
        </div>
      </div>

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

      <div className="posts-section">
        {activeTab === 'Posts' && (
          <div className="post-card">
            <div className="post-header">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                alt="User" 
                className="post-avatar-small"
              />
              <div>
                 <div className="post-author-name">{user?.name || "User"}</div>
                 <div className="post-author-handle">@{user?.email?.split('@')[0]}</div>
              </div>
            </div>

            <img 
               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-3ioEYxxX0Lt_N_TpZGcxZVvK0-XNdKP-QA&s"
               alt="Post content" 
               className="post-image"
            />

            <div className="post-actions">
               <input type="text" placeholder="Leave a comment..." className="comment-input" />
               
               <div className="action-icon">
                 💬 1
               </div>
               
               <div className="action-icon">
                 <span className="icon-heart">❤</span> 12
               </div>
            </div>
          </div>
        )}

        {activeTab !== 'Posts' && (
            <div style={{color: '#666', padding: '20px'}}>
                Nothing in {activeTab} yet.
            </div>
        )}
      </div>

    </div>
  );
}