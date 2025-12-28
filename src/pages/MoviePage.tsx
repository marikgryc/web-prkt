import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl } from '../api/tmdbApi';
import './MoviePage.css'; // Ваші стилі підключаються тут

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const data = await getMovieDetails(Number(id));
          setMovie(data);
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Завантаження...</div>;
  if (!movie) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Фільм не знайдено</div>;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    // Використовуємо клас контейнера з вашого CSS
    <div className="movie-page-container">
      
      {/* 1. ШАПКА (Назва та рейтинг) - клас .movie-header */}
      <div className="movie-header">
        <div>
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta-line">
            {year} • {movie.runtime} хв • {movie.genres?.map(g => g.name).join(', ')}
          </div>
        </div>

        <div className="header-right">
          <span className="imdb-label">IMDb RATING</span>
          <div className="imdb-score">
            <span className="star">★</span>
            <span className="score">{(movie.vote_average || 0).toFixed(1)}</span>
            <span className="max-score">/10</span>
          </div>
        </div>
      </div>

      {/* 2. СІТКА МЕДІА (Постер, Фон, Кнопки) - клас .media-grid */}
      <div className="media-grid">
        
        {/* Колонка 1: Постер */}
        <div className="poster-wrapper">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title} 
            className="main-poster"
          />
        </div>

        {/* Колонка 2: Великий фон (Backdrop) */}
        <div className="backdrop-wrapper">
           {movie.backdrop_path ? (
              <img 
                src={getImageUrl(movie.backdrop_path, 'original')} 
                alt="Backdrop" 
                className="main-backdrop"
              />
           ) : (
              <div className="main-backdrop" style={{background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                No Image
              </div>
           )}
        </div>

        {/* Колонка 3: Дії (Watchlist) */}
        <div className="actions-column">
          <button className="btn-watchlist">
            <span className="plus">+</span> Add to Watchlist
          </button>
          
          <div className="placeholder-box">
             {/* Тут можна додати кількість відгуків чи іншу інфу */}
             <div style={{padding: '15px', color: '#888', textAlign: 'center'}}>
                More details coming soon
             </div>
          </div>
        </div>
      </div>

      {/* 3. ЖАНРИ та ОПИС */}
      <div className="genres-list">
        {movie.genres?.map(g => (
          <span key={g.id} className="genre-pill">
            {g.name}
          </span>
        ))}
      </div>

      <h2 className="section-title">Storyline</h2>
      <p className="storyline-text">
        {movie.overview || "Опис фільму відсутній."}
      </p>

    </div>
  );
};

export default MoviePage;