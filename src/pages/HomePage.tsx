import React from 'react';

// Тестові дані (поки ми не підключили справжнє API)
const TEST_MOVIES = [
  { id: 1, title: "Inception", rating: 8.8, img: "https://image.tmdb.org/t/p/w500/9gk7admal4zlWH9tME55fcae0b6.jpg" },
  { id: 2, title: "Interstellar", rating: 8.6, img: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8AHtMY4kRFW81i8Wu.jpg" },
  { id: 3, title: "Dark Knight", rating: 9.0, img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, title: "Avatar", rating: 7.9, img: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg" },
  { id: 5, title: "Avengers", rating: 8.0, img: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg" },
];

export default function HomePage() {
  return (
    <div style={{ padding: '20px 40px' }}>
      {/* Банер зверху */}
      <header style={{ marginBottom: 40, textAlign: 'center', padding: '50px 0' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>Welcome to Leafy</h1>
        <p style={{ color: '#888', fontSize: '1.2rem' }}>Discover your next favorite movie</p>
      </header>

      {/* Секція: Популярне */}
      <section>
        <h2 style={{ marginBottom: 20, borderLeft: '4px solid #4ade80', paddingLeft: 10 }}>Trending Now</h2>
        
        {/* Горизонтальний скрол */}
        <div style={{ 
            display: 'flex', 
            gap: '20px', 
            overflowX: 'auto', 
            paddingBottom: '20px' 
        }}>
          {TEST_MOVIES.map((movie) => (
            <div key={movie.id} style={{ minWidth: '200px', cursor: 'pointer', transition: '0.2s' }}>
              <img 
                src={movie.img} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} 
              />
              <h3 style={{ fontSize: '1rem', marginTop: 10, marginBottom: 5 }}>{movie.title}</h3>
              <span style={{ color: '#fbbf24' }}>★ {movie.rating}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}