import axiosClient from '../api/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import { RTClient } from '../api/RTClient'; 
import { CURRENT_USER } from '../api/currentUser';
import { API_URL } from '../api/API_CONFIG';
import { GetUserChats } from '../api/chats';

interface ChatMessage {
  message_id: number;
  chat_id: number;
  sender_id: number;
  message_type: string;
  message: string;
  timestamp: string;
}

function ContactItem({ contact, isActive, onClick }: { contact: any, isActive: boolean, onClick: () => void }) {
  return (
    <div className={`contact-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="contact-avatar-wrapper">
        <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
        {contact.isOnline && <span className="online-indicator"></span>}
      </div>
      <div className="contact-info">
        <span className="contact-name">{contact.name}</span>
        <span className="contact-preview">
          {contact.lastMessage || "No messages yet"}
        </span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const { id } = useParams<{ id: string }>(); 
  const activeChatId = Number(id); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const activeContact = contacts.find(c => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Наш таймер вводу
  const incomingTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ФІКС 1: Окремий таймер для співрозмовника

  // Беремо онлайн-статус прямо зі списку контактів (щоб було синхронно)
  const isPeerOnline = activeContact?.isOnline || false;

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    if (!activeChatId) return;

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

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          }, 0);
        }
      } catch (error) {
        console.error("Помилка завантаження історії:", error);
      }
    };

    fetchChatHistory();

    RTClient.connect(CURRENT_USER.UID);
    
    RTClient.send("chat_entering", { 
      user_id: CURRENT_USER.UID, 
      chat_id: activeChatId 
    });

    RTClient.setOnMessageCallback(activeChatId, (newMsg: any) => {
      setMessages(prev => [...prev, newMsg]);
    });

    // ФІКС 1: Правильна обробка "друкує" з очищенням таймера
    RTClient.setOnTypingCallback(activeChatId, (typingData: any) => {
      if (Number(typingData.user_id) !== Number(CURRENT_USER.UID)) {
        setIsTyping(typingData.is_typing);
        
        // Очищаємо попередній таймер відключення, якщо людина все ще пише
        if (incomingTypingTimeoutRef.current) {
          clearTimeout(incomingTypingTimeoutRef.current);
        }
        
        // Якщо вона пише, заводимо таймер на 3 сек, щоб скинути статус
        if (typingData.is_typing) {
          incomingTypingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      }
    });

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
          const loadedContacts = chatsData.map((chat: any) => {
            // ФІКС 2: Витягуємо peer_id (ID співрозмовника) з даних бекенду
            const peerId = chat.peer_id?.Valid ? chat.peer_id.Int32 : (chat.peer_id || null);

            return {
              id: chat.chat_id || chat.id,
              name: chat.name || chat.title || `Чат #${chat.chat_id || chat.id}`,
              avatar: chat.img_url || chat.avatar_url || `https://i.pravatar.cc/150?u=${chat.chat_id || chat.id}`,
              peer_id: peerId, // ЗБЕРІГАЄМО ЙОГО
              isOnline: false,
              lastMessage: ""
            };
          });
          setContacts(loadedContacts);
        }
      } catch (error) {
        console.error("Помилка завантаження контактів:", error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    RTClient.addGlobalStatusListener((data) => {
      if (data.type === "message") {
        const { chat_id, message } = data.content;
        setContacts(prevContacts => prevContacts.map(c => 
          c.id === chat_id 
            ? { ...c, lastMessage: typeof message === 'string' ? message : message.message } 
            : c
        ));
      } else if (data.type === "online" || data.type === "chat_entering") {
         const incomingUserId = data.content?.user_id;
         const statusOnline = data.type === "online" ? data.content?.is_online : true;

         // Шукаємо контакт по peer_id і оновлюємо його статус
         setContacts(prevContacts => prevContacts.map(c => 
           c.peer_id === incomingUserId ? { ...c, isOnline: statusOnline } : c
         ));

         // ФІКС 3: Ехо-відповідь ("Я теж тут!")
         // Якщо хтось інший зайшов, маякнемо йому, що ми онлайн, щоб він це побачив
         if (data.type === "chat_entering" && incomingUserId !== CURRENT_USER.UID) {
           RTClient.send("online", { user_id: CURRENT_USER.UID, is_online: true });
         }
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
    setInputText('');
  
    RTClient.send("typing", { user_id: CURRENT_USER.UID, chat_id: activeChatId, is_typing: false });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    RTClient.send("message", newMessage);

    try {
      const response = await fetch(`${API_URL}/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          content: {
            chat_id: Number(activeChatId),
            user_id: Number(CURRENT_USER.UID),
            message_type: "text",
            message: messageText
          }
        })
      });

      if (!response.ok) {
        console.error("Бекенд повернув помилку збереження:", response.status);
      }
    } catch (error) {
      console.error("Мережева помилка при збереженні повідомлення:", error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (activeChatId) {
      RTClient.send("typing", { 
        user_id: CURRENT_USER.UID, 
        chat_id: activeChatId, 
        is_typing: true 
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        RTClient.send("typing", { 
          user_id: CURRENT_USER.UID, 
          chat_id: activeChatId, 
          is_typing: false 
        });
      }, 2000);
    }
  };

  const navigate = useNavigate();

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
                    <span className={isPeerOnline ? "online" : "offline"}>
                      {isPeerOnline ? "Online" : "Offline"}
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
                      className={`message-wrapper ${isMine ? 'sent' : 'received'}`}
                    >
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