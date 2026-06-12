import { UserProfile_T } from "@/app/screens/UserPage/types";
import { API_URL } from "./API_CONFIG";

// Функція-хелпер для отримання ID з пам'яті браузера
const getInitialUID = (): number => {
  const saved = localStorage.getItem('user_id');
  return saved ? Number(saved) : 1; // За замовчуванням 1, поки немає логіну
};

export const CURRENT_USER = {
  firstName: "",
  lastName: "",
  username: "",
  UID: Number(localStorage.getItem('cinelink_user_id')) || 0,
};
export function syncCurrentUser() {
  CURRENT_USER.UID = Number(localStorage.getItem('cinelink_user_id')) || 0;
}
export async function updateCurrentUserData() {
  const storedUID = localStorage.getItem('cinelink_user_id');
  if (!storedUID) {
    CURRENT_USER.UID = 0;
    return;
  }

  CURRENT_USER.UID = Number(storedUID);

  try {
      const response = await fetch(`${API_URL}/users/${CURRENT_USER.UID}`);
      const data = await response.json();
      
      if (data.results) {
          CURRENT_USER.username = data.results.username;
          CURRENT_USER.firstName = data.results.first_name;
      }
  } catch (err) {
      console.error("Помилка синхронізації:", err);
  }
}
export async function getUserProfileData(userID: number): Promise<UserProfile_T> {
  const response = await fetch(`${API_URL}/users/${userID}`);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const json = await response.json();
  const data: UserProfile_T = json; 
  return data;
}