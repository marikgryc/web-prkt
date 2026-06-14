import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, User } from '../api/tmdbApi';
import { GetUserWatchlists } from '../api/watchlist/watchlist';
import './ProfilePage.css';

interface FollowUser {
  user_id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

async function fetchFollowers(userID: number): Promise<FollowUser[]> {
  try {
    const token = localStorage.getItem('jwt_token');
    const res = await fetch(`/api/users/${userID}/followers`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || [];
  } catch { return []; }
}

async function fetchFollowings(userID: number): Promise<FollowUser[]> {
  try {
    const token = localStorage.getItem('jwt_token');
    const res = await fetch(`/api/users/${userID}/followings`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results || [];
  } catch { return []; }
}

async function getOrCreateChat(friendID: number): Promise<number | null> {
  try {
    const token = localStorage.getItem('jwt_token');
    const res = await fetch(`/api/chats/get-or-create/${friendID}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results || null;
  } catch { return null; }
}

async function createWatchlist(name: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('jwt_token');
    const res = await fetch('/api/users/watchlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ name, is_public: true })
    });
    return res.ok;
  } catch { return false; }
}

async function deleteWatchlist(userID: number, watchlistID: number): Promise<boolean> {
  try {
    const token = localStorage.getItem('jwt_token');
    const res = await fetch(`/api/users/${userID}/watchlists/${watchlistID}`, {
      method: 'DELETE',
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return res.ok;
  } catch { return false; }
}

function FollowModal({
  title, users, onClose, onUserClick
}: {
  title: string;
  users: FollowUser[];
  onClose: () => void;
  onUserClick: (id: number) => void;
}) {
  return (
    <div className="follow-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="follow-modal">
        <div className="follow-modal-header">
          <h3>{title}</h3>
          <button className="follow-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="follow-modal-body">
          {users.length === 0 ? (
            <p className="follow-modal-empty">No users yet</p>
          ) : (
            users.map(user => (
              <div key={user.user_id} className="follow-modal-item"
                onClick={() => { onUserClick(user.user_id); onClose(); }}>
                <img
                  src={user.avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                  alt={user.username} className="follow-modal-avatar"
                  onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'; }}
                />
                <div className="follow-modal-info">
                  <span className="follow-modal-name">
                    {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : user.username}
                  </span>
                  <span className="follow-modal-handle">@{user.username}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CreateWatchlistModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onCreate(name.trim());
    setLoading(false);
  };

  return (
    <div className="follow-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="follow-modal">
        <div className="follow-modal-header">
          <h3>Новий список</h3>
          <button className="follow-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="follow-modal-body" style={{ padding: '20px' }}>
          <input
            type="text"
            placeholder="Назва списку..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="watchlist-name-input"
            autoFocus
          />
          <button
            className="message-btn"
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            style={{ marginTop: '12px', width: '100%' }}
          >
            {loading ? 'Створення...' : 'Створити'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('Playlist');
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [modal, setModal] = useState<'followers' | 'followings' | 'create' | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

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
        console.error('Profile load error:', err);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [id, currentUser, authLoading]);

  useEffect(() => {
    if (!profileUser?.user_id) return;
    Promise.all([
      GetUserWatchlists(profileUser.user_id),
      fetchFollowers(profileUser.user_id),
      fetchFollowings(profileUser.user_id),
    ]).then(([lists, f, fi]) => {
      if (lists?.length) setWatchlists(lists);
      setFollowers(Array.isArray(f) ? f : []);
      setFollowings(Array.isArray(fi) ? fi : []);
    });
  }, [profileUser]);

  const handleOpenChat = async () => {
    if (!profileUser?.user_id) return;
    setChatLoading(true);
    const chatId = await getOrCreateChat(profileUser.user_id);
    setChatLoading(false);
    if (chatId) navigate(`/chat/${chatId}`);
  };

  const handleCreateWatchlist = async (name: string) => {
    const ok = await createWatchlist(name);
    if (ok) {
      setModal(null);
      // Перезавантажити список
      const lists = await GetUserWatchlists(profileUser!.user_id);
      if (lists?.length) setWatchlists(lists);
    }
  };

  const handleDeleteWatchlist = async (e: React.MouseEvent, watchlistID: number) => {
    e.stopPropagation();
    if (!profileUser?.user_id) return;
    const ok = await deleteWatchlist(profileUser.user_id, watchlistID);
    if (ok) {
      setWatchlists(prev => prev.filter(w => w.id !== watchlistID));
    }
  };

  if (authLoading || fetching) return <div className="loading-text">Loading profile...</div>;
  if (!profileUser) return <div className="loading-text">User not found. Please log in.</div>;

  const isMyProfile = currentUser?.user_id === profileUser.user_id;
  const avatarUrl = profileUser.avatar_url || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
  const bgUrl = profileUser.bg_img_url;
  const joinDate = profileUser.created_at
    ? new Date(profileUser.created_at).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <div className="profile-page">
      <div className="profile-cover" style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}></div>

      <div className="profile-container">
        <div className="profile-header">
          <img src={avatarUrl} alt={profileUser.username} className="profile-avatar-large"
            onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'; }} />

          <div className="profile-info">
            <div className="profile-names">
              <h1 className="profile-name">{profileUser.first_name} {profileUser.last_name}</h1>
              <p className="profile-handle">@{profileUser.username}</p>
            </div>
            {profileUser.bio && <div className="profile-bio">{profileUser.bio}</div>}
            <span className="profile-joined">Joined {joinDate}</span>
            <div className="profile-stats-row">
              <div className="stat-box clickable" onClick={() => setModal('followings')}>
                <strong>{followings.length}</strong> Following
              </div>
              <div className="stat-box clickable" onClick={() => setModal('followers')}>
                <strong>{followers.length}</strong> Followers
              </div>
              {isMyProfile ? (
                <div className="stat-box logout-btn" onClick={() => { logout(); navigate('/'); }}>
                  Log Out
                </div>
              ) : (
                <button className="message-btn" onClick={handleOpenChat} disabled={chatLoading}>
                  {chatLoading ? '...' : '✉ Написати'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          {['Posts', 'Playlist', 'Saved stories', 'Wishlist'].map((tab) => (
            <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        <div className="posts-section">
          {activeTab === 'Playlist' ? (
            <div>
              {isMyProfile && (
                <button className="create-watchlist-btn" onClick={() => setModal('create')}>
                  + Новий список
                </button>
              )}
              <div className="watchlists-container">
                {watchlists.length > 0 ? (
                  watchlists.map(list => (
                    <div key={list.id} className="watchlist-card" onClick={() => navigate(`/watchlist/${list.id}`)}>
                      <div className="watchlist-card-header">
                        <h4>{list.name}</h4>
                        {isMyProfile && (
                          <button className="watchlist-delete-btn"
                            onClick={(e) => handleDeleteWatchlist(e, list.id)}
                            title="Видалити">✕</button>
                        )}
                      </div>
                      <p>Фільмів: {list.movies_quantity || 0}</p>
                    </div>
                  ))
                ) : (
                  <div className="watchlist-empty">Немає збережених списків.</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#666', fontSize: '1.2rem', marginTop: '20px' }}>
              Content for <b>{activeTab}</b> will appear here.
            </div>
          )}
        </div>
      </div>

      {(modal === 'followers' || modal === 'followings') && (
        <FollowModal
          title={modal === 'followers' ? 'Followers' : 'Following'}
          users={modal === 'followers' ? followers : followings}
          onClose={() => setModal(null)}
          onUserClick={(uid) => navigate(`/profile/${uid}`)}
        />
      )}

      {modal === 'create' && (
        <CreateWatchlistModal
          onClose={() => setModal(null)}
          onCreate={handleCreateWatchlist}
        />
      )}
    </div>
  );
}
