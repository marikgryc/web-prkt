import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl, getMovieCredits, getSimilarMovies } from '../api/tmdbApi';
import MovieRow from '../components/MovieRow'; 
import './MoviePage.css';

interface MovieDetails {
  id: number;
  title: string;
  original_title?: string;
  tagline?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  budget?: number;
  revenue?: number;
  status?: string;
  original_language?: string;
  videos?: {
    results: { key: string; type: string; site: string }[];
  };
  credits?: {
    cast: CastMember[];
    crew: { id: number; name: string; job: string }[];
  };
}

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
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          // ВИПРАВЛЕНО: Додано similarData у деструктуризацію масиву
          const [movieData, creditsData, similarData] = await Promise.all([
            getMovieDetails(Number(id)),
            getMovieCredits(Number(id)),
            getSimilarMovies(Number(id))
          ]);

          setMovie(movieData);
          setCast(creditsData.slice(0, 12));
          setSimilarMovies(similarData); // Тепер ця змінна існує і працює!
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Завантаження...</div>;
  if (!movie) return <div className="movie-page-container" style={{paddingTop: '100px'}}>Фільм не знайдено</div>;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  
  const formatCurrency = (amount?: number) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="movie-page-container">
      <div style={{ height: '70px', width: '100%' }}></div>
      {/* --- HEADER --- */}
      <div className="movie-header">
        <div>
          <h1 className="movie-title">{movie.title}</h1>
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
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
          <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="main-poster" />
        </div>
        
        <div className="backdrop-wrapper">
           {trailer ? (
              <iframe 
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`} 
                title="Trailer" frameBorder="0" allowFullScreen
                className="main-backdrop"
              ></iframe>
           ) : movie.backdrop_path ? (
              <img src={getImageUrl(movie.backdrop_path, 'original')} alt="Backdrop" className="main-backdrop" />
           ) : (
              <div className="main-backdrop no-img">No Media Available</div>
           )}
        </div>

        <div className="actions-column">
          <button className="btn-watchlist"><span className="plus">+</span> Add to Watchlist</button>
          
          <div className="movie-details-box">
            <div className="detail-item"><strong>Status:</strong> {movie.status}</div>
            <div className="detail-item"><strong>Director:</strong> {director?.name || 'Unknown'}</div>
            <div className="detail-item"><strong>Budget:</strong> {formatCurrency(movie.budget)}</div>
            <div className="detail-item"><strong>Revenue:</strong> {formatCurrency(movie.revenue)}</div>
            <div className="detail-item"><strong>Language:</strong> {movie.original_language?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* --- STORYLINE --- */}
      <div className="storyline-section">
          <h2 className="section-title">Storyline</h2>
          <p className="storyline-text">{movie.overview || "Опис фільму відсутній."}</p>
      </div>

      {/* --- TOP CAST --- */}
      {cast.length > 0 && (
        <div className="cast-section">
          <h2 className="section-title">Top Cast</h2>
          <div className="cast-scroller">
            {cast.map(actor => (
              
              <div 
              key={actor.id} 
              className="cast-card" 
              onClick={() => navigate(`/actor/${actor.id}`)}
              style={{ cursor: 'pointer' }}
            >
                <div className="cast-img-wrapper">
                  {actor.profile_path ? (
                    <img src={getImageUrl(actor.profile_path)} alt={actor.name} />
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
        </div>
      )}
      
      {/* --- SIMILAR MOVIES --- */}
      {similarMovies.length > 0 && (
        <div className="similar-movies-section" style={{ marginTop: '40px' }}>
          <h2 className="section-title">Similar Movies</h2>
          <MovieRow title="" movies={similarMovies} />
        </div>
      )}
    </div>
  );
};

export default MoviePage;