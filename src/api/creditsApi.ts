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

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getActorDetails = async (id: number | string) => {
    try {
        const response = await fetch(`/api/credits/${id}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        const details = data.results.details;

        return {
            id: details.id,
            name: details.name,
            biography: details.biography || 'Біографія відсутня.',
            profile_path: details.profile_path,
            birthday: details.birthday || 'Немає даних',
            gender: details.gender === 1 ? 'Жінка' : details.gender === 2 ? 'Чоловік' : 'Невідомо',
            popularity: details.popularity || 'Немає даних',
            place_of_birth: details.place_of_birth || 'Немає даних',
            known_for_department: details.known_for_department || 'Немає даних',
            known_for: []
        };
    } catch (error) {
        console.error('Помилка завантаження деталей актора:', error);
        return null;
    }
};

export const getActorCredits = async (id: number | string) => {
    try {
        const response = await fetch(`/api/credits/${id}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Помилка завантаження фільмографії');
        const data = await response.json();
        return data.results.filmography || [];
    } catch (error) {
        console.error('Помилка завантаження фільмів актора:', error);
        return [];
    }
};