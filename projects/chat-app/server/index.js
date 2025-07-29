const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    timestamp: { type: Date, default: Date.now },
    room: { type: String, default: 'general' }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('join_room', (data) => {
        socket.join(data.room);
        console.log(`User ${data.username} joined room: ${data.room}`);
    });

    // Handle user login
    socket.on('user_login', async (data) => {
        try {
            const user = await User.findOne({ username: data.username });
            if (user) {
                user.isOnline = true;
                user.lastSeen = new Date();
                await user.save();
                
                connectedUsers.set(socket.id, {
                    userId: user._id,
                    username: user.username,
                    room: data.room || 'general'
                });

                // Notify others that user is online
                socket.to(data.room || 'general').emit('user_status_change', {
                    username: user.username,
                    isOnline: true
                });

                // Send online users list
                const onlineUsers = await User.find({ isOnline: true });
                io.to(data.room || 'general').emit('online_users', onlineUsers);
            }
        } catch (error) {
            console.error('Error handling user login:', error);
        }
    });

    // Handle new message
    socket.on('send_message', async (data) => {
        try {
            const user = await User.findOne({ username: data.username });
            if (user) {
                const message = new Message({
                    sender: user._id,
                    content: data.content,
                    messageType: data.messageType || 'text',
                    room: data.room || 'general'
                });
                await message.save();

                const messageWithUser = await Message.findById(message._id).populate('sender', 'username avatar');
                
                io.to(data.room || 'general').emit('receive_message', {
                    id: message._id,
                    sender: messageWithUser.sender.username,
                    content: message.content,
                    messageType: message.messageType,
                    timestamp: message.timestamp,
                    avatar: messageWithUser.sender.avatar
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        socket.to(data.room || 'general').emit('user_typing', {
            username: data.username,
            isTyping: true
        });
    });

    socket.on('stop_typing', (data) => {
        socket.to(data.room || 'general').emit('user_typing', {
            username: data.username,
            isTyping: false
        });
    });

    // Handle file upload
    socket.on('file_upload', async (data) => {
        try {
            const user = await User.findOne({ username: data.username });
            if (user) {
                const message = new Message({
                    sender: user._id,
                    content: data.fileUrl,
                    messageType: 'file',
                    room: data.room || 'general'
                });
                await message.save();

                const messageWithUser = await Message.findById(message._id).populate('sender', 'username avatar');
                
                io.to(data.room || 'general').emit('receive_message', {
                    id: message._id,
                    sender: messageWithUser.sender.username,
                    content: data.fileUrl,
                    messageType: 'file',
                    fileName: data.fileName,
                    timestamp: message.timestamp,
                    avatar: messageWithUser.sender.avatar
                });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        
        const userData = connectedUsers.get(socket.id);
        if (userData) {
            try {
                const user = await User.findById(userData.userId);
                if (user) {
                    user.isOnline = false;
                    user.lastSeen = new Date();
                    await user.save();

                    // Notify others that user is offline
                    socket.to(userData.room).emit('user_status_change', {
                        username: user.username,
                        isOnline: false
                    });
                }
                connectedUsers.delete(socket.id);
            } catch (error) {
                console.error('Error handling user disconnect:', error);
            }
        }
    });
});

// API Routes
app.get('/api/messages/:room', async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .populate('sender', 'username avatar')
            .sort({ timestamp: 1 })
            .limit(50);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username avatar isOnline lastSeen');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 