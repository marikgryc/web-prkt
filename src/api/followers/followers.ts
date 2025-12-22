import { API_URL } from "@/api/API_CONFIG";

export async function GetUserFollowers(userID: number) {
  const response = await fetch(`${API_URL}/followers?userID=${userID}`)
  return response.json()?.results;
};