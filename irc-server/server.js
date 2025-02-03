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

// Stockage des données
let channels = ['General']; // Par défaut, un channel "General"
let users = {}; // Map des utilisateurs connectés (clé: socket.id)

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Enregistrer le pseudo de l'utilisateur
    socket.on('set_nickname', (nickname) => {
        users[socket.id] = { nickname, channels: [] };
        console.log(`${nickname} connected.`);
    });

    // Récupérer la liste des channels
    socket.on('get_channels', () => {
        socket.emit('channel_list', channels);
    });

    // Créer un channel
    socket.on('create_channel', (channelName) => {
        if (!channels.includes(channelName)) {
            channels.push(channelName); // Ajouter le channel à la liste
            console.log(`Channel created: ${channelName}`);
            io.emit('channel_list', channels); // Notifie tous les utilisateurs
        } else {
            socket.emit('error_message', `Channel "${channelName}" already exists.`);
        }
    });

    // Rejoindre un channel
    socket.on('join_channel', ({ channelName, nickname }) => {
        if (channels.includes(channelName)) {
            socket.join(channelName);
            users[socket.id].channels.push(channelName);
            io.to(channelName).emit('message', `${nickname} joined ${channelName}.`);
            console.log(`${nickname} joined channel: ${channelName}`);
        } else {
            socket.emit('error_message', `Channel "${channelName}" does not exist.`);
        }
    });

    // Envoi d’un message dans un channel
    socket.on('send_message', ({ channelName, message, nickname }) => {
        io.to(channelName).emit('message', `${nickname}: ${message}`);
    });

    // Déconnexion
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
