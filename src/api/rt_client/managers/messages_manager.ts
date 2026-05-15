import { create } from "zustand";
import { EntinyManager } from "./base_class";
import { ChatID } from "../models/models";
import { useEffect } from "react";
import { API_URL } from "@/api/API_CONFIG";

type Message_T = {
  user_id: number;
  chat_id: number;
  message_id: number;
  message_type: string;
  message: any;
  timestamp: string;
};

interface MessagesState {
  messages: Record<number, Message_T[]>;
  _add: (chatID: number, msg: Message_T) => void;
  _addMany: (chatID: number, msgs: Message_T[]) => void;
  _remove: (chatID: number, msgID: number) => void;
};

const useMessageStore = create<MessagesState>((set) => ({
  messages: {},
  _add: (chatID, msg) => set((s) => ({
    messages: { ...s.messages, [chatID]: [msg, ...(s.messages[chatID] || [])] }
  })),
  _addMany: (chatID, msgs) => set((s) => ({
    messages: { ...s.messages, [chatID]: msgs }
  })),
  _remove: (chatID, msgs) => set((s) => ({
  })),
}));

export class MessagesManager extends EntinyManager<Message_T> {
  private static instance: MessagesManager;
  private isLoading: boolean =  false;

  public static getInstance(): MessagesManager {
    if (!MessagesManager.instance)
      MessagesManager.instance = new MessagesManager();
    return MessagesManager.instance
  };

  public init(chatID: ChatID) {
    this.load(chatID);
  };

  public async load(chatID: ChatID): Promise<void> {
    if(this.isLoading) return;

    this.isLoading = true;
    try {
      const response = await fetch(`${API_URL}/chats/${chatID}/messages`)
      const data = await response?.json();
      if (data?.results) {
        const reversed = [...data.results].reverse();
        const current = useMessageStore.getState().messages;
        if (JSON.stringify(current) !== JSON.stringify(reversed)) {
          this.addArray(chatID, reversed);
          //useChatStore.getState()._setLastMessage(this.chatID, reversed[0])
        }
        //this.lastSeenMessageId = reversed[0]?.message_id;
      }
    } finally {
      this.isLoading = false;
    }
  };

  public add(id: number, item: Message_T): void {
    useMessageStore.getState()._add(id, item)
  };

  public addMany(msgs: Map<number, Message_T>): void {
    // nothing
  };

  public addArray(id: number, items: Message_T[]): void {
    useMessageStore.getState()._addMany(id, items);
  };

  public remove(id: number): void {

  };

  public update(id: number, data: Partial<Message_T>): void {

  };

  public get(id: number = 0): void {

  };
};

async function load(chatID: ChatID){
  await MessagesManager.getInstance().load(chatID);
};

export function useChatMessages(chatID: ChatID): Message_T [] {
  const messages: Message_T[] = useMessageStore(s => s.messages[chatID]);
  useEffect(()=>{
    if (!messages) load(chatID);
  }, [chatID, messages]);
  return messages;
};



export function useLastChatMessage(chatID: ChatID): Message_T {
  const message: Message_T = useMessageStore(s => s.messages[chatID]?.[0]);
  useEffect(()=>{
    if (!message) load(chatID);
  }, [chatID]);
  return message ?? {};
};