import axiosClient from '../api/axiosClient';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';import './ChatPage.css';
import { RTClient } from '../api/RTClient';
import { CURRENT_USER } from '../api/currentUser';
import { API_URL } from '../api/API_CONFIG';
import { useNavigate } from 'react-router-dom';
import { GetUserChats } from '../api/chats';
import { useUserStatus } from '../api/rt_client/managers/users_manager';
import { useTypingStatus } from '../api/rt_client/managers/chats_manager'; 
import { useLastChatMessage } from '../api/rt_client/managers/messages_manager';
interface ChatMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  message_type: string;
  message: string;
  timestamp: string;
}
function ContactItem({ contact, isActive, onClick }: { contact: any, isActive: boolean, onClick: () => void }) {
  const online = useUserStatus(contact.id); //
  const typing = useTypingStatus(contact.id, contact.id); //
  const lastMsg = useLastChatMessage(contact.id); //

  return (
    <div className={`contact-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="contact-avatar-wrapper">
        <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
        {/* Використовуємо 'online' (те, що повернув хук) */}
        {online && <span className="online-indicator"></span>}
      </div>
      <div className="contact-info">
        <span className="contact-name">{contact.name}</span>
        <span className="contact-preview">
          {typing ? (
            <span className="typing-text">typing...</span>
          ) : (
            //lastMsg.message береться з об'єкта Message_T
            lastMsg?.message || contact.lastMessage || "No messages yet"
          )}
        </span>
      </div>
    </div>
  );
}
export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const { id } = useParams<{ id: string }>(); // Отримуємо "3" з URL /chat/3
  const activeChatId = Number(id); // Перетворюємо на число для запитів
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isOnline = useUserStatus(activeChatId); 
  const isTyping = useTypingStatus(activeChatId, activeChatId); // для особистих чатів, де userID = chatID
  const [contacts, setContacts] = useState<{id: number, name: string, avatar: string, isOnline: boolean}[]>([]);
  const activeContact = contacts.find(c => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isChatPeerOnline = useUserStatus(activeChatId);

  // Функція, яка плавно прокручує чат донизу
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  useEffect(() => {
    // При отриманні нових повідомлень скролимо плавно
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    // Якщо ID чату немає, нічого не робимо
    if (!activeChatId) return;

    // 1. ОГОЛОШУЄМО функцію завантаження історії ПЕРЕД її викликом
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/chats/${activeChatId}/messages`);
        const data = await response.json();
        
        if (data && data.results) {
          const normalized = data.results.map((m: any) => ({
            ...m,
            sender_id: m.user_id || m.sender_id,
            user_id: m.user_id || m.sender_id
          }));
          setMessages(normalized);

          // Миттєво скролимо вниз після завантаження історії
          // Використовуємо setTimeout(..., 0), щоб дати React час відрендерити список
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          }, 0);
        }
      } catch (error) {
        console.error("Помилка завантаження історії:", error);
      }
    };

    // 2. ВИКЛИКАЄМО цю функцію
    fetchChatHistory();

    // 3. Підключаємось до WebSocket
    RTClient.connect(CURRENT_USER.UID);
    RTClient.send("chat_entering", { 
      user_id: CURRENT_USER.UID, 
      chat_id: activeChatId 
    });

    // 4. Підписуємось на нові повідомлення по сокетах
    RTClient.setOnMessageCallback(activeChatId, (newMsg: any) => {
      setMessages(prev => [...prev, newMsg]);
    });

    // Підписуємось на статус "друкує"
    RTClient.setOnTypingCallback(activeChatId, (typingData: any) => {
      setIsTyping(typingData.is_typing);
      if (typingData.is_typing) {
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    // 5. Очищення при виході з чату
    return () => {
      RTClient.send("chat_leaving", { 
        user_id: CURRENT_USER.UID, 
        chat_id: activeChatId 
      });
    };
  }, [activeChatId]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const chatsData = await GetUserChats(CURRENT_USER.UID);
        if (chatsData) {
          // Перетворюємо формат вашого бекенду у формат нашого інтерфейсу
          const loadedContacts = chatsData.map((chat: any) => ({
            id: chat.chat_id,
            name: chat.name || `Чат #${chat.chat_id}`,
            avatar: chat.img_url || `https://i.pravatar.cc/150?u=${chat.chat_id}`,
            isOnline: false // Глобальний статус можна буде підключити пізніше
          }));
          setContacts(loadedContacts);
        }
      } catch (error) {
        console.error("Помилка завантаження списку контактів:", error);
      }
    };

    fetchContacts();
  }, []);
  useEffect(() => {
    // Підписуємося на всі вхідні повідомлення для оновлення прев'ю в списку
    RTClient.addGlobalStatusListener((data) => {
      if (data.type === "message") {
        const { chat_id, message } = data.content;
        
        // Оновлюємо текст останнього повідомлення у списку контактів
        setContacts(prevContacts => prevContacts.map(c => 
          c.id === chat_id 
            ? { ...c, lastMessage: typeof message === 'string' ? message : message.message } 
            : c
        ));
      }
    });
  }, []);
  useEffect(() => {
  if (messages.length > 0 && activeChatId) {
    const lastMsg = messages[messages.length - 1];
    const text = typeof lastMsg.message === 'string' ? lastMsg.message : lastMsg.content?.message;
    
    setContacts(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, lastMessage: text } : c
    ));
  }
}, [messages, activeChatId]);
  // 3. Відправка повідомлень
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const messageText = inputText.trim();
    const newMessage: ChatMessage = {
      message_id: Date.now(), 
      chat_id: activeChatId,
      sender_id: CURRENT_USER.UID,
      message_type: 'text',
      message: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    RTClient.send("message", newMessage);
    setInputText('');
  
    RTClient.send("typing", { user_id: CURRENT_USER.UID, chat_id: activeChatId, is_typing: false });

   try {
      const response = await fetch(`${API_URL}/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message", // Додаємо поле Type згідно зі структурою ChatMessage
          content: {       // Усі дані поміщаємо всередину Content
            chat_id: Number(activeChatId),
            user_id: Number(CURRENT_USER.UID),
            message_type: "text",
            message: messageText
          }
        })
      });

      if (response.ok) {
        console.log("Повідомлення успішно збережено в БД!");
      } else {
        console.error("Бекенд повернув помилку збереження:", response.status);
      }
    } catch (error) {
      console.error("Мережева помилка при збереженні повідомлення:", error);
    }
  };

  // 4. Відправка статусу "друкує"
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (activeChatId) {
      RTClient.send("typing", { 
        user_id: CURRENT_USER.UID, 
        chat_id: activeChatId, 
        is_typing: true 
      });
    }
  };
  const navigate = useNavigate();

  const handleContactClick = (id: number) => {
    navigate(`/chat/${id}`); // Змінює URL на localhost:5173/chat/3
  };

  return (
    <div style={{ paddingTop: '70px', height: '100vh', boxSizing: 'border-box' }}>
   
    <div className="chat-container">
      {/* ЛІВА ПАНЕЛЬ */}
      <div className="chat-sidebar">
  <div className="sidebar-header">
    <h2>Messages</h2>
  </div>
  <div className="contact-list">
    {contacts.map(contact => (
      <ContactItem 
        key={contact.id} 
        contact={contact} 
        isActive={activeChatId === contact.id}
        onClick={() => navigate(`/chat/${contact.id}`)} 
      />
    ))}
  </div>
</div>

      {/* ПРАВА ПАНЕЛЬ */}
      <div className="chat-window">
        {activeContact ? (
          <>
           <div className="header-info">
      <h3>{activeContact?.name}</h3>
      <p className="header-status">
        {isTyping ? (
          <span className="typing-text">typing...</span>
        ) : (
          <span className={isOnline ? "online" : "offline"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        )}
      </p>
    </div>

            <div className="messages-area">
            {messages.map((msg) => {
              const isMine = msg.sender_id === CURRENT_USER.UID || msg.user_id === CURRENT_USER.UID;

              return (
                <div 
                  key={msg.message_id || Math.random()} 
                  // Використовуємо message-wrapper sent/received
                  className={`message-wrapper ${isMine ? 'sent' : 'received'}`}
                >
                  {/* Використовуємо message-bubble */}
                  <div className="message-bubble">
                    <p>
                      {typeof msg.message === 'string' ? msg.message : msg.content?.message}
                    </p>
                    <span className="message-time">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Якір для прокрутки залишається тут */}
            <div ref={messagesEndRef} />
          </div>
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={inputText}
                onChange={handleTyping}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">Select a chat to start messaging</div>
        )}
      </div>
    </div>
    </div>
  );
}