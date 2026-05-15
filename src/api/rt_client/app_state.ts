import { create } from "zustand";
import { ChatMessage } from "./message_storage/message_storage";

interface Chat {
  chat_id: number;
  participatns_ids: number[];
  image_url: string;
  name: string;
  chat_type: 'direct' | 'group';
};

interface User {
  id: number;
  username: string;
  avatar_url?: string;
};

interface TypingStatus {
  user_id: number;
  status: boolean;
};

export interface ChatState {
  users: Record<number, User>;
  chats: Record<number, Chat>;
  messages: Record<number, ChatMessage[]>;
  lastMessage: Record<number, ChatMessage>;
  typingStatus: Record<number, Record<number, boolean>>;
  onlineStatus: Record<number, boolean>;
  lastSeenMessageID: Record<number, number>;

  _setOnline: (userID: number, status: boolean) => void;
  _setChatMessages: (chatID: number, msgs: ChatMessage[]) => void;
  _setTyping: (chatID: number, status: TypingStatus) => void;
  _setLastMessage: (chatID: number, msg: ChatMessage) => void;
  _setUser: (userID: number, user: User) => void;
  _setUsersBatch: (users: Map<number, User>) => void;
  _addChatMessage: (chatID: number, msg: ChatMessage) => void;
  _setLastSeenMessageID: (chatID: number, msgID: number) => void;
  _setChat: (chatID: number, chat: Chat) => void;
  _removeChat: (chatID: number) => void;
  _removeUser: (userID: number) => void;
  _setChatsBatch: (chats: Map<number, Chat>) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  users: {},
  chats: {},
  messages: {},
  typingStatus: {},
  onlineStatus: {},
  lastMessage: {},
  lastSeenMessageID: {},
  _setChatMessages: (chatID, msgs) => set((s) => ({
    messages: { ...s.messages, [chatID]: msgs }
  })),
  _setTyping: (chatID, status) => set((s) => ({
    typingStatus: {
      ...s.typingStatus, [chatID]: {
        ...s.typingStatus[chatID],
        [status.user_id]: status.status
      }
    }
  })),
  _addChatMessage: (chatID, msgs) => set((s) => ({
    messages: { ...s.messages, [chatID]: [msgs, ...(s.messages[chatID] || [])] }
  })),
  _setOnline: (userID, status) => set((s) => ({
    onlineStatus: { ...s.onlineStatus, [userID]: status }
  })),
  _setLastMessage: (chatID, msg) => set((s) => ({
    lastMessage: { ...s.lastMessage, [chatID]: msg }
  })),
  _setUser: (userID, user) => set((s) => ({
    users: { ...s.users, [userID]: user }
  })),
  _setUsersBatch: (newUsers) => set((s) => ({
    users: { ...s.users, ...newUsers }
  })),
  _setLastSeenMessageID: (chatID, msgID) => set((s) => ({
    lastSeenMessageID: { ...s.lastSeenMessageID, [chatID]: msgID }
  })),
  _setChat: (chatID, chat) => set((s)=>({
    chats: {...s.chats, [chatID]: chat}
  })),
  _removeChat: (chatID) => set((s) => {
    const {[chatID]: _, ...remainingChats} = s.chats;
    return {chats: remainingChats}
  }),
  _removeUser: (userID) => set((s) => {
    const {[userID]: _, ...remainingUsers} = s.users;
    return {users: remainingUsers}
  }),
  _setChatsBatch: (newChats) => set((s) => ({
    chats: { ...s.chats, ...newChats}
  })),
}));