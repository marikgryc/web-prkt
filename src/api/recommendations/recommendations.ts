import { API_URL } from "@/api/API_CONFIG";

export async function GetUserRecommendations(userID: number) {
  const response = await fetch(`${API_URL}/recommended-movies?userID=${userID}`)
  return response.json();
};