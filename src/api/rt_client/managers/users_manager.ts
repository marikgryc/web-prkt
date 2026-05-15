import { API_URL } from "@/api/API_CONFIG";
import { EMPTY_OBJECT, UserID } from "../models/models";
import { create } from "zustand";
import { EntinyManager } from "./base_class";
import { useEffect } from "react";
import {useShallow} from "zustand/react/shallow";

type User_T = {
  user_id: number;
  username: string;
  avatar_url: string;
  is_online: boolean;
};

type UserProfile_T = {
  user_id: number;
  username: string;
};

interface UserState {
  users: Record<UserID, User_T>;
  userProfiles: Record<UserID, UserProfile_T>,
  onlineStatus: Record<UserID, boolean>;
  _setOnlineStatus: (userID: UserID, status: boolean) =>  void;
  _setManyOnlineStatus: (statuses: Map<UserID, boolean>) => void;
  _add: (userID: UserID, user: User_T) => void;
  _addMany: (users: Map<UserID, User_T>) => void;
  _remove: (userID: UserID) => void;
  _update: (userID: UserID, data: Partial<User_T>) => void;
};

const useUserStore = create<UserState>((set) => ({
  users: {},
  userProfiles: {},
  onlineStatus: {},
  _setOnlineStatus: (userID, status) => set((s) => ({
    onlineStatus: {...s.onlineStatus, [userID]: status}
  })),
  _setManyOnlineStatus: (statuses) => set((s) => ({
    onlineStatus: {...s.onlineStatus, ...Object.fromEntries(statuses)}
  })),
  _add: (userID, user) => set((s) => ({
    users: {...s.users, [userID]: user}
  })),
  _addMany: (newUsers) => set((s) => ({
    users: {...s.users, ...Object.fromEntries(newUsers)}
  })),
  _remove: (userID) => set((s)=>{
    const {[userID]: _, ...remainingUsers } = s.users;
    return {users: remainingUsers}
  }),
  _update: (userID, data) => set((s)=>({

  })),
}));

export class UsersManager extends EntinyManager<User_T> {
  private currUserID: number = 0;
  private static instance: UsersManager;
  private isLoading: boolean = false;

  public static getInstance(): UsersManager {
    if(!UsersManager.instance)
      UsersManager.instance = new UsersManager();
    return UsersManager.instance;
  };

  public init(userID: UserID){
    this.currUserID = userID;
    this.load();
  };

  public async load(userID: UserID = 0) {
    if(this.isLoading) return;

    this.isLoading = true;
    try {
      let resp: any;
      if(!userID)
        resp = await fetch(`${API_URL}/users/init/${this.currUserID}`);
      else 
        resp = await fetch(`${API_URL}/users/${userID}`);
      const data = await resp.json();
      if(!resp.ok || data?.status !== 200){
        console.log("Users init err: ", resp);
        return;
      };

      const map = new Map();
      const statuses = new Map();

      data?.results?.forEach((user: User_T)=>{
        if(!user.avatar_url || user.avatar_url.length === 0)
          user.avatar_url = "https://i.pinimg.com/736x/56/65/e3/5665e34f05ce5e1270b81ee0f64922f3.jpg";
        map.set(user.user_id, user);
        statuses.set(user.user_id, user.is_online);
        console.log("user ", user?.user_id, " is online: ", user.is_online);
      });

      useUserStore.getState()._addMany(map);
      useUserStore.getState()._setManyOnlineStatus(statuses);
    }finally{
      this.isLoading = false;
    }
  };

  public setOnlineStatus(userID: UserID, status: boolean){
    useUserStore.getState()._setOnlineStatus(userID, status);
  };

  public add(userID: UserID, user: any){
    useUserStore.getState()._add(userID, user);
  };

  public addMany(users: Map<number, User_T>){
    useUserStore.getState()._addMany(users);
  };

  public addArray(id: number, items: User_T[]): void {
    
  };

  public remove(userID: UserID) {
    useUserStore.getState()._remove(userID);
  };

  public update(userID: UserID, data: Partial<any>) {
    useUserStore.getState()._update(userID, data);
  };

  public get(userID: UserID = 0): any{
    const users = useUserStore(s => s.users[1]);
    return users;
  };
};

async function load(userID: UserID = 0){
  await UsersManager.getInstance().load(userID);
};

export function useUsers():any[] {
  const users = useUserStore(useShallow((s) => Object.values(s.users)));
  useEffect(()=>{
    console.warn("useUsers");
    if(users.length === 0)
      load();
  }, [users?.length]);
  return users;
};

export function useUserStatus(userID: UserID): boolean {
  const status = useUserStore(state => state.onlineStatus[userID] ?? false);
  useEffect(() => {
    console.warn("useUserStatus");
  }, [userID, status]);
  return status;
};

export function useUser(userID: UserID): User_T {
  const user = useUserStore(s => s.users[userID] || EMPTY_OBJECT);
  useEffect(()=>{
    if(!user) load(userID);
    console.warn("useUser");
  }, [userID]);
  return user;
};