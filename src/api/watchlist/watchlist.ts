import { API_URL } from "@/api/API_CONFIG";
import { CURRENT_USER } from "../currentUser";
import { WatchlistItem, WatchlistCard } from "./types";

export async function AddWatchlistItem(item: WatchlistItem) {
  await fetch(`${API_URL}/user/watchlist`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
    .then(res => res.json)
    .then(data => console.log(data))
    .catch(err => console.error(err));

  console.log("AddWatchlistItem");
};

export async function GetUserWatchlists(userID: number) {
  const response = await fetch(`${API_URL}/watchlist?userID=${userID}`)
  return response.json();
};

export async function GetWatchlistMovies(watchlistID: number) {
  console.log("watchlist id: ", watchlistID);
  const response = await fetch(`${API_URL}/watchlist?watchlistID=${watchlistID}`)
  return response.json();
};
