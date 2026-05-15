import { API_URL } from "@/api/API_CONFIG";
import { UserID, MovieID } from "../models/models";
import { create } from "zustand";
import { EntinyManager } from "./base_class";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

type Movie_T = {
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

interface MovieState {
  movies: Record<MovieID, Movie_T>;
  _add: (movieID: MovieID, movie: Movie_T) => void;
  _addMany: (movies: Map<MovieID, Movie_T>) => void;
  _remove: (movieID: MovieID) => void;
  _update: (movieID: MovieID, data: Partial<Movie_T>) => void;
};

const useMovieStore = create<MovieState>((set) => ({
  movies: {},
  _add: (movieID, movie) => set((s) => ({
    movies: {...s.movies, [movieID]: movie}
  })),
  _addMany: (newMovies) => set((s) => ({
    movies: {...s.movies, ...Object.fromEntries(newMovies)}
  })),
  _remove: (movieID) => set((s)=>{
    const {[movieID]: _, ...remainingMovies } = s.movies;
    return {movies: remainingMovies}
  }),
  _update: (movieID, data) => set((s)=>({

  })),
}));

export class MoviesManager extends EntinyManager<Movie_T> {
  public static instance: MoviesManager;
  private currUserID: number = 0;

  public static getInstance(): MoviesManager {
    if(!MoviesManager.instance)
      MoviesManager.instance = new MoviesManager();
    return MoviesManager.instance
  };

  public init({userID, watchlistID}: {userID: number | null, watchlistID: number | null}){
    if(userID)
      this.currUserID = userID;
    if(watchlistID)
      this.load(watchlistID);
  };

  public async load(movieID: MovieID = 0) {
    let resp:any;
    if(!movieID)
      resp = await fetch(`${API_URL}/users/${this.currUserID}/movies`);
    const data = await resp.json();
    if(!resp.ok || data?.status !== 200)
      return;

    const map = new Map<number, Movie_T>(data?.results?.map((item: Movie_T)=> [item.id, item]));
    useMovieStore.getState()._addMany(map);
  };

  public add(movieID: MovieID, movie: any){
    useMovieStore.getState()._add(movieID, movie);
  };

  public addMany(movies: Map<number, Movie_T>){
    useMovieStore.getState()._addMany(movies);
  };

  public addArray(id: number, items: Movie_T[]): void {
    
  };

  public remove(movieID: MovieID) {
    useMovieStore.getState()._remove(movieID);
  };

  public update(movieID: MovieID, data: Partial<any>) {
    useMovieStore.getState()._update(movieID, data);
  };

  public get(id: number): void {
    
  };
};

async function load(movieID: MovieID = 0){
  await MoviesManager.getInstance().load(movieID);
};

export function useUserMovies(): Movie_T[] {
  const movies = useMovieStore(useShallow(s => Object.values(s.movies)));
  useEffect(()=>{
    if(movies.length === 0)
      load();
  }, [movies.length]);
  return movies;
};