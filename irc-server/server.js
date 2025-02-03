const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


let channels = ['General']; 
let users = {}; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('set_nickname', (nickname) => {
        if (!users[socket.id]) users[socket.id] = { nickname: 'Anonymous', channels: [] };
        users[socket.id].nickname = nickname;
        console.log(`User ${socket.id} set nickname to ${nickname}`);
    });
    

    socket.on('get_channels', () => {
        socket.emit('channel_list', channels);
    });

    socket.on('create_channel', (channelName) => {
        if (!channels.includes(channelName)) {
            channels.push(channelName); 
            console.log(`Channel created: ${channelName}`);
            io.emit('channel_list', channels); 
        } else {
            socket.emit('error_message', `Channel "${channelName}" already exists.`);
        }
    });

    socket.on('join_channel', ({ channelName, nickname }) => {
        if (!users[socket.id]) {
            users[socket.id] = { nickname: nickname || 'Anonymous', channels: [] };
        }
    
        if (!channels.includes(channelName)) {
            socket.emit('error_message', `Channel "${channelName}" does not exist.`);
            return;
        }
    
        users[socket.id].channels.push(channelName);
        socket.join(channelName);
        console.log(`${nickname} joined ${channelName}`);
    
        io.to(channelName).emit('message', `${nickname} joined the channel.`);
    });
    

    socket.on('send_message', ({ channelName, message, nickname }) => {
        if (!channelName || !message || !nickname) {
            return;
        }
    
        io.to(channelName).emit('message', `${nickname}: ${message}`);
    });
    

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            console.log(`${user.nickname} disconnected.`);
        }
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
