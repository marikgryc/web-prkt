import { API_URL } from "@/api/API_CONFIG";
import { UserID, WatchlistID } from "../models/models";
import { create } from "zustand";
import { EntinyManager } from "./base_class";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

type Watchlist_T = {
  id: number;
  name: string;
  fg_img_url?: string;
  bg_img_url?: string;
  creator_id?: number;
  creator_username?: string;
  movies_quanity?: number;
  is_public: boolean;
  description?: string;
};

interface WatchlistState {
  watchlists: Record<WatchlistID, Watchlist_T>;
  _add: (watchlistID: WatchlistID, watchlist: Watchlist_T) => void;
  _addMany: (watchlists: Map<WatchlistID, Watchlist_T>) => void;
  _remove: (watchlistID: WatchlistID) => void;
  _update: (watchlistID: WatchlistID, data: Partial<Watchlist_T>) => void;
};

const useWatchlistStore = create<WatchlistState>((set) => ({
  watchlists: {},
  _add: (watchlistID, watchlist) => set((s) => ({
    watchlists: {...s.watchlists, [watchlistID]: watchlist}
  })),
  _addMany: (newWatchlists) => set((s) => ({
    watchlists: {...s.watchlists, ...Object.fromEntries(newWatchlists)}
  })),
  _remove: (watchlistID) => set((s)=>{
    const {[watchlistID]: _, ...remainingWatchlists } = s.watchlists;
    return {watchlists: remainingWatchlists}
  }),
  _update: (watchlistID, data) => set((s)=>({

  })),
}));

export class WatchlistsManager extends EntinyManager<Watchlist_T> {
  public static instance: WatchlistsManager;
  private currUserID: number = 0;

  public static getInstance(): WatchlistsManager {
    if(!WatchlistsManager.instance)
      WatchlistsManager.instance = new WatchlistsManager();
    return WatchlistsManager.instance
  };

  public init(userID: UserID){
    this.currUserID = userID;
    this.load();
  };

  public async load(watchlistID: WatchlistID = 0) {
    let resp:any;
    if(!watchlistID)
      resp = await fetch(`${API_URL}/users/${this.currUserID}/watchlists`);
    const data = await resp.json();
    if(!resp.ok || data?.status !== 200)
      return;

    const current =  useWatchlistStore.getState().watchlists;
    const map = new Map<number, Watchlist_T>(data?.results?.map((item: Watchlist_T)=> [item.id, item]));
    const same = 
      Object.keys(current).length === map.size 
      && [...map.keys()].every(id => current[id]);

    if(!same)
      useWatchlistStore.getState()._addMany(map);
  };

  public add(watchlistID: WatchlistID, watchlist: any){
    useWatchlistStore.getState()._add(watchlistID, watchlist);
  };

  public addMany(watchlists: Map<number, Watchlist_T>){
    useWatchlistStore.getState()._addMany(watchlists);
  };

  public addArray(id: number, items: Watchlist_T[]): void {
    
  };

  public remove(watchlistID: WatchlistID) {
    useWatchlistStore.getState()._remove(watchlistID);
  };

  public update(watchlistID: WatchlistID, data: Partial<any>) {
    useWatchlistStore.getState()._update(watchlistID, data);
  };

  public get(id: number): void {
    
  };
};

async function load(watchlistID: WatchlistID = 0){
  await WatchlistsManager.getInstance().load(watchlistID);
};

export function useUserWatchlists(): Watchlist_T[] {
  const watchlists = useWatchlistStore(useShallow(s => Object.values(s.watchlists)));
  useEffect(()=>{
    if(watchlists.length === 0)
      load();
  }, [watchlists]);
  return watchlists;
};