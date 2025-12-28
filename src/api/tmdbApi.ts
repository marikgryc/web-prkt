import axiosClient from './axiosClient';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
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
  bg_img_url?:		string;
}

export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
}

// --- API ЗАПИТИ ---
export const loginUser = async (loginData: { login: string; password: string }) => {
    try {
        const response = await axiosClient.post('/login', loginData);
        if (response.status === 200 && response.data) {
            return response.data.results || response.data.result; 
        }
    } catch (error: any) {
        console.error("Login Error:", error);
        throw error;
    }
};

// 2. ПРОФІЛЬ
export const getUserProfile = async (id: number) => {
    try {
        const response = await axiosClient.get(`/users/${id}`);
        return response.data.results; 
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

export const getPopularMovies = async () => {
    try {
        console.log("📡 Стукаємо за фільмами на: /movies/popular");
        const response = await axiosClient.get('/movies/popular');
        
        console.log("✅ Відповідь сервера фільмів:", response.data); 

        const serverData = response.data.result || response.data.results;

        if (Array.isArray(serverData) && serverData.length > 0) {
            console.log("🎬 Знайдено фільми на сервері!");
            return { results: serverData };
        } else if (serverData && !Array.isArray(serverData)) {
             return { results: [serverData] };
        }
        console.warn("⚠️ Сервер дав пустий список. Показуємо MOCK_MOVIES.");
        return { results: MOCK_MOVIES };

    } catch (error) {
        console.error("❌ Помилка API фільмів (або 404). Використовуємо MOCK_MOVIES.", error);
        return { results: MOCK_MOVIES };
    }
};

export const getGenres = async () => {
    try {
        const response = await axiosClient.get('/movies/genres');
        return response.data;
    } catch (error) {
        return { genres: [] };
    }
};

// Аліаси
export const getTrendingMovies = getPopularMovies; 
export const getNowPlayingMovies = getPopularMovies;
export const getTopRatedMovies = getPopularMovies;
export const getUpcomingMovies = getPopularMovies;

export const getMovieDetails = async (id: number) => {
    console.log(`📡 Запит деталів фільму ID: ${id}`);
    
    // Виконуємо запит
    const response = await axiosClient.get(`/movies/${id}`);
    
    console.log("✅ Відповідь сервера (Details):", response.data);
  
    // Перевіряємо різні варіанти, де можуть лежати дані
    const data = response.data.result || response.data.results || response.data;
  
    if (!data) {
       console.warn("⚠️ Сервер повернув відповідь, але даних про фільм не знайдено (data is null/undefined)");
    }
  
    return data;
  };
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) {
  
    return 'https://via.placeholder.com/500x750?text=No+Image'; 
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
export const getActorDetails = async (id: number) => {
    return { id, name: "Actor Info Unavailable", biography: "", profile_path: null, known_for: [] };
};