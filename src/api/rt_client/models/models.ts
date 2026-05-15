export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY:any[] = [];

export type ChatID = number;
export type MovieID = number;
export type UserID = number;
export type WatchlistID = number;
export type MessageID = number;

interface Chat {
  chat_id: number;
  creator_id: number;
  image_url: string;
  name: string;
  chat_type: string;
};

export interface ChatMember {
  member_index: number;
  user_id: number;
  username: string;
  full_name: string;
  avatar_url: string;
  role: string;
  is_online: boolean;
  is_typing: boolean;
};

export type OnlineMessage = {
  user_id: number;
  is_online: boolean;
};

export type TypingMessage = {
  user_id: number;
  chat_id: number;
  is_typing: boolean;
};

export type Message = {
  message_type: string;
  message: any;
  message_id: number | null;
  chat_id: number | null;
  user_id: number;
  timestamp: string;
};

export type RTMessage = {
  type: string;
  content: OnlineMessage | TypingMessage | Message;
};

export interface DirectChat {
  chat: Chat;
  peer: ChatMember;
};

export interface GroupChat {
  chat: Chat;
  members: ChatMember[];
};

export interface ChatPresence {
  type: "chat_entering" | "chat_leaving";
  content: {
    user_id: UserID;
    chat_id: ChatID;
  };
};

export type PagePresence = {
  type: "page_entering" | "page_leaving";
  content: {
    user_id: UserID;
    page: string;
  };
};

export type Online = {
  type: "online";
  content: {
    user_id: UserID;
    is_online: boolean;
  }
};

export type Typing = {
  type: "typing";
  content: {
    chat_id: ChatID;
    user_id: UserID;
    is_typing: boolean;
  }
};

export type Ping = {
  type: "ping";
};