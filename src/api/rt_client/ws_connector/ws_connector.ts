import { MessagesQueue } from "../messages_queue/messages_queue";

type MessageHandler = (message: any) => void;

export interface Content {
  user_id: number;
  chat_id?: number;
  message_id?: number;
  message_type?: string;
  message?: any;
  is_typing?: boolean;
  is_online?: boolean;
  name?: string;
  image_url: string;
  avatar_url: string;
  chat_type?: 'direct' | 'group';
  participants_ids?: number[];
  page?: string;
};

export interface WSMessage {
  type: string;
  content?: Content,
};

export class WSConnector {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private pingInterval: any;
  private messagesQueue: MessagesQueue = new MessagesQueue();

  constructor(
    private url: string,
    private onMessage: MessageHandler,
    private onOpen: () => void,
    private onClose: () => void,
  ) {
    this.connect();
  }

  public connect() {
    //console.warn("WS URL: ", this.url);
    //this.ws = new WebSocket(`ws://192.168.0.187:8080/ws/2`);
    this.ws = new WebSocket(this.url);
    console.warn("WS URL: ", this.url);

    this.ws.onopen = () => {
      console.warn("WS is open!!")
      this.messagesQueue.flush().forEach((message) => {
        this.send(message);
      });
      this.reconnectAttempts = 0;
      this.startPing();
      this.onOpen();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (e) {
        console.error("Failed to parse WS message: ", e);
      }
    };

    this.ws.onclose = () => {
      console.warn("WS connection closed");
      this.onClose();
      this.stopPing();
      this.attemptReconnect();
    };
  }

  private attemptReconnect() {
    if ((this.ws?.readyState != WebSocket.OPEN) && (this.reconnectAttempts < this.maxReconnectAttempts)) {
      ++this.reconnectAttempts;
      setTimeout(() => {
        console.warn(`reconnect attempt #${this.reconnectAttempts}`)
        this.connect();
      }, 5000 * this.reconnectAttempts);
    }
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      this.send({ type: "ping" })
    }, 30000)
  }

  private stopPing() {
    clearInterval(this.pingInterval);
  }

  public send(data: WSMessage) {
    this.messagesQueue.push(data);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws?.send(JSON.stringify(data));
    } else {
      console.warn("WS is not open. Message not sent: ", data);
    }
  }

  public disconnect() {
    this.ws?.close();
  }
};