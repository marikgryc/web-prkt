import axios from 'axios'; // 1. Додали імпорт самої бібліотеки

// 2. Визначаємо константи (встав сюди свій ключ!)
export const API_KEY = '9e7bd8c8c4fc2bdc7be7b6739338fe43'; 
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const MY_BACKEND_URL = 'http://13.62.214.254:8080/';
// Тимчасова заглушка для MOCK_MOVIES, щоб код не падав, якщо ти їх видалив
const MOCK_MOVIES: Movie[] = []; 

// 3. Створюємо налаштований клієнт
// (Ми прибрали import axiosClient з початку файлу, бо створюємо його тут)
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
        // Якщо треба передавати токен авторизації, це робиться тут
    }
});
// --- ТИПИ ДАНИХ ---
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
  bg_img_url?: string;
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

// --- API ЗАПИТИ ---

// УВАГА: Цей запит (/login) не спрацює з API TMDB. 
// Це для твого власного бекенду. Якщо бекенду немає, закоментуй це.
export const loginUser = async (loginData: { login: string; password: string }) => {
    try {
        console.log("🔐 Логін: відправка даних...", loginData);

        const response = await axios.post('http://13.62.214.254:8080/login', {
            login: loginData.login,
            password: loginData.password
        });

        console.log("✅ Сервер відповів:", response.data);

        // 1. Перевіряємо, чи є results і чи це масив
        const results = response.data.results;
        
        if (!results || (Array.isArray(results) && results.length === 0)) {
            throw new Error("Сервер не повернув даних користувача");
        }

        // 2. Беремо першого користувача зі списку
        // Якщо results це масив, беремо results[0]. Якщо об'єкт — то його самого.
        const userFromServer = Array.isArray(results) ? results[0] : results;

        console.log("👤 Дані юзера для фронта:", userFromServer);

        // 3. Мапимо дані під твій інтерфейс User
        // Зверни увагу: полів followers та bg_img_url немає у відповіді сервера, 
        // тому я додав безпечні значення за замовчуванням.
        return {
            user_id: userFromServer.user_id,
            username: userFromServer.username,
            first_name: userFromServer.first_name || "",
            last_name: userFromServer.last_name || "",
            email: userFromServer.email || "",
            
            // Аватарка з сервера, або заглушка
            avatar_url: userFromServer.avatar_url || "https://via.placeholder.com/150",
            
            // Цих полів сервер поки не віддає, тому ставимо дефолтні:
            followers: userFromServer.followers || 0,
            followings: userFromServer.followings || 0,
            bio: userFromServer.bio || "Кіноман",
            bg_img_url: userFromServer.bg_img_url || "https://via.placeholder.com/1920x600/1a1a1a/ffffff?text=No+Cover"
        };

    } catch (error: any) {
        console.error("❌ Помилка входу:", error.response?.data || error.message);
        throw error;
    }
};
// Це теж для власного бекенду (/users/id)
export const getUserProfile = async (id: number) => {
    try {
        const response = await myBackendClient.get(`/users/${id}`);
        return response.data.results; 
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

// Це комбінована функція. Для чистого TMDB краще використовувати getTrendingMovies
export const getPopularMovies = async () => {
    try {
        console.log("📡 Стукаємо за фільмами (TMDB): /movie/popular");
        // Виправлено шлях: у TMDB це /movie/popular (однина), а не /movies
        const response = await tmdbClient.get('/movie/popular'); 
        
        console.log("✅ Відповідь сервера фільмів:", response.data); 

        const serverData = response.data.results; // TMDB повертає results

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

// --- ФУНКЦІЇ ДЛЯ TMDB (Головна сторінка) ---

export const getMovieDetails = async (id: number) => {
    console.log(`📡 Запит деталів фільму ID: ${id}`);
    const response = await tmdbClient.get(`/movie/${id}`); // Виправлено шлях: /movie/{id}
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

// Допоміжна функція картинок
export const getImageUrl = (path: string | null | undefined, size: string = 'w500') => {
  if (!path) {
    return 'https://via.placeholder.com/500x750?text=No+Image'; 
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
export const getMovieCredits = async (id: number) => {
    // Залежно від того, як у вас налаштований axios, шлях може трохи відрізнятися
    // Але зазвичай це: /movie/{id}/credits
    const response = await tmdbClient.get(`/movie/${id}/credits`); 
    return response.data.cast;
  };
export const getActorDetails = async (id: number) => {
    // Поки заглушка, пізніше можна зробити запит /person/{id}
    return { id, name: "Actor Info Unavailable", biography: "", profile_path: null, known_for: [] };
};