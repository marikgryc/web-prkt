import React, { useEffect, useState } from 'react';
import MovieRow from '../components/MovieRow';
import { 
    getTrendingMovies, 
    getNowPlayingMovies, 
    getTopRatedMovies, 
    getUpcomingMovies, 
    BACKDROP_BASE_URL 
} from '../api/tmdbApi';
import './HomePage.css'; 

export default function HomePage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  
  const [heroMovie, setHeroMovie] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const [trendData, nowData, topData, upData] = await Promise.all([
        getTrendingMovies(),
        getNowPlayingMovies(),
        getTopRatedMovies(),
        getUpcomingMovies()
      ]);

      setTrending(trendData.results || []);
      setNowPlaying(nowData.results || []);
      setTopRated(topData.results || []);
      setUpcoming(upData.results || []);

      if (trendData.results && trendData.results.length > 0) {
        const moviesWithBackdrop = trendData.results.filter((m: any) => m.backdrop_path);
        const candidates = moviesWithBackdrop.length > 0 ? moviesWithBackdrop : trendData.results;
        const random = candidates[Math.floor(Math.random() * candidates.length)];
        setHeroMovie(random);
      }
    };

    loadData();
  }, []);

  const truncate = (str: string, n: number) => {
      return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="home-container">
      
    
      {heroMovie && (
          <header 
            className="banner"
            style={{
                backgroundImage: `url("${BACKDROP_BASE_URL}${heroMovie.backdrop_path || heroMovie.poster_path}")`,
            }}
          >
              <div className="banner-contents">
                  <h1 className="banner-title">
                      {heroMovie.title || heroMovie.name || heroMovie.original_name}
                  </h1>

                  <div className="banner-buttons">
                      <button className="banner-button btn-play">Play</button>
                      <button className="banner-button">More Info</button>
                  </div>

                  <h1 className="banner-description">
                      {truncate(heroMovie.overview, 150)}
                  </h1>
              </div>

              <div className="banner-fadeBottom" />
          </header>
      )}

      <div style={{ marginTop: '-20px', position: 'relative', zIndex: 10 }}>
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Now in Cinemas" movies={nowPlaying} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Upcoming" movies={upcoming} />
      </div>

    </div>
  );
}