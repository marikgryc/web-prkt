// Це базове посилання для картинок (воно працює без ключів)
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// --- НАШІ ТЕСТОВІ ДАНІ (MOCK DATA) ---
// --- ОНОВЛЕНІ ТЕСТОВІ ДАНІ (MOCK DATA) ---
const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    vote_average: 8.3,
    overview: "Follow the mythic journey of Paul Atreides..."
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    vote_average: 8.1,
    overview: "The story of J. Robert Oppenheimer..."
  },
  {
    id: 3,
    title: "Interstellar",
    poster_path: "/bz9717vMiTw2EGvGxeSOozfS0c.jpg", 
    vote_average: 8.6,
    overview: "The adventures of a group of explorers..."
  },
  {
    id: 4,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    overview: "Batman raises the stakes in his war on crime."
  },
  {
    id: 5,
    title: "Inception",
    // Замінили постер на новіший
    poster_path: "/oYuLEt3zVCKqJCZVPranHvqFy9F.jpg",
    vote_average: 8.8,
    overview: "Cobb, a skilled thief who commits corporate espionage..."
  },
  {
    id: 6,
    title: "Avatar: The Way of Water",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    vote_average: 7.7,
    overview: "Jake Sully lives with his newfound family..."
  },
  {
    id: 7,
    title: "Deadpool & Wolverine",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    vote_average: 7.9,
    overview: "A listless Wade Wilson toils away..."
  },
  {
    id: 8,
    title: "Inside Out 2",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    vote_average: 7.6,
    overview: "Teenager Riley's mind headquarters..."
  }
];


export const getTrendingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};

export const getNowPlayingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].reverse() }), 300);
    });
};

export const getTopRatedMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};

export const getUpcomingMovies = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].sort(() => 0.5 - Math.random()) }), 300);
    });
};

export const getMovieDetails = async (id: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_MOVIES[0]), 300);
    });
};