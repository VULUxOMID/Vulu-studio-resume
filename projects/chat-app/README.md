# Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB. This project demonstrates real-time communication capabilities, user presence tracking, and modern UI/UX design.

## 🚀 Features

### Real-Time Communication
- **Instant Messaging**: Real-time message delivery using Socket.io
- **Typing Indicators**: See when other users are typing
- **User Presence**: Online/offline status with last seen timestamps
- **Message History**: Persistent message storage in MongoDB

### User Experience
- **Modern UI**: Clean, responsive design with smooth animations
- **User Authentication**: Simple login system with avatar generation
- **User List**: Sidebar showing all online users with status indicators
- **Message Bubbles**: WhatsApp-style message bubbles with timestamps
- **File Sharing**: Support for file uploads and sharing
- **Mobile Responsive**: Works perfectly on all devices

### Technical Features
- **Scalable Architecture**: Built with modern web technologies
- **Real-time Updates**: Live user status and message updates
- **Error Handling**: Robust error handling and connection management
- **Performance Optimized**: Efficient message rendering and state management

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Socket.io Client**: Real-time communication
- **React Icons**: Beautiful icon library
- **CSS3**: Modern styling with animations and responsive design

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: NoSQL database for message storage
- **Mongoose**: MongoDB object modeling

### Development Tools
- **Concurrently**: Run frontend and backend simultaneously
- **Nodemon**: Auto-restart server on file changes
- **CORS**: Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/chatapp
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Server only
   npm run server
   
   # Client only
   cd client && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Usage

### Getting Started
1. Open the application in your browser
2. Enter any username and password (demo mode)
3. Start chatting with other users
4. Use the "Users" button to see online users
5. Watch for typing indicators when others are typing

### Features in Action
- **Real-time Messaging**: Messages appear instantly for all users
- **User Presence**: See who's online and their last seen time
- **Typing Indicators**: Animated dots show when someone is typing
- **Message History**: Previous messages are loaded when you join
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🏗️ Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Chat.js
│   │   │   ├── Login.js
│   │   │   ├── MessageList.js
│   │   │   └── UserList.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   └── index.js          # Server entry point
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### GET `/api/messages/:room`
- Returns messages for a specific room
- Supports pagination and sorting

### GET `/api/users`
- Returns all users with their online status
- Includes last seen timestamps

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder to your hosting platform

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the server folder
3. Update the frontend API URL to point to your deployed backend

### Database Setup
- Use MongoDB Atlas for cloud database
- Update `MONGODB_URI` in environment variables

## 🎨 Customization

### Styling
- Modify CSS files in `client/src/components/`
- Update color scheme in CSS variables
- Customize animations and transitions

### Features
- Add new message types (images, videos)
- Implement private messaging
- Add message reactions
- Create multiple chat rooms

## 🐛 Troubleshooting

### Common Issues
1. **Connection Failed**: Check if MongoDB is running
2. **Messages Not Sending**: Verify Socket.io connection
3. **Port Conflicts**: Change ports in package.json and .env

### Development Tips
- Use browser dev tools to monitor Socket.io events
- Check server console for error logs
- Test with multiple browser tabs for real-time features

## 📱 Mobile Support

The application is fully responsive and works on:
- iOS Safari
- Android Chrome
- Mobile browsers

## 🔒 Security Considerations

For production deployment:
- Implement proper authentication (JWT, OAuth)
- Add input validation and sanitization
- Use HTTPS for all communications
- Implement rate limiting
- Add CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- React team for the amazing framework
- MongoDB for the database solution
- The open-source community for inspiration

---

**Built with ❤️ for YUBO Engineering Team** 