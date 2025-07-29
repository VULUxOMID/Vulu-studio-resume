import React, { useEffect, useRef } from 'react';
import './MessageList.css';
import { FaUser } from 'react-icons/fa';

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = (message, index) => {
    const isOwnMessage = message.sender === currentUser.username;
    const showDate = index === 0 || 
      formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);

    return (
      <div key={message.id || index}>
        {showDate && (
          <div className="date-divider">
            <span>{formatDate(message.timestamp)}</span>
          </div>
        )}
        <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
          <div className="message-avatar">
            {message.avatar ? (
              <img src={message.avatar} alt={message.sender} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-sender">{message.sender}</span>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            <div className="message-text">
              {message.messageType === 'file' ? (
                <div className="file-message">
                  <a href={message.content} target="_blank" rel="noopener noreferrer">
                    📎 {message.fileName || 'File'}
                  </a>
                </div>
              ) : (
                message.content
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="message-list-container">
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Welcome to the chat!</h3>
            <p>Start a conversation by sending a message below.</p>
          </div>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-avatar">
              <FaUser />
            </div>
            <div className="typing-content">
              <div className="typing-text">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.join(', ')} are typing...`
                }
              </div>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 