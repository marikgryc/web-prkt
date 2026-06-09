const API_URL = import.meta.env.VITE_API_URL || "https://api.cinelink.lol";
export interface Cast {
    id: number;
    name: string;
    original_name: string;
    character: string;
    profile_path: string | null;
    gender: number;
    known_for_department: string;
    popularity: number;
}

export interface MovieCredits {
    cast: Cast[];
    // crew також можна додати за потреби
}

export interface ActorDetails {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    profile_path: string | null;
    known_for_department: string;
    popularity: number;
}

export interface FilmographyMovie {
    id: number;
    english_title: string;
    poster_path: string | null;
    release_date: string;
}

export interface FilmographyItems {
    year: string;
    movies: FilmographyMovie[];
}

// --- ФУНКЦІЇ ДЛЯ API ---

// 1. Отримання акторів для фільму
export const getMovieCredits = async (movieId: string | number) => {
    try {
        // Уточніть у бекендера точний маршрут! Зазвичай це /movies/{id}/credits
        const response = await myBackendClient.get(`/movies/${movieId}/credits`);
        // Якщо бек загортає у results, то return response.data.results;
        return response.data; 
    } catch (error) {
        console.error("Error fetching movie credits:", error);
        return null;
    }
};

// 2. Отримання деталей актора
export const getActorDetails = async (id: number | string) => {
    try {
        // Дістаємо токен
        const token = localStorage.getItem('jwt_token');
        
        const response = await fetch(`${API_URL}/credits/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : "" // ДОДАНО: передаємо токен
            }
        });
        
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        
        const data = await response.json();
        
        const details = data.results.details;

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
            popularity: details.popularity || "Немає даних",
            place_of_birth: details.place_of_birth || "Немає даних",
            known_for_department: details.known_for_department || "Немає даних",
            known_for: [] 
        };
    } catch (error) {
        console.error("Помилка завантаження деталей актора:", error);
        return null;
    }
};

export const getActorCredits = async (id: number | string) => {
    try {
        const token = localStorage.getItem('jwt_token');

        const response = await fetch(`${API_URL}/credits/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });
        
        if (!response.ok) throw new Error("Помилка завантаження фільмографії");
        
        const data = await response.json();
        
        // Ми побачили в логах, що фільми лежать у data.results.filmography
        const filmography = data.results.filmography;

        // Якщо бекенд повернув null або пустий масив, повертаємо []
        if (!filmography) {
            console.log("Бекенд повернув порожню фільмографію для цього актора.");
            return [];
        }

        return filmography;
    } catch (error) {
        console.error("Помилка завантаження фільмів актора:", error);
        return [];
    }
};