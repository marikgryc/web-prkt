import { API_URL } from "@/api/API_CONFIG";
import { CURRENT_USER } from "@/api/currentUser";

export async function LoginRequest(email: string, password: string, navigation: any) {
  console.log("Trying to login");
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      })
    });

    const data = await res.json();

    if (data.code === 200) {
      if (data.data && data.data.user) {
        const user = data.data.user;
        if (CURRENT_USER) {
            CURRENT_USER.firstName = user.firstName;
            CURRENT_USER.lastName = user.lastName;
            CURRENT_USER.username = user.username;
            CURRENT_USER.UID = user.userID;
        }
      }
      
      if (navigation && typeof navigation.replace === 'function') {
          navigation.replace("HomePageScreen");
      } else if (typeof navigation === 'function') {
          navigation('/'); 
      }
    }

    if (data.code === 403) {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate("Error500Screen");
      }
    }
  } catch (error) {
      console.error("Login error:", error);
  }
}

export async function getUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Web Developer",
        email: "admin@leafy.com",
        avatar: null
      });
    }, 1000);
  });
}