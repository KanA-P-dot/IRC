import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChatComponent = ({ channel, nickname }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Écoute les messages envoyés par le serveur
        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Nettoyage des écouteurs
        return () => {
            socket.off('message');
        };
    }, []);

    // Envoi d'un message
    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send_message', {
                channelName: channel,
                message,
                nickname,
            });
            setMessage(''); // Réinitialise l'input
        }
    };

    return (
        <div>
            <h2>Channel: {channel}</h2>
            <div
                style={{
                    border: '1px solid black',
                    height: '300px',
                    overflowY: 'scroll',
                    padding: '10px',
                }}
            >
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg, index) => <p key={index}>{msg}</p>)
                )}
            </div>
            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
