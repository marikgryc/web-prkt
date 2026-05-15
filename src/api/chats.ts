// src/api/chats.ts
import { API_URL } from "./API_CONFIG";

export async function GetUserChats(userID: number) {
  try {
    const response = await fetch(`${API_URL}/users/${userID}/chats`);
    
    if (!response.ok) {
      console.error(`Помилка отримання чатів: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data?.results || [];
  } catch (error) {
    console.error("Мережева помилка при завантаженні списку чатів:", error);
    return [];
  }
}