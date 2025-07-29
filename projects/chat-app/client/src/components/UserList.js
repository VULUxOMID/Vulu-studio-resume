import React from 'react';
import './UserList.css';
import { FaUser, FaCircle } from 'react-icons/fa';

const UserList = ({ users, currentUser }) => {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Unknown';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const sortedUsers = [...users].sort((a, b) => {
    // Online users first
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    
    // Then by username
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Online Users</h3>
        <span className="user-count">{users.length} users</span>
      </div>
      
      <div className="user-list-content">
        {sortedUsers.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">👥</div>
            <p>No users online</p>
          </div>
        ) : (
          sortedUsers.map((user) => (
            <div 
              key={user._id || user.username} 
              className={`user-item ${user.username === currentUser.username ? 'current-user' : ''}`}
            >
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <FaUser />
                )}
                <div className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}>
                  <FaCircle />
                </div>
              </div>
              
              <div className="user-info">
                <div className="user-name">
                  {user.username}
                  {user.username === currentUser.username && (
                    <span className="you-badge">You</span>
                  )}
                </div>
                <div className="user-status">
                  {user.isOnline ? (
                    <span className="online-status">Online</span>
                  ) : (
                    <span className="offline-status">
                      Last seen {formatLastSeen(user.lastSeen)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList; 