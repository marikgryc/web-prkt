const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export async function GetUserChats(userID: number) {
  try {
    const response = await fetch(`/api/users/${userID}/chats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      console.error(`Помилка отримання чатів: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return data?.results || [];
  } catch (error) {
    console.error('Мережева помилка при завантаженні списку чатів:', error);
    return [];
  }
}