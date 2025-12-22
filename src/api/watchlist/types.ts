export type WatchlistItem_T = {
  id: number;
  user_id: number;
  movie_id: any;
  watchlist_id: number;
};

export type WatchlistCard = {
  id: number;
  name: string;
  description: string;
  creator_id: number;
  is_public: boolean;
  bg_img_path: string;
  fg_img_path: string;
};

