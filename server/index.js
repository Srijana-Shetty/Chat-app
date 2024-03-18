require('dotenv').config();

    const http = require('http');
    const express = require('express');
    const socket_io = require('socket.io');
    const cors = require('cors');
    const mongoose = require('mongoose');
    const Message = require('./models/Message');
   //  const date = new Date();
     const formattedTime =  new Date().toLocaleString([], {dateStyle:'medium', timeStyle: 'medium' })

    mongoose.connect(process.env.MONGO_URL);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
    console.log('MongoDB connection established successfully');
    });

    const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

    const PORT = process.env.PORT || 5000;

    const router = require('./router');

    const app = express();
    
    app.use(cors());
    app.get('/messages/:room', async (req, res) => {
        try {
            const{room} = req.params;
            const messages = await Message.find({room:room});
            console.log(messages)
            return res.send(messages)
           // res.json(messages);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });
    
    const server = http.createServer(app);
    const io = socket_io(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
    });


    io.on('connection', (socket) => {
        socket.on('join', ({ name, room }, callback) => {
            const { error, user } = addUser({ id: socket.id, name, room });
    
            if (error) {
                return callback(error); // Return the error to the client callback
            }

            if (!user) {
                return callback(new Error('User not found'));
            }
           
            socket.join(user.room); // to Ensure the user joins the correct room

            // Emit a welcome message to the user who joined
            socket.emit('message',async()=>{
                const newMessage = new Message({ 
                    user: 'admin', 
                    text: `${user.name}, Welcome to room ${user.room}`,
                    room:`${user.room}`,
                    showTime:`${formattedTime}`
                 });
                
                await newMessage.save();
            });
           // Broadcast a message to all users in the room that a new user joined
           socket.broadcast.to(user.room).emit('message',async()=>{
            const newMessage = new Message({ 
                user: 'admin', 
                text: `${user.name} has joined!`,
                room:`${user.room}`,
                showTime:`${formattedTime}`});
            await newMessage.save();
        });


            Message.find({ room: user.room })
            .then((messages) => {
                // Handle the successful result
                socket.emit('roomData', { room: user.room, messages });
                callback();
            })
            .catch((err) => {
                // Handle any errors
                console.error(err);
                callback(err);
            });
    
            // Send messages to the user
            callback();
        });
    
        // Move the 'sendMessage' event listener inside the 'connection' event listener
        socket.on('sendMessage', async (message, callback) => {
            const user = getUser(socket.id);
    
            // Save message to MongoDB
            try {
                const newMessage = new Message({
                    user: user.name,
                    showTime: formattedTime ,
                    text: message,
                    room: user.room,
                });
        
                await newMessage.save();
                io.to(user.room).emit('message', { user: user.name, text: message });
                callback();
            } catch (err) {
                console.error(err);
                callback(err);
            }
        });
    
        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
    
            if (user) {
                io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
                io.to(user.room).emit('roomData', { room: user.room, user: getUsersInRoom(user.room) });
            }
        });
    });
    app.use(router);

    server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));