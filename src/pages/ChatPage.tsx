import React, { useState } from 'react';
import './ChatPage.css';

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  
  // Тимчасові дані для візуалізації
  const [activeChatId, setActiveChatId] = useState(1);
  const [isTyping, setIsTyping] = useState(true); // Для тесту статусу "друкує"

  const contacts = [
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1', isOnline: true },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2', isOnline: false },
  ];

  const messages = [
    { id: 1, senderId: 2, text: 'Hi! Have you seen the new Dune movie?', timestamp: '10:00 AM' },
    { id: 2, senderId: 'me', text: 'Hey! Yes, it was absolutely amazing. The visuals are stunning.', timestamp: '10:05 AM' },
    { id: 3, senderId: 2, text: 'I agree! We should discuss it later.', timestamp: '10:06 AM' },
  ];

  const activeContact = contacts.find(c => c.id === activeChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    console.log("Sending message:", inputText);
    setInputText('');
  };

  return (
    <div className="chat-container">
      {/* ЛІВА ПАНЕЛЬ: Список контактів */}
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
                {/* Індикатор Online */}
                {contact.isOnline && <span className="online-indicator"></span>}
              </div>
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-preview">Last message preview...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПРАВА ПАНЕЛЬ: Вікно діалогу */}
      <div className="chat-window">
        {activeContact ? (
          <>
            {/* Шапка чату */}
            <div className="chat-header">
              <img src={activeContact.avatar} alt={activeContact.name} className="header-avatar" />
              <div className="header-info">
                <h3>{activeContact.name}</h3>
                {/* Тут будемо міняти статус залежно від подій WS */}
                <p className="header-status">
                  {isTyping ? <span className="typing-text">typing...</span> : (activeContact.isOnline ? 'Online' : 'Offline')}
                </p>
              </div>
            </div>

            {/* Область повідомлень */}
            <div className="messages-area">
              {messages.map(msg => (
                <div key={msg.id} className={`message-wrapper ${msg.senderId === 'me' ? 'sent' : 'received'}`}>
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Поле вводу */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
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