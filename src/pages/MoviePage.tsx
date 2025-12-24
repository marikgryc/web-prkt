import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieDetails, IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../api/tmdbApi';
import './MoviePage.css';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovieDetails(Number(id));
      setMovie(data);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="movie-page-container">
      
      {/* 1. Заголовок і Рейтинг */}
      <header className="movie-header">
        <div className="header-left">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta-line">
            <span>2024</span> • <span>PG-13</span> • <span>2h 46m</span>
          </div>
        </div>
        <div className="header-right">
            <span className="imdb-label">IMDb Rating</span>
            <div className="imdb-score">
                <span className="star">★</span> 
                <span className="score">{movie.vote_average}</span><span className="max-score">/10</span>
            </div>
        </div>
      </header>

      {/* 2. Головна сітка: Постер | Кадр | Кнопки */}
      <section className="media-grid">
        {/* Постер */}
        <div className="poster-column">
            <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt="Poster" className="main-poster" />
        </div>
        
        {/* Центральний кадр (відео) */}
        <div className="video-column">
            <img src={`${BACKDROP_BASE_URL}${movie.backdrop_path || movie.poster_path}`} alt="Scene" className="main-backdrop" />
        </div>

        {/* Права колонка (Кнопки) */}
        <div className="actions-column">
            <div className="placeholder-box"></div> {/* Сірі квадрати з дизайну */}
            <div className="placeholder-box"></div>
            
            <button className="btn-watchlist">
                <span className="plus">+</span> Add to Watchlist
            </button>
            <button className="btn-recommend">
                Recommend
            </button>
        </div>
      </section>

      {/* 3. Жанри і Кредити */}
      <section className="details-section">
        <div className="genres-list">
            {movie.genres && movie.genres.map((g: string) => (
                <span key={g} className="genre-pill">{g}</span>
            ))}
        </div>

        <div className="credits-list">
            <div className="credit-row">
                <span className="credit-label">Director</span>
                <span className="credit-value link">{movie.director}</span>
            </div>
            <div className="credit-row">
                <span className="credit-label">Writers</span>
                <span className="credit-value link">{movie.writers}</span>
            </div>
            <div className="credit-row">
    <span className="credit-label">Stars</span>
    <div className="credit-values">
        {/* Розбиваємо рядок "Actor 1, Actor 2" на масив і малюємо окремо */}
        {movie.stars.split(', ').map((starName: string, index: number) => (
            <span 
                key={index} 
                className="credit-value link"
                onClick={() => navigate('/actor/123')} // Тимчасово ведемо всіх на ID 123 (Гослінга)
                style={{ cursor: 'pointer', color: '#5799ef', marginRight: '5px' }}
            >
                {starName}{index < movie.stars.split(', ').length - 1 ? ',' : ''}
            </span>
        ))}
    </div>
</div>
        </div>
      </section>

      {/* 4. Секція Фото (Gallery) */}
      <section className="photos-section">
          <h2 className="section-title">Photos</h2>
          <div className="photos-grid">
              {movie.gallery && movie.gallery.map((img: string, i: number) => (
                  <img key={i} src={`${IMAGE_BASE_URL}${img}`} alt="Gallery" />
              ))}
              {}
              <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt="Gallery" />
          </div>
      </section>

      {/* 5. Storyline */}
      <section className="storyline-section">
          <h2 className="section-title">Storyline</h2>
          <p className="storyline-text">{movie.overview}</p>
      </section>

    </div>
  );
}