// src/api/watchlist/watchlist.ts
import { API_URL } from "../API_CONFIG";
import { CURRENT_USER } from "../currentUser";
import { WatchlistItem_T, WatchlistCard } from "./types";

// Допоміжна функція для отримання токена (адаптуй під те, як ти зберігаєш JWT на вебі)
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function AddWatchlistItem(item: WatchlistItem_T) {
  try {
    const response = await fetch(`${API_URL}/user/watchlist`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    console.log("AddWatchlistItem result:", data);
    return data;
  } catch (err) {
    console.error("Помилка AddWatchlistItem:", err);
  }
}

export async function GetUserWatchlists(userID: number) {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`/api/users/watchlists`, {  // ← прибрати /${userID}
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      console.error('Watchlists fetch failed:', response.status);
      return [];
    }

    const data = await response.json();
    return data?.results || data;
  } catch (err) {
    console.error('Помилка GetUserWatchlists:', err);
    return [];
  }
}

export async function GetWatchlistMovies(watchlistID: number) {
  try {
    console.log("Fetching movies for watchlist id: ", watchlistID);
    const token = localStorage.getItem('jwt_token'); 
    const response = await fetch(`/api/watchlists/${watchlistID}`, {
      headers: {                                     
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    const data = await response.json();
    return data?.results || data;
  } catch (err) {
    console.error("Помилка GetWatchlistMovies:", err);
    return [];
  }
}

export async function CreateWatchlist(name: string): Promise<boolean> {
  const userID = CURRENT_USER.UID;
  console.log("Creating watchlist for user: ", userID);
  
  try {
    const response = await fetch(`/api/user/watchlist`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() // Передаємо токен, як на мобілці
      },
      // Відправляємо назву (і можливо інші дефолтні поля)
      body: JSON.stringify({ name: name, is_public: true }), 
    });

    if (response.ok) {
      console.log("Створено успішно!");
      return true;
    } else {
      console.error("Помилка сервера:", response.status);
      return false;
    }
  } catch (err) {
    console.error("Помилка CreateWatchlist:", err);
    return false;
  }
}