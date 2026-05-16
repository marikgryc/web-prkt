import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, User } from '../api/tmdbApi';
import { GetUserWatchlists } from '../api/watchlist/watchlist'; // ДОДАНО ІМПОРТ
import './ProfilePage.css';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>(); 
  const { user: currentUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('Wishlist'); // За замовчуванням відкриємо Wishlist

  // Стан для списків (вотчлістів)
  const [watchlists, setWatchlists] = useState<any[]>([]);

  // 1. Завантаження профілю
  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;

      try {
        if (id) {
          setFetching(true);
          const data = await getUserProfile(Number(id));
          setProfileUser(data);
        } else if (currentUser) {
          setProfileUser(currentUser);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [id, currentUser, authLoading]);

  // 2. Завантаження вотчлістів, коли профіль вже завантажено
  useEffect(() => {
    async function loadWatchlists() {
      // Якщо користувач завантажився і в нього є user_id
      if (profileUser?.user_id) {
        const lists = await GetUserWatchlists(profileUser.user_id);
        if (lists?.length) {
          setWatchlists(lists);
        }
      }
    }
    loadWatchlists();
  }, [profileUser]); // Викликаємо щоразу, коли змінюється profileUser

  if (authLoading || fetching) {
    return <div className="loading-text">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="loading-text">User not found. Please log in.</div>;
  }

  const isMyProfile = currentUser?.user_id === profileUser.user_id;
  const avatarUrl = profileUser.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
  const bgUrl = profileUser.bg_img_url; 

  const joinDate = profileUser.created_at 
    ? new Date(profileUser.created_at).toLocaleDateString() 
    : "Unknown date";

  return (
    <div className="profile-page">
      
      <div 
        className="profile-cover" 
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
      ></div>

      <div className="profile-container">
        <div className="profile-header">
          <img 
            src={avatarUrl} 
            alt={profileUser.username} 
            className="profile-avatar-large"
            onError={(e) => {
              e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png";
            }}
          />

          <div className="profile-info">
            <div className="profile-names">
                <h1 className="profile-name">
                {profileUser.first_name} {profileUser.last_name}
                </h1>
                <p className="profile-handle">@{profileUser.username}</p>
            </div>

            {profileUser.bio && (
                <div className="profile-bio">
                    {profileUser.bio}
                </div>
            )}

            <span className="profile-joined">Joined {joinDate}</span>

            <div className="profile-stats-row">
              <div className="stat-box">
                  <strong>{profileUser.followings || 0}</strong> Following
              </div>
              <div className="stat-box">
                  <strong>{profileUser.followers || 0}</strong> Followers
              </div>
              
              {isMyProfile && (
                <div className="stat-box logout-btn" onClick={() => { logout(); navigate('/'); }}>
                   Log Out
                </div>
              )}
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

        {/* Секція контенту залежно від обраної вкладки */}
        <div className="posts-section">
          {activeTab === 'Wishlist' || activeTab === 'Playlist' ? (
            <div className="watchlists-container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
              {watchlists.length > 0 ? (
                watchlists.map(list => (
                  <div 
                    key={list.id} 
                    className="watchlist-card" 
                    style={{ 
                      padding: '15px', 
                      border: '1px solid #ccc', 
                      borderRadius: '8px', 
                      minWidth: '200px' 
                    }}
                  >
                    <h4 style={{ margin: '0 0 10px 0' }}>{list.name}</h4>
                    <p style={{ margin: 0, color: '#666' }}>Кількість фільмів: {list.movies_quantity || 0}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: '#666', fontSize: '1.1rem' }}>Немає збережених списків.</div>
              )}
            </div>
          ) : (
            <div style={{color: '#666', fontSize: '1.2rem', marginTop: '20px'}}>
                Content for <b>{activeTab}</b> will appear here.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}