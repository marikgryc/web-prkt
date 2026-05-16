import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetWatchlistMovies } from '../api/watchlist/watchlist';

export default function WatchlistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      if (id) {
        setLoading(true);
        const data = await GetWatchlistMovies(Number(id));
        if (data && data.length > 0) {
          setMovies(data);
        }
        setLoading(false);
      }
    }
    loadMovies();
  }, [id]);

  if (loading) {
    return <div style={{ paddingTop: '100px', textAlign: 'center', color: 'white' }}>Завантаження фільмів...</div>;
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '80px 20px 20px', color: 'white' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        ← Назад
      </button>

      <h2>Фільми у списку</h2>

      {movies.length === 0 ? (
        <p style={{ color: '#aaa' }}>Цей список поки що порожній.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          {movies.map((movie) => (
            <div 
              key={movie.movie_id || movie.imdb_id} 
              onClick={() => navigate(`/movie/${movie.movie_id}`)} // Перехід на сторінку фільму
              style={{ width: '150px', cursor: 'pointer', textAlign: 'center' }}
            >
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Image'} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', height: '225px' }}
              />
              <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold' }}>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}