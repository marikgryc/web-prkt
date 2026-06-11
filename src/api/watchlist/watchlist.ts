import { WatchlistItem_T } from './types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function AddWatchlistItem(item: WatchlistItem_T) {
  try {
    const response = await fetch(`/api/watchlists/${item.watchlist_id}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ movie_id: String(item.movie_id) }),
    });
    if (!response.ok) {
      console.error('AddWatchlistItem failed:', response.status);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error('Помилка AddWatchlistItem:', err);
  }
}

export async function GetUserWatchlists(_userID?: number) {
  try {
    const response = await fetch('/api/users/watchlists', {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.error('Watchlists fetch failed:', response.status);
      return [];
    }
    const data = await response.json();
    return data?.results || [];
  } catch (err) {
    console.error('Помилка GetUserWatchlists:', err);
    return [];
  }
}

export async function GetWatchlistMovies(watchlistID: number) {
  try {
    const response = await fetch(`/api/watchlists/${watchlistID}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.error('GetWatchlistMovies failed:', response.status);
      return [];
    }
    const data = await response.json();
    return data?.results || data;
  } catch (err) {
    console.error('Помилка GetWatchlistMovies:', err);
    return [];
  }
}

export async function CreateWatchlist(name: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('jwt_token');
    const userID = localStorage.getItem('cinelink_user_id');
    const response = await fetch(`/api/users/${userID}/watchlists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, is_public: true }),
    });
    return response.ok;
  } catch (err) {
    console.error('Помилка CreateWatchlist:', err);
    return false;
  }
}