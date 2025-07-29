import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Login from './components/Login';
import Chat from './components/Chat';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Socket connection status
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('chatUser', JSON.stringify(userData));
    
    // Join the chat room
    socket.emit('join_room', { room: 'general' });
    socket.emit('user_login', { username: userData.username, room: 'general' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
    socket.disconnect();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Chat 
        socket={socket} 
        user={user} 
        onLogout={handleLogout}
        isConnected={isConnected}
      />
    </div>
  );
}

export default App; 