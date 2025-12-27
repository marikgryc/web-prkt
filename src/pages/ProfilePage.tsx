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

  // Поки дані не підтягнулися з контексту, показуємо завантаження
  if (!user) {
      return <div className="profile-page" style={{color: 'white', paddingTop: '100px', textAlign: 'center'}}>Loading user info...</div>;
  }

  // Якщо аватарка прийшла пуста або null, ставимо заглушку
  const avatarUrl = user.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";

  // Форматуємо дату реєстрації (з 2025-12-11T... робимо читабельну дату)
  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString() 
    : "Unknown date";

  return (
    <div className="profile-page">
      
      {/* --- ШАПКА ПРОФІЛЮ (User Info) --- */}
      <div className="profile-header">
        
        {/* 1. АВАТАРКА */}
        <img 
          src={avatarUrl} 
          alt={user.username} 
          className="profile-avatar-large"
          // Якщо посилання на картинку бите (404), замінюємо на заглушку
          onError={(e) => {
            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
          }}
        />

        <div className="profile-info">
          
          {/* 2. ІМ'Я ТА ПРІЗВИЩЕ (Великим шрифтом) */}
          <h1 className="profile-name">
            {user.first_name} {user.last_name}
          </h1>

          {/* 3. НІКНЕЙМ (Сірим, через @) */}
          <p className="profile-handle">@{user.username}</p>

          {/* 4. ДАТА РЕЄСТРАЦІЇ */}
          <span className="profile-joined">Joined {joinDate}</span>

          {/* 5. СТАТИСТИКА (Followers / Following) */}
          <div className="profile-stats-row">
            <div className="stat-box">
                {user.followings || 0} Following
            </div>
            <div className="stat-box">
                {user.followers || 0} Followers
            </div>
            <div className="stat-box">Posts: 1</div>
            
            {/* Кнопка виходу */}
            <div className="stat-box logout-btn" onClick={handleLogout}>
               Log Out
            </div>
          </div>

          {/* 6. ЖАНРИ (Поки статичні, бо в API їх немає в юзері) */}
          <div className="top-genres">
            <span className="genre-label">Top Genres</span>
            <span className="genre-tag genre-drama">Drama</span>
            <span className="genre-tag genre-action">Action</span>
          </div>

        </div>
      </div>

      {/* --- ВКЛАДКИ (Меню) --- */}
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

      {/* --- КОНТЕНТ (Поки просто текст, що розділ пустий) --- */}
      <div className="posts-section">
        <div style={{color: '#666', fontSize: '1.2rem', marginTop: '20px'}}>
            Content for <b>{activeTab}</b> will appear here.
        </div>
      </div>

    </div>
  );
}