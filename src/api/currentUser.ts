import { UserProfile_T } from "@/app/screens/UserPage/types";
import { API_URL } from "./API_CONFIG";

// Функція-хелпер для отримання ID з пам'яті браузера
const getInitialUID = (): number => {
  const saved = localStorage.getItem('user_id');
  return saved ? Number(saved) : 1; // За замовчуванням 1, поки немає логіну
};

// Тепер CURRENT_USER буде ініціалізуватися реальною ID
export const CURRENT_USER = {
  firstName: "",
  lastName: "",
  username: "",
  // Беремо той самий ключ, що і в AuthContext для синхронізації
  UID: Number(localStorage.getItem('cinelink_user_id')) || 0,
};

export async function updateCurrentUserData() {
  const storedUID = localStorage.getItem('cinelink_user_id');
  if (!storedUID) {
    CURRENT_USER.UID = 0;
    return;
  }

  CURRENT_USER.UID = Number(storedUID);

  try {
      // Використовуємо шлях з вашого main.go: /users/{id}
      const response = await fetch(`${API_URL}/users/${CURRENT_USER.UID}`);
      const data = await response.json();
      
      // Згідно з вашим JSON, дані в results
      if (data.results) {
          CURRENT_USER.username = data.results.username;
          CURRENT_USER.firstName = data.results.first_name;
          // і так далі...
      }
  } catch (err) {
      console.error("Помилка синхронізації:", err);
  }
}
export async function getUserProfileData(userID: number): Promise<UserProfile_T> {
  // Використовуємо шлях /users/{id}, як прописано в main.go
  const response = await fetch(`${API_URL}/users/${userID}`);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const json = await response.json();
  // Оскільки твій бекенд використовує SendSuccess, дані лежать прямо в json або в json.results
  // Перевір консоль, але зазвичай це:
  const data: UserProfile_T = json; 
  return data;
}