import { jwtHeaders } from "@/utils/utils";
import { ChatID } from "./../models/models";
import { useAuthStore } from "@/local_storage/user/asyncStorage/store";
import { WSMessage } from "../ws_connector/ws_connector";
import { MessagesQueue } from "../messages_queue/messages_queue";
import { MessageStorage } from "../message_storage/message_storage";
import { ChatMessage } from "../message_storage/message_storage";
import { useChatStore } from "../app_state";

export type Chat = {
  info: {
    chat_id: number,
    chat_type: string,
    img_url: string,
    name: string,
  },
  peer: {
    avatar_url: string,
    is_online: boolean,
    last_seen: string,
    member_index?: number,
    role?: string,
    user_id: number,
    username: string,
  };
};

export type ChatEventType =
  "message_edited" | "message_delete" | "message_add" | "message_seen"
  | "seen_all" | "user_typing" | "chat_created" | "member_add" | "member_leave";

export type ChatEvent = {
  chat_id: number;
  event: ChatEventType;
};

type Callbacks = {
  onMessage: Map<ChatID, (_: WSMessage) => void>,
  onTyping: Map<ChatID, (_: WSMessage) => void>,
  onOnline: Map<ChatID, (_: WSMessage) => void>,
  onSend: Map<ChatID, (_: WSMessage) => void>,
};

export class ChatManager {
  private messages: Map<ChatID, MessageStorage> = new Map();
  private loadedStatus: Map<ChatID, boolean> = new Map();
  private messagesQueue: MessagesQueue = new MessagesQueue();
  private listeners: ((event: ChatEvent) => void)[] = [];

  public callbacks: Callbacks = {
    onMessage: new Map<ChatID, (_: WSMessage) => void>(),
    onTyping: new Map<ChatID, (_: WSMessage) => void>(),
    onOnline: new Map<ChatID, (_: WSMessage) => void>(),
    onSend: new Map<ChatID, (_: WSMessage) => void>(),
  };

  public connect(chatID: ChatID) {
    this.messages?.set(chatID, new MessageStorage(chatID));
    this.messages?.get(chatID)?.loadMessages();
  };

  public async onEvent(handler: (event: ChatEvent) => void) {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter(l => l !== handler);
    };
  };

  public async emit(event: ChatEvent) {
    this.listeners.forEach(l => l(event));
  };

  public async setOnOnline(chatID: ChatID, callback: (_: WSMessage) => void) {
    console.warn("Set on online: ", chatID, " ", callback);
    this.callbacks?.onOnline?.set(chatID, callback);
  };

  public async setOnTyping(chatID: ChatID, callback: (_: WSMessage) => void) {
    console.warn("Set on typing: ", chatID, " ", callback);
    this.callbacks?.onTyping?.set(chatID, callback);
  };

  public getCallbacks(chatID: ChatID): Callbacks {
    return this.callbacks;
  };

  public async handleIncommingMessage(chatID: ChatID, message: ChatMessage) {
    console.warn("HandleIncommingMessage: ", message);
    this.messages.get(chatID)?.addMessage(message);
    //this.messages.set(chatID, [message, ...current]);
  };

  public async getChat(chatID: ChatID): Promise<Chat> {
    console.warn("Chat ID in getChat: ", chatID)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/${chatID}`,
      {
        method: "GET",
        headers: jwtHeaders(useAuthStore?.getState()?.user?.jwt)
      }
    );
    const text = await response?.text();
    const data = JSON.parse(text);
    const participants: any[] = data?.participants;

    if (!participants?.length) return data?.results;

    const newUsers: Map<number, any> = new Map(
      ...participants.map(it => [it.user_id, it])
    );

    useChatStore.getState()._setUsersBatch(newUsers);

    return data?.results;
  };

  public async getChatMessages(chatID: ChatID) {
    let storage = this.messages?.get(chatID);
    if (!storage) {
      storage = new MessageStorage(chatID);
      this.messages?.set(chatID, storage);
    }
    await storage.loadMessages();
  };

  public addMessage(chatID: ChatID, msg: ChatMessage) {
    console.warn("Add message in chatManager");
    this.messages?.get(chatID)?.addMessage(msg);
  }

  public isLoaded(chatID: ChatID): boolean {
    return this.loadedStatus?.get(chatID) ?? false;
  };
};