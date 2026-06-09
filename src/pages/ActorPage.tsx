import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActorDetails, getActorCredits, ActorDetails, FilmographyItems } from '../api/creditsApi';
import './ActorPage.css'; // Переконайтеся, що файл стилів існує

const ActorPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [filmography, setFilmography] = useState<FilmographyItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    // Виконуємо два запити паралельно
    Promise.all([
      getActorDetails(id),
      getActorCredits(id)
    ]).then(([detailsData, creditsData]) => {
      // Підлаштуйте під те, як ваш бекенд повертає дані (наприклад data.results)
      setActor(detailsData?.results || detailsData);
      setFilmography(creditsData?.results || []);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Завантаження...</div>;
  if (!actor) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Актора не знайдено</div>;

  return (
    <div className="actor-page" style={{ padding: '80px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="actor-header" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* ФОТО АКТОРA */}
        <div className="actor-photo">
          <img 
            src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Photo'} 
            alt={actor.name} 
            style={{ width: '300px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
        </div>

        {/* ІНФОРМАЦІЯ */}
        <div className="actor-info" style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>{actor.name}</h1>
          <p><strong>Дата народження:</strong> {actor.birthday || 'Невідомо'}</p>
          {actor.deathday && <p><strong>Дата смерті:</strong> {actor.deathday}</p>}
          <p><strong>Місце народження:</strong> {actor.place_of_birth || 'Невідомо'}</p>
          <p><strong>Відомий(а) за:</strong> {actor.known_for_department}</p>
          
          <div className="actor-bio" style={{ marginTop: '20px' }}>
            <h3>Біографія</h3>
            <p style={{ lineHeight: '1.6', color: '#ddd' }}>
              {actor.biography || 'Біографія відсутня.'}
            </p>
          </div>
        </div>
      </div>

      {/* ФІЛЬМОГРАФІЯ (згрупована по роках, як віддає ваш бек) */}
      <div className="actor-filmography" style={{ marginTop: '50px' }}>
        <h2>Фільмографія</h2>
        {filmography.length > 0 ? (
          <div className="filmography-list">
            {filmography.map((item, index) => (
              <div key={index} className="filmography-year-group" style={{ marginBottom: '30px' }}>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>{item.year}</h3>
                <div className="filmography-grid">
                  {item.movies.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit', width: '150px' }}>
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Poster'} 
                        alt={movie.english_title}
                      />
                    <p>{movie.english_title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Немає даних про фільми.</p>
        )}
      </div>
    </div>
  );
};

export default ActorPage;