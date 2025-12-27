import React, { useEffect, useState } from 'react';
import MovieRow from '../components/MovieRow';
import { getTrendingMovies, getNowPlayingMovies, getTopRatedMovies, getUpcomingMovies } from '../api/tmdbApi';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

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
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '20px 0', minHeight: '100vh' }}>
      
      
      <div style={{ textAlign: 'center', padding: '60px 20px', position: 'relative', zIndex: 2 }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, fontWeight: 800 }}>
          Welcome to <span style={{ color: 'var(--primary-green)' }}>Cinelink</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem', marginTop: 10 }}>
          Millions of movies, TV shows and people to discover.
        </p>
      </div>

      {/* Рядки з фільмами */}
      <MovieRow title="Trending Now" movies={trending} />
      <MovieRow title="Now in Cinemas" movies={nowPlaying} />
      <MovieRow title="Top Rated" movies={topRated} />
      <MovieRow title="Upcoming" movies={upcoming} />

    </div>
  );
}