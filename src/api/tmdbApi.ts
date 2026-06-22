import axios from 'axios'; 
export const API_KEY = '9e7bd8c8c4fc2bdc7be7b6739338fe43';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const MY_BACKEND_URL = '/api/';
//http://113.30.191.198:808/
const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'uk-UA',
    }
});
const myBackendClient = axios.create({
    baseURL: MY_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
       
    }
});
export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
    bio?: string;      // Додано
    followers?: number; // Додано
    followings?: number;// Додано
    bg_img_url?: string;// Додано
    created_at?: string;
    is_active?: boolean;
}

export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview?: string;
    vote_average: number;
    release_date?: string;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}


export interface UserSearch {
  user_id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_active?: boolean;
}

export interface MovieSearchItem {
  id?: number; // Зверни увагу, бекенд віддає 'id' замість 'movie_id' у пошуку
  title?: string;
  poster_path?: string;
  profile_path?: string;
  imdb_rating?: number;
  name: string;
  media_type: string;
}

export interface CreditSearch {
  credit_id: number;
  name: string;
  profile_path?: string;
}

export interface WatchlistSearch {
  watchlist_id: number;
  name: string;
  fg_img_url: string;
  creator: string;
  movies_quantity: number;
}

myBackendClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export interface SearchResults {
  movies: MovieSearchItem[] | null;
  users: UserSearch[] | null;
  watchlists: WatchlistSearch[] | null;
  credits: CreditSearch[] | null;
}
export const fetchMovieOfTheDay = async () => {
  try {
    const response = await myBackendClient.get('/movie_of_the_day');
    return response.data.results; 
  } catch (error) {
    console.error("Error fetching movie of the day:", error);
    return null;
  }
};
export const getSimilarMovies = async (id: number) => {
    try {
        const response = await myBackendClient.get(`/movies/${id}/similar?page=1`);
        return response.data.results || [];
    } catch (error) {
        console.error("Error fetching similar movies:", error);
        return [];
    }
};


export const loginUser = async (loginData: { login: string; password: string }) => {
    try {
        const response = await axios.post('/api/login', {
            username: loginData.login,
            password: loginData.password
        });

        const results = response.data.results;

        if (!results || (Array.isArray(results) && results.length === 0)) {
            throw new Error("Сервер не повернув даних користувача");
        }

        const userFromServer = Array.isArray(results) ? results[0] : results;

        const token = userFromServer.jwt; 
        
        if (token) {
            localStorage.setItem('jwt_token', token);
            console.log("Токен успішно збережено!");
        } else {
            console.warn("Токен не знайдено у відповіді сервера!");
        }

        const userData = {
            user_id: userFromServer.user_id,
            username: userFromServer.username,
            first_name: userFromServer.first_name || "",
            last_name: userFromServer.last_name || "",
            email: userFromServer.email || "",
            avatar_url: userFromServer.avatar_url || "https://via.placeholder.com/150",
            followers: userFromServer.followers || 0,
            followings: userFromServer.followings || 0,
            bio: userFromServer.bio || "",
            bg_img_url: userFromServer.bg_img_url || "https://via.placeholder.com/1920x600/1a1a1a/ffffff?text=No+Cover"
        };

        return userData;

    } catch (error: any) {
        console.error("❌ Помилка входу:", error.response?.data || error.message);
        throw error;
    }
};
export const getUserProfile = async (id: number) => {
    try {
    
        const response = await myBackendClient.get(`/users/${id}`);
    
        const currentUser = response.data.results || response.data;
        
        if (!currentUser) {
            throw new Error("Юзера з таким ID не знайдено");
        }

        return currentUser; 
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};
export const getUserById = async (id: number): Promise<User | null> => {
    try {
        const response = await myBackendClient.get(`/users/${id}`);
    
        return response.data.results; 
    } catch (error) {
        console.error("Помилка завантаження профілю:", error);
        return null;
    }
};
export const getPopularMovies = async () => {
    try {
        console.log("📡 Стукаємо за фільмами (TMDB): /movie/popular");
        const response = await tmdbClient.get('/movie/popular');

        console.log("✅ Відповідь сервера фільмів:", response.data);

        const serverData = response.data.results; 

        if (Array.isArray(serverData) && serverData.length > 0) {
            return { results: serverData };
        }

        console.warn("⚠️ Сервер дав пустий список.");
        return { results: MOCK_MOVIES };

    } catch (error) {
        console.error("❌ Помилка API фільмів. Використовуємо MOCK_MOVIES.", error);
        return { results: MOCK_MOVIES };
    }
};

export const getGenres = async () => {
    try {
        const response = await tmdbClient.get('/genre/movie/list'); // Виправлено шлях для TMDB
        return response.data;
    } catch (error) {
        return { genres: [] };
    }
};


export const getMovieDetails = async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}`, {
        params: {
            append_to_response: 'videos,credits' 
        }
    });
    return response.data;
};
export const getTrendingMovies = async () => {
    const response = await tmdbClient.get<MovieResponse>('/trending/movie/week');
    return response.data;
};
export const getNowPlayingMovies = async () => {
    const response = await tmdbClient.get<MovieResponse>('/movie/now_playing');
    return response.data;
};
export const getTopRatedMovies = async () => {
    const response = await tmdbClient.get<MovieResponse>('/movie/top_rated');
    return response.data;
};
export const getUpcomingMovies = async () => {
    const response = await tmdbClient.get<MovieResponse>('/movie/upcoming');
    return response.data;
};

export const getImageUrl = (path: string | null | undefined, size: string = 'w500') => {
    if (!path) {
        return 'https://via.placeholder.com/500x750?text=No+Image';
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
export const getMovieCredits = async (id: number) => {
   
    const response = await tmdbClient.get(`/movie/${id}/credits`);
    return response.data.cast;
};
export const getActorDetails = async (id: number | string) => {
    try {
        const response = await myBackendClient.get(`/credits/${id}`);
        
        const details = response.data.results.details;

        let genderText = 'Невідомо';
        if (details.gender === 1) genderText = 'Жінка';
        else if (details.gender === 2) genderText = 'Чоловік';

        return {
            id: details.id,
            name: details.name,
            biography: details.biography || "Біографія відсутня.",
            profile_path: details.profile_path,
            birthday: details.birthday || "Немає даних",
            gender: genderText,
            rating: details.popularity || "Немає даних", // Використовуємо popularity замість rating
            place_of_birth: details.place_of_birth || "Немає даних",
            
            known_for_department: details.known_for_department || "Немає даних",
            known_for: [] 
        };
    } catch (error) {
        console.error("Помилка завантаження деталей актора:", error);
        return null;
    }
};
export const fetchGlobalSearch = async (query: string): Promise<SearchResults> => {
    try {
      const safeQuery = encodeURIComponent(query.trim());
      const response = await myBackendClient.get(`/search/${safeQuery}`);
      
      const itemsArray = response.data?.results?.results || [];
  
      const groupedResults: SearchResults = {
        movies: [],
        users: [],
        credits: [],
        watchlists: []
      };
  
      if (Array.isArray(itemsArray)) {
        itemsArray.forEach((item: any) => {
          if (item.type === 'movies') groupedResults.movies!.push(item);
          else if (item.type === 'users') groupedResults.users!.push(item);
          else if (item.type === 'credits' || item.type === 'actors') groupedResults.credits!.push(item);
          else if (item.type === 'watchlists') groupedResults.watchlists!.push(item);
        });
      }
  
      return groupedResults; 
      
    } catch (error) {
      console.error("Error global search:", error);
      throw error;
    }
  };