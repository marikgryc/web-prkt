// src/api/RTClient.ts

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
    
    // Адреса без подвійних слешів. Беремо формат як у мобілці: /ws/{userID}
    private BASE_WS_URL = "ws://113.30.191.198:8080"; 

    // --- ЛОГІКА НАДІЙНОСТІ З МОБІЛЬНОГО КЛІЄНТА ---
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private pingInterval: ReturnType<typeof setInterval> | null = null;
    private messagesQueue: RTMessagePayload[] = []; // Проста черга

    // Колбеки для React
    private onMessageCallbacks: Map<number, (msg: any) => void> = new Map();
    private onTypingCallbacks: Map<number, (msg: any) => void> = new Map();
    private globalStatusCallbacks: ((msg: any) => void)[] = [];

    // --- ПІДКЛЮЧЕННЯ ---
    public connect(userId: number) {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.userId = userId;
        
        // Формуємо URL точно як у мобільному клієнті (rt_client.ts)
        const url = `${this.BASE_WS_URL}/ws/${userId}`;
        console.log("Спроба підключення до WS:", url);
        
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log("✅ WebSocket підключено! User ID:", userId);
            this.reconnectAttempts = 0; // Скидаємо лічильник
            
            // Запускаємо Ping кожні 30 сек
            this.startPing();

            // Спершу повідомляємо, що ми онлайн
            this.sendDirect("online", { user_id: userId, is_online: true });

            // Виштовхуємо всі повідомлення, що накопичились у черзі, поки не було зв'язку
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
            console.warn("❌ WebSocket відключено.");
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

    // --- АВТОРЕКОНЕКТ ТА PING (Адаптовано з ws_connector.ts) ---

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
        }, 30000); // 30 секунд
    }

    private stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    // --- ЧЕРГА ТА ВІДПРАВКА ---

    // Публічний метод, яким користується React. Якщо немає зв'язку - кладе в чергу
    public send(type: MessageType, content: any) {
        const payload: RTMessagePayload = { type, content };
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload));
        } else {
            console.log("WS не підключено. Повідомлення додано в чергу:", type);
            this.messagesQueue.push(payload);
        }
    }

    // Пряма відправка (внутрішня) без черги
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

    // --- ОБРОБКА ВХІДНИХ ПОВІДОМЛЕНЬ ---

    private handleIncomingEvent(data: RTMessagePayload) {
        // ігноруємо pong/ping для логів, щоб не спамити консоль
        if (data.type !== 'ping') {
            console.log("📩 Нове WS повідомлення:", data.type, data.content);
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

    // --- МЕТОДИ ДЛЯ REACT (Підписка) ---

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