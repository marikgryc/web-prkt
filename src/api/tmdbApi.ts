import axiosClient from './axiosClient';

// КОНСТАНТИ
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// --- ФЕЙКОВІ ДАНІ ФІЛЬМІВ (Поки бекенд не готовий) ---
const MOCK_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Two",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", 
    vote_average: 8.3,
    overview: "Follow the mythic journey of Paul Atreides...",
  },
  {
    id: 2,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaB0B.jpg",
    vote_average: 8.1,
    overview: "The story of J. Robert Oppenheimer...",
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/dqK9UFagCOnZOkW2uPvzTRLXZnA.jpg",
    vote_average: 8.5,
    overview: "Batman raises the stakes in his war on crime...",
  },
  {
    id: 4, 
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", 
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    vote_average: 9.3,
    overview: "Chronicles the experiences of a formerly successful banker...",
  },
   {
    id: 5,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/l4QHerTSbMI7qgvxYnFBktmCJqn.jpg",
    vote_average: 8.7,
    overview: "Set in the 22nd century..."
  },
];

// --- ТИПИ ---
export interface User {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  followers?: number;
  followings?: number;
  created_at?: string;
}

export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
}

// --- ФУНКЦІЇ ---

// 1. ЛОГІН (Пробуємо реальний сервер)
// src/api/tmdbApi.ts

export const loginUser = async (loginData: { login: string; password: string }) => {
  try {
      // Чесний запит на сервер
      const response = await axiosClient.post('/login', loginData);
      
      // Якщо сервер відповів 200 ОК -> повертаємо ID
      if (response.status === 200 && response.data) {
          return response.data.result || response.data.results; 
      }
  } catch (error: any) {
      // Якщо помилка (401, 403, 500) -> викидаємо її, щоб інтерфейс показав "Невірний пароль"
      console.error("Login failed:", error);
      throw error; 
  }
};

// 2. ПРОФІЛЬ (Пробуємо реальний сервер)
export const getUserProfile = async (id: number) => {
    try {
        const response = await axiosClient.get(`/users/${id}`);
        // Сервер повертає масив results навіть для одного юзера (судячи зі скріну)
        const data = response.data.results;
        // Якщо це масив - беремо перший елемент, якщо об'єкт - повертаємо його
        return Array.isArray(data) ? data[0] : data;
    } catch (error) {
        console.error("Get User API failed. Using Mock User.");
        // Повертаємо фейкового юзера тільки якщо сервер впав
        return {
            user_id: id,
            username: "offline_user",
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            avatar_url: "",
            followers: 0,
            followings: 0
        };
    }
};

// 3. ФІЛЬМИ (ТИМЧАСОВО ФЕЙКОВІ, БО НА СЕРВЕРІ 404)
export const getPopularMovies = async () => {
    // Коли бекенд пофіксять, розкоментуй цей блок:
    /* try {
        const response = await axiosClient.get('/movie/popular');
        const data = response.data.result || [];
        return { results: Array.isArray(data) ? data : [data] };
    } catch (e) { console.log(e); }
    */

    // А поки повертаємо це:
    return new Promise((resolve) => {
        setTimeout(() => resolve({ results: MOCK_MOVIES }), 300);
    });
};

export const getGenres = async () => {
    return { genres: [{id: 1, name: "Drama"}, {id: 2, name: "Action"}] };
};

// --- АЛІАСИ ---
export const getTrendingMovies = getPopularMovies; 
export const getNowPlayingMovies = async () => {
     return new Promise((resolve) => {
        setTimeout(() => resolve({ results: [...MOCK_MOVIES].reverse() }), 300);
    });
};
export const getTopRatedMovies = getPopularMovies;
export const getUpcomingMovies = getPopularMovies;

export const getMovieDetails = async (id: number) => {
    return new Promise((resolve) => {
        const movie = MOCK_MOVIES.find((m) => m.id === Number(id)) || MOCK_MOVIES[0];
        setTimeout(() => resolve(movie), 300);
    });
};

export const getActorDetails = async (id: number) => {
    return {
        id: id,
        name: "Unknown Actor",
        biography: "Biography not available yet.",
        profile_path: null,
        known_for: []
    };
};