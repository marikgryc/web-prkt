import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActorDetails, IMAGE_BASE_URL } from '../api/tmdbApi';
import './ActorPage.css';

export default function ActorPage() {
  const { id } = useParams();

  const [actor, setActor] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getActorDetails(Number(id));
      setActor(data);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (!actor) return <div className="loading">Loading...</div>;

  return (
    <div className="actor-page-container">
      <div className="actor-card">
        
        {/* Верхня частина: Фото + Інфо */}
        <div className="actor-header">
          <div className="actor-photo-wrapper">
             <img 
                src={`${IMAGE_BASE_URL}${actor.profile_path}`} 
                alt={actor.name} 
                className="actor-photo" 
             />
          </div>
          
          <div className="actor-info">
            <h1 className="actor-name">{actor.name}</h1>
            <button className="btn-follow">Follow</button>

            <div className="info-grid">
              <div className="info-row">
                <span className="label">Birthday:</span>
                <span className="value">{actor.birthday}</span>
              </div>
              <div className="info-row">
                <span className="label">Gender:</span>
                <span className="value">{actor.gender}</span>
              </div>
              <div className="info-row">
                <span className="label">Rating:</span>
                <span className="value">{actor.rating}</span>
              </div>
              <div className="info-row">
                <span className="label">Place of Birth:</span>
                <span className="value">{actor.place_of_birth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Біографія */}
        <div className="section">
          <h2 className="section-title">Bio</h2>
          <p className="bio-text">{actor.biography}</p>
        </div>

        {/* Фільмографія (Known for) */}
        <div className="section">
          <h2 className="section-title">Known for</h2>
          <div className="known-grid">
            {actor.known_for.map((movie: any) => (
              <div key={movie.id} className="known-item" onClick={() => navigate(`/movie/${movie.id}`)}>
                <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                <span className="known-title">{movie.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}