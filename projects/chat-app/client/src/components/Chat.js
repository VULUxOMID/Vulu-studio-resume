import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FaSignOutAlt, FaPaperPlane, FaUsers, FaCircle } from 'react-icons/fa';
import MessageList from './MessageList';
import UserList from './UserList';

const Chat = ({ socket, user, onLogout, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Load previous messages
    fetchMessages();

    // Socket event listeners
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_status_change', (data) => {
      setUsers(prev => prev.map(u => 
        u.username === data.username 
          ? { ...u, isOnline: data.isOnline }
          : u
      ));
    });

    socket.on('online_users', (onlineUsers) => {
      setUsers(onlineUsers);
    });

    socket.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_status_change');
      socket.off('online_users');
      socket.off('user_typing');
    };
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages/general');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      const messageData = {
        content: newMessage.trim(),
        username: user.username,
        room: 'general'
      };

      socket.emit('send_message', messageData);
      setNewMessage('');
      setIsTyping(false);
      socket.emit('stop_typing', { username: user.username, room: 'general' });
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { username: user.username, room: 'general' });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { username: user.username, room: 'general' });
    }, 1000);
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2>Real-Time Chat</h2>
          <div className="connection-status">
            <FaCircle className={isConnected ? 'connected' : 'disconnected'} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="users-btn"
            onClick={() => setShowUserList(!showUserList)}
          >
            <FaUsers />
            <span>Users ({users.length})</span>
          </button>
          <button className="logout-btn" onClick={handleLogoutClick}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="chat-main">
        {/* User List Sidebar */}
        {showUserList && (
          <div className="user-list-sidebar">
            <UserList users={users} currentUser={user} />
          </div>
        )}

        {/* Chat Area */}
        <div className="chat-area">
          <MessageList 
            messages={messages} 
            currentUser={user}
            typingUsers={typingUsers}
          />
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="message-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                disabled={!isConnected}
                className="message-input"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim() || !isConnected}
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 