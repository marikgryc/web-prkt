import { useChatStore } from "../app_state";
import { ChatID } from "../models/models";

export interface ChatMessage {
  chat_id: number;
  user_id: number;
  timestamp?: string;
  message_type: string;
  message: any;
  message_id?: number;
};

export type MessageEvents = "update" | "delete" | "add";

export interface MessageEventsHandlers {
  type: MessageEvents;
  handler: (message: ChatMessage) => any;
};

const EMPTY_ARRAY: ChatMessage[] = [];

export class MessageStorage {
  private messages: Map<number, ChatMessage> = new Map();
  private chatID: ChatID;
  private lastMessageId: number = 0;
  private isLoading: boolean = false;

  constructor(chatID: ChatID) {
    this.chatID = chatID;
    this.loadMessages();
  };

  public async loadMessages() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/chats/${this.chatID}/messages`)
      const data = await response?.json();

      if (data?.results) {
        const reversed = [...data.results].reverse();
        const current = useChatStore.getState().messages[this.chatID] || EMPTY_ARRAY;
        if (JSON.stringify(current) !== JSON.stringify(reversed)) {
          useChatStore.getState()._setChatMessages(this.chatID, reversed);
          useChatStore.getState()._setLastMessage(this.chatID, reversed[0])
        }

        this.lastSeenMessageId = reversed[0]?.message_id;
      }
    } finally {
      this.isLoading = false;
    }
  };

  public deleteMessage(message_id: number): ChatMessage[] {
    this.messages.delete(message_id);
    return Array.from(this.messages.values());
  };

  public addMessage(message: ChatMessage) {
    console.log("Message addition in messageStore: ", message);
    this.messages.set(message?.message_id, message);
    useChatStore.getState()._addChatMessage(this.chatID, message);
    useChatStore.getState()._setLastMessage(this.chatID, message);
  };

  public clearChat(): ChatMessage[] | [] {
    const tmp = this.messages.values();
    this.messages.clear();
    return tmp.toArray();
  };

  public getChatMessages(): ChatMessage[] | [] {
    return Array.from(this.messages.values());
  };

  public getLastChatMessage(): ChatMessage | null {
    return this.messages.values().toArray().reverse()[0];
  };

  public setEventHandler(handlers: MessageEventsHandlers) {

  };

  public setLastSeenMessageID(chatID: number, messageID: number) {
    useChatStore.getState()._setLastSeenMessageID(chatID, messageID);
  }
};