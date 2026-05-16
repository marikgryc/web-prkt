import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    getTrendingMovies, 
    getNowPlayingMovies, 
    getTopRatedMovies, 
    getUpcomingMovies, 
    getImageUrl,
    fetchMovieOfTheDay 
} from '../api/tmdbApi';
import MovieRow from '../components/MovieRow';
import './HomePage.css'; 

export default function HomePage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [heroMovie, setHeroMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendData, nowData, topData, upData, dailyMovie] = await Promise.all([
            getTrendingMovies(),
            getNowPlayingMovies(),
            getTopRatedMovies(),
            getUpcomingMovies(),
            fetchMovieOfTheDay()    
        ]);
        setTrending(trendData.results || []);
        setNowPlaying(nowData.results || []);
        setTopRated(topData.results || []);
        setUpcoming(upData.results || []);
        if (dailyMovie) {
            setHeroMovie(dailyMovie);
        } else if (trendData.results?.length > 0) {
            setHeroMovie(trendData.results[0]);
        }

      } catch (err) {
          console.error("Error loading home page data", err);
      } finally {
          setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="home-loader">Loading...</div>;

  return (
    <div className="home-container">
      
      {/* HERO BANNER */}
     {heroMovie && (
  <header 
    className="banner"
    style={{
      backgroundSize: "cover",
      // Використовуємо BackdropPath для широкого формату
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(17,17,17,1) 100%), 
                        url("${getImageUrl(heroMovie.backdrop_path || heroMovie.poster_path, 'original')}")`,
      backgroundPosition: "center 20%",
    }}
  >
    <div className="banner-contents">
      <h1 className="banner-title">
        {heroMovie.title || heroMovie.name}
      </h1>

      <div className="banner-buttons">
      
        <Link to={`/movie/${heroMovie.movie_id}`}>
          <button className="banner-button">More Info</button>
        </Link>
      </div>

      {/* Опис (якщо додаси його в структуру на бекенді) */}
      {heroMovie.overview && (
        <h1 className="banner-description">
          {heroMovie.overview.length > 150 
            ? heroMovie.overview.substring(0, 150) + "..." 
            : heroMovie.overview}
        </h1>
      )}
    </div>
    {/* Градієнт знизу для плавного переходу до списків */}
    <div className="banner-fadeBottom" />
  </header>
)}
      {/* РЯДКИ ФІЛЬМІВ */}
      <div style={{ marginTop: '-20px', position: 'relative', zIndex: 10 }}>
        {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} />}
        {nowPlaying.length > 0 && <MovieRow title="Now in Cinemas" movies={nowPlaying} />}
        {topRated.length > 0 && <MovieRow title="Top Rated" movies={topRated} />}
        {upcoming.length > 0 && <MovieRow title="Upcoming" movies={upcoming} />}
      </div>
    </div>
  );
}