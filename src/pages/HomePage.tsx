import React, { useEffect, useState } from 'react';
import MovieRow from '../components/MovieRow';
import { 
    getTrendingMovies, 
    getNowPlayingMovies, 
    getTopRatedMovies, 
    getUpcomingMovies, 
    getImageUrl,
    // Переконайся, що Movie експортується з api/tmdbApi.ts, 
    // або розкоментуй інтерфейс нижче
    // Movie 
} from '../api/tmdbApi';
import './HomePage.css'; 

// Якщо Movie не експортується з api файлу, розкоментуй це:
/*
interface Movie {
  id: number;
  poster_path: string;
  backdrop_path?: string;
  title: string;
  overview?: string;
  vote_average: number;
}
*/

// Або використовуй any, якщо ліньки типізувати зараз:
// type Movie = any; 

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
        // Виконуємо всі запити паралельно через твої функції
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

        // Вибираємо випадковий фільм для банера
        const allMovies = nowData.results || [];
        if (allMovies.length > 0) {
            const random = allMovies[Math.floor(Math.random() * allMovies.length)];
            setHeroMovie(random);
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
                backgroundImage: `url("${getImageUrl(heroMovie.backdrop_path || heroMovie.poster_path, 'original')}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
            }}
          >
              <div className="banner-contents">
                  <h1 className="banner-title">
                      {heroMovie.title}
                  </h1>

                  <div className="banner-buttons">
                      <button className="banner-button btn-play">Play</button>
                      <button className="banner-button">More Info</button>
                  </div>

                  {heroMovie.overview && (
                      <h1 className="banner-description">
                          {heroMovie.overview}
                      </h1>
                  )}
              </div>
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