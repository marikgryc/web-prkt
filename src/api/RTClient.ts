// src/api/RTClient.ts

// 1. Описуємо типи даних з твого документа
export type MessageType = 
  | "online" 
  | "typing" 
  | "chat_entering" 
  | "chat_leaving" 
  | "page_entering" 
  | "page_leaving" 
  | "message";

export interface RTMessagePayload {
    type: MessageType;
    content: any;
}

// 2. Створюємо сам клас
class RealTimeClient {
    private ws: WebSocket | null = null;
    private userId: number | null = null;
    
    // Тут ми будемо зберігати функції-колбеки, які React передасть нам
    private onMessageCallbacks: Map<number, (msg: any) => void> = new Map();
    private onTypingCallbacks: Map<number, (msg: any) => void> = new Map();
    private globalStatusCallbacks: ((msg: any) => void)[] = [];

    // ЗМІНИ ЦЮ АДРЕСУ НА ТУ, ЯКА У ТВОЄМУ GO-СЕРВЕРІ
    // Зазвичай це ws://IP:PORT/ws
    private WS_URL = "ws://185.227.108.14:8080/ws"; 

    // --- ОСНОВНІ МЕТОДИ ---

    public connect(userId: number) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log("WS вже підключено");
            return;
        }

        this.userId = userId;
        
        // Підключаємося до сервера. Передаємо user_id, щоб сервер знав, хто це
        this.ws = new WebSocket(`${this.WS_URL}?user_id=${userId}`);

        this.ws.onopen = () => {
            console.log("✅ WebSocket підключено! User ID:", userId);
            // Як тільки підключились, можемо сказати серверу, що ми онлайн
            this.send("online", { user_id: userId, is_online: true });
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
            console.log("❌ WebSocket відключено. Спроба перепідключення...");
            // Тут можна додати логіку автоматичного реконекту через 5 секунд
            setTimeout(() => this.connect(userId), 5000);
        };

        this.ws.onerror = (error) => {
            console.error("WS Error:", error);
        };
    }

    public disconnect() {
        if (this.ws) {
            // Кажемо серверу, що ми йдемо
            if (this.userId) {
                this.send("online", { user_id: this.userId, is_online: false });
            }
            this.ws.close();
            this.ws = null;
        }
    }

    // --- ЛОГІКА ОБРОБКИ ПОВІДОМЛЕНЬ ВІД СЕРВЕРА ---

    private handleIncomingEvent(data: RTMessagePayload) {
        console.log("📩 Нове WS повідомлення:", data.type, data.content);

        switch (data.type) {
            case "message":
                // Шукаємо, чи є колбек для цього чату
                const msgCallback = this.onMessageCallbacks.get(data.content.chat_id);
                if (msgCallback) msgCallback(data.content);
                break;

            case "typing":
                const typeCallback = this.onTypingCallbacks.get(data.content.chat_id);
                if (typeCallback) typeCallback(data.content);
                break;

            case "online":
            case "chat_entering":
            case "chat_leaving":
                // Ці події кидаємо у глобальні слухачі (для оновлення статусів у сайдбарі)
                this.globalStatusCallbacks.forEach(cb => cb(data));
                break;
        }
    }

    // --- МЕТОДИ ВСТАНОВЛЕННЯ КОЛБЕКІВ (Згідно з твоїм доком) ---

    public setOnMessageCallback(chatId: number, callback: (msg: any) => void) {
        this.onMessageCallbacks.set(chatId, callback);
    }

    public setOnTypingCallback(chatId: number, callback: (msg: any) => void) {
        this.onTypingCallbacks.set(chatId, callback);
    }

    public addGlobalStatusListener(callback: (msg: any) => void) {
        this.globalStatusCallbacks.push(callback);
    }

    // --- МЕТОДИ ДЛЯ ВІДПРАВКИ НА СЕРВЕР ---

    public send(type: MessageType, content: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const payload: RTMessagePayload = { type, content };
            this.ws.send(JSON.stringify(payload));
        } else {
            console.warn("Не вдалося відправити повідомлення. WS не підключено.");
        }
    }
}

// Експортуємо єдиний екземпляр класу (Singleton)
export const RTClient = new RealTimeClient();