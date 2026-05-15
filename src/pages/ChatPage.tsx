import axiosClient from '../api/axiosClient';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import { RTClient } from '../api/RTClient';
import { CURRENT_USER } from '../api/currentUser';
import { API_URL } from '../api/API_CONFIG';
import { useNavigate } from 'react-router-dom';
import { GetUserChats } from '../api/chats';
interface ChatMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  message_type: string;
  message: string;
  timestamp: string;
}

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const { id } = useParams<{ id: string }>(); // Отримуємо "3" з URL /chat/3
  const activeChatId = Number(id); // Перетворюємо на число для запитів
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [contacts, setContacts] = useState<{id: number, name: string, avatar: string, isOnline: boolean}[]>([]);
  const activeContact = contacts.find(c => c.id === activeChatId);

  useEffect(() => {
    // Якщо ID чату немає, нічого не робимо
    if (!activeChatId) return;

    // 1. ОГОЛОШУЄМО функцію завантаження історії ПЕРЕД її викликом
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/chats/${activeChatId}/messages`);
        const data = await response.json();
        
        if (data && data.results) {
          setMessages(data.results.reverse());
        }
      } catch (error) {
        console.error("Помилка завантаження історії чату:", error);
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
    <div className="chat-container">
      {/* ЛІВА ПАНЕЛЬ */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="contact-list">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${activeChatId === contact.id ? 'active' : ''}`}
              onClick={() => setActiveChatId(contact.id)}
            >
              <div className="contact-avatar-wrapper">
                <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                {contact.isOnline && <span className="online-indicator"></span>}
              </div>
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-preview">Last message...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПРАВА ПАНЕЛЬ */}
      <div className="chat-window">
        {activeContact ? (
          <>
            <div className="chat-header">
              <img src={activeContact.avatar} alt={activeContact.name} className="header-avatar" />
              <div className="header-info">
                <h3>{activeContact.name}</h3>
                <p className="header-status">
                  {isTyping ? <span className="typing-text">typing...</span> : (activeContact.isOnline ? 'Online' : 'Offline')}
                </p>
              </div>
            </div>

            <div className="messages-area">
              {messages.map(msg => {
                const isMe = msg.sender_id === CURRENT_USER.UID;
                return (
                  <div key={msg.message_id} className={`message-wrapper ${isMe ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
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
  );
}