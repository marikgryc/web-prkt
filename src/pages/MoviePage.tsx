import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl, getMovieCredits, getSimilarMovies } from '../api/tmdbApi';
import MovieRow from '../components/MovieRow'; 
import { GetUserWatchlists, AddWatchlistItem } from '../api/watchlist/watchlist';
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
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface WatchlistOption {
  id: number;
  name: string;
  movies_quantity?: number;
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<CrewMember | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const [showModal, setShowModal] = useState(false);
  const [watchlists, setWatchlists] = useState<WatchlistOption[]>([]);
  const [loadingWatchlists, setLoadingWatchlists] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null); 
  const [addedTo, setAddedTo] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const [movieData, creditsData, similarData] = await Promise.all([
            getMovieDetails(Number(id)),
            getMovieCredits(Number(id)),
            getSimilarMovies(Number(id))
          ]);

          setMovie(movieData?.results || movieData);

          let actualCast = [];
          if (Array.isArray(creditsData)) {
            actualCast = creditsData;
          } else if (creditsData?.results && Array.isArray(creditsData.results)) {
            actualCast = creditsData.results;
          } else if (creditsData?.cast && Array.isArray(creditsData.cast)) {
            actualCast = creditsData.cast;
          }

          setCast(actualCast.slice(0, 15));
          setDirector(null);
          setSimilarMovies(similarData?.results || similarData || []);
        }
      } catch (error) {
        console.error("РџРѕРјРёР»РєР° Р·Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ РґР°РЅРёС… С„С–Р»СЊРјСѓ:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleOpenModal = async () => {
    setShowModal(true);
    setAddedTo([]);
    setLoadingWatchlists(true);
    try {
      const userId = Number(localStorage.getItem('cinelink_user_id'));
      const data = await GetUserWatchlists(userId);
      setWatchlists(Array.isArray(data) ? data : []);
    } catch (err) {
    } finally {
      setLoadingWatchlists(false);
    }
  };

  const handleAddToWatchlist = async (watchlistId: number) => {
    if (!movie) return;
    setAddingTo(watchlistId);
    try {
      const userId = Number(localStorage.getItem('cinelink_user_id'));
      await AddWatchlistItem({
        user_id: userId,
        movie_id: movie.id,
        watchlist_id: watchlistId,
      });
      setAddedTo(prev => [...prev, watchlistId]);
    } catch (err) {
    } finally {
      setAddingTo(null);
    }
  };

  if (loading) return <div className="movie-page-container" style={{paddingTop: '100px', color: 'white', textAlign: 'center'}}>Р—Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ...</div>;
  if (!movie) return <div className="movie-page-container" style={{paddingTop: '100px', color: 'white', textAlign: 'center'}}>Р¤С–Р»СЊРј РЅРµ Р·РЅР°Р№РґРµРЅРѕ</div>;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  
  const formatCurrency = (amount?: number) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="movie-page-container">
      <div style={{ height: '70px', width: '100%' }}></div>
  
      <div className="movie-header">
        <div>
          <h1 className="movie-title">{movie.title}</h1>
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}
          <div className="movie-meta-line">
            {year} {movie.genres?.map(g => g.name).join(', ')}
          </div>
        </div>

        <div className="header-right">
          <span className="imdb-label">RATING</span>
          <div className="imdb-score">
            <span className="star">★</span>
            <span className="score">{(movie.vote_average || 0).toFixed(1)}</span>
            <span className="max-score">/10</span>
          </div>
        </div>
      </div>

      <div className="media-grid">
        <div className="poster-wrapper">
          <img 
            src={movie.poster_path ? getImageUrl(movie.poster_path) : 'https://via.placeholder.com/300x450?text=No+Poster'} 
            alt={movie.title} 
            className="main-poster" 
          />
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
          <button className="btn-watchlist" onClick={handleOpenModal}>
            <span className="plus">+</span> Add to Watchlist
          </button>
          
          <div className="movie-details-box">
            <div className="detail-item"><strong>Status:</strong> {movie.status || 'Released'}</div>
            <div className="detail-item"><strong>Director:</strong> {director?.name || 'Unknown'}</div>
            <div className="detail-item"><strong>Budget:</strong> {formatCurrency(movie.budget)}</div>
            <div className="detail-item"><strong>Revenue:</strong> {formatCurrency(movie.revenue)}</div>
            <div className="detail-item"><strong>Language:</strong> {movie.original_language?.toUpperCase() || 'EN'}</div>
          </div>
        </div>
      </div>

      <div className="storyline-section">
          <h2 className="section-title">Storyline</h2>
          <p className="storyline-text">{movie.overview || "РћРїРёСЃ С„С–Р»СЊРјСѓ РІС–РґСЃСѓС‚РЅС–Р№."}</p>
      </div>

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
  
      {similarMovies.length > 0 && (
        <div className="similar-movies-section" style={{ marginTop: '40px' }}>
          <h2 className="section-title">Similar Movies</h2>
          <MovieRow title="" movies={similarMovies} />
        </div>
      )}

      {showModal && (
        <div 
          className="watchlist-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="watchlist-modal">
            <div className="watchlist-modal-header">
              <h3>Add to Watchlist</h3>
              <button className="watchlist-modal-close" onClick={() => setShowModal(false)}>X</button>
            </div>

            <div className="watchlist-modal-body">
              {loadingWatchlists ? (
                <p className="watchlist-modal-loading">Loading your lists...</p>
              ) : watchlists.length === 0 ? (
                <p className="watchlist-modal-empty">You have no watchlists yet.</p>
              ) : (
                watchlists.map(wl => {
                  const isAdded = addedTo.includes(wl.id);
                  const isAdding = addingTo === wl.id;
                  return (
                    <div key={wl.id} className="watchlist-modal-item">
                      <div className="watchlist-modal-item-info">
                        <span className="watchlist-modal-item-name">{wl.name}</span>
                        <span className="watchlist-modal-item-count">
                          {wl.movies_quantity ?? 0} films
                        </span>
                      </div>
                      <button
                        className={`watchlist-modal-add-btn ${isAdded ? 'added' : ''}`}
                        onClick={() => !isAdded && handleAddToWatchlist(wl.id)}
                        disabled={isAdding || isAdded}
                      >
                        {isAdding ? '...' : isAdded ? '“ Added' : '+ Add'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
