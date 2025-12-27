import { useEffect, useState } from 'react';
import { getUserProfile } from '../api/auth/loginPageApi'; 
import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar-placeholder">
           {/* Якщо є фото, можна використати <img src={user.avatar} /> */}
           <span>{user?.name?.[0] || 'U'}</span>
        </div>
        
        <h1>{user?.name || 'Гість'}</h1>
        <p className="email">{user?.email || 'email@example.com'}</p>

        <div className="stats-row">
           <div className="stat">
             <strong>12</strong>
             <span>Lists</span>
           </div>
           <div className="stat">
             <strong>45</strong>
             <span>Watched</span>
           </div>
        </div>

        <button className="edit-btn">Редагувати профіль</button>
      </div>
    </div>
  );
}