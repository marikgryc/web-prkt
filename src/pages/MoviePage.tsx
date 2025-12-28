import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// НЕ ЗАБУДЬТЕ імпортувати нову функцію getMovieCredits
import { getMovieDetails, getImageUrl, getMovieCredits } from '../api/tmdbApi';
import './MoviePage.css';

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

// 1. Додаємо інтерфейс для актора
interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  // 2. Додаємо стан для акторів
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Виконуємо обидва запити паралельно
          const [movieData, creditsData] = await Promise.all([
            getMovieDetails(Number(id)),
            getMovieCredits(Number(id))
          ]);

          setMovie(movieData);
          // Беремо, наприклад, перших 10-12 акторів, щоб не перевантажувати сторінку
          setCast(creditsData.slice(0, 12));
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Завантаження...</div>;
  if (!movie) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Фільм не знайдено</div>;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div className="movie-page-container">
      
      {/* --- HEADER --- */}
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

      {/* --- MEDIA GRID --- */}
      <div className="media-grid">
        <div className="poster-wrapper">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title} 
            className="main-poster"
          />
        </div>
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
        <div className="actions-column">
          <button className="btn-watchlist">
            <span className="plus">+</span> Add to Watchlist
          </button>
          <div className="placeholder-box">
             <div style={{padding: '15px', color: '#888', textAlign: 'center'}}>
                More details coming soon
             </div>
          </div>
        </div>
      </div>

      {/* --- GENRES --- */}
      <div className="genres-list">
        {movie.genres?.map(g => (
          <span key={g.id} className="genre-pill">
            {g.name}
          </span>
        ))}
      </div>

      {/* --- STORYLINE --- */}
      <h2 className="section-title">Storyline</h2>
      <p className="storyline-text">
        {movie.overview || "Опис фільму відсутній."}
      </p>

      {/* --- 3. НОВИЙ БЛОК: TOP CAST --- */}
      {cast.length > 0 && (
        <>
          <h2 className="section-title">Top Cast</h2>
          <div className="cast-scroller">
            {cast.map(actor => (
              <div key={actor.id} className="cast-card">
                <div className="cast-img-wrapper">
                  {actor.profile_path ? (
                    <img 
                      src={getImageUrl(actor.profile_path)} 
                      alt={actor.name} 
                    />
                  ) : (
                    <div className="no-photo">No Photo</div>
                  )}
                </div>
                <div className="cast-info">
                  <div className="actor-name">{actor.name}</div>
                  <div className="actor-character">{actor.character}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default MoviePage;