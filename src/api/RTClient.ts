// src/api/RTClient.ts
import { API_URL } from "./API_CONFIG";
export type MessageType = 
  | "online" 
  | "typing" 
  | "chat_entering" 
  | "chat_leaving" 
  | "page_entering" 
  | "page_leaving" 
  | "message"
  | "ping"; // Додано ping з мобільного клієнта

export interface RTMessagePayload {
    type: MessageType;
    content?: any; // Зробили опціональним, бо ping може не мати контенту
}

class RealTimeClient {
    private ws: WebSocket | null = null;
    private userId: number | null = null;
    
    private BASE_WS_URL = "wss://api.cinelink.lol"; 
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private pingInterval: ReturnType<typeof setInterval> | null = null;
    private messagesQueue: RTMessagePayload[] = []; // Проста черга
    private onMessageCallbacks: Map<number, (msg: any) => void> = new Map();
    private onTypingCallbacks: Map<number, (msg: any) => void> = new Map();
    private globalStatusCallbacks: ((msg: any) => void)[] = [];

    public connect(userId?: number) {
        const finalUserId = userId || Number(localStorage.getItem('cinelink_user_id'));
        const token = localStorage.getItem('jwt_token');
        if (!finalUserId) {
            console.error("Не вдалося підключити WS: ID відсутній");
            return;
        }
    
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }
    
        this.userId = finalUserId;
        const url = `${this.BASE_WS_URL}/ws/${finalUserId}?token=${token}`;
        console.log("Спроба підключення до WS:", url);
        
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log(" WebSocket підключено! User ID:", userId);
            this.reconnectAttempts = 0; // Скидаємо лічильник    
            this.startPing();
            this.sendDirect("online", { user_id: userId, is_online: true });
            this.flushQueue();
        };

        this.ws.onmessage = (event) => {
            try {
                const data: RTMessagePayload = JSON.parse(event.data);
                this.handleIncomingEvent(data);
            } catch (error) {
                console.error("Помилка парсингу WS повідомлення:", error);
            }
        };

        this.ws.onclose = () => {
            console.warn(" WebSocket відключено.");
            this.stopPing();
            this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
            console.error("WS Error:", error);
        };
    }

    public disconnect() {
        if (this.ws) {
            if (this.userId) {
                this.sendDirect("online", { user_id: this.userId, is_online: false });
            }
            this.stopPing();
            this.ws.close();
            this.ws = null;
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            console.log(`Спроба перепідключення #${this.reconnectAttempts} через ${this.reconnectAttempts * 5} сек...`);
            
            setTimeout(() => {
                this.connect(this.userId!);
            }, 5000 * this.reconnectAttempts);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("Ліміт спроб підключення вичерпано.");
        }
    }

    private startPing() {
        this.stopPing();
        this.pingInterval = setInterval(() => {
            this.sendDirect("ping", undefined);
        }, 30000); 
    }

    private stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    public send(type: MessageType, content: any) {
        const payload: RTMessagePayload = { type, content };
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload));
        } else {
            console.log("WS не підключено. Повідомлення додано в чергу:", type);
            this.messagesQueue.push(payload);
        }
    }

    private sendDirect(type: MessageType, content: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, content }));
        }
    }

    private flushQueue() {
        if (this.messagesQueue.length > 0) {
            console.log(`Відправка ${this.messagesQueue.length} повідомлень з черги...`);
            this.messagesQueue.forEach(msg => {
                this.ws?.send(JSON.stringify(msg));
            });
            this.messagesQueue = []; // Очищаємо чергу
        }
    }
    private handleIncomingEvent(data: RTMessagePayload) {
        if (data.type !== 'ping') {
            console.log(" Нове WS повідомлення:", data.type, data.content);
        }

        switch (data.type) {
            case "message":
                const msgCallback = this.onMessageCallbacks.get(data.content?.chat_id);
                if (msgCallback) msgCallback(data.content);
                break;
            case "typing":
                const typeCallback = this.onTypingCallbacks.get(data.content?.chat_id);
                if (typeCallback) typeCallback(data.content);
                break;
            case "online":
            case "chat_entering":
            case "chat_leaving":
                this.globalStatusCallbacks.forEach(cb => cb(data));
                break;
        }
    }


    public setOnMessageCallback(chatId: number, callback: (msg: any) => void) {
        this.onMessageCallbacks.set(chatId, callback);
    }

    public setOnTypingCallback(chatId: number, callback: (msg: any) => void) {
        this.onTypingCallbacks.set(chatId, callback);
    }

    public addGlobalStatusListener(callback: (msg: any) => void) {
        this.globalStatusCallbacks.push(callback);
    }
}

export const RTClient = new RealTimeClient();