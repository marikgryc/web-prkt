import { UserProfile_T } from "@/app/screens/UserPage/types";
import { API_URL } from "./API_CONFIG";

export let CURRENT_USER = {
  firstName: "",
  lastName: "",
  username: "",
  UID: 1,
};

export async function updateCurrentUserData() {

}

export async function getUserProfileData(userID: number): Promise<UserProfile_T> {
  const response = await fetch(`${API_URL}/user/profile?userID=${userID}`);
  const json = await response.json();
  const data: UserProfile_T = json.results;
  console.warn("UserProfile: ", data);
  return data;
}