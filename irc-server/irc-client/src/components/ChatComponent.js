import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChatComponent = ({ channel, nickname, setNickname }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        if (message.startsWith('/nick ')) {
            const newNickname = message.split(' ')[1];
            setNickname(newNickname);
            socket.emit('set_nickname', newNickname);
            setMessage('');
            return;
        }

        socket.emit('send_message', {
            channelName: channel,
            message,
            nickname,
        });

        setMessage('');
    };

    return (
        <div>
            <h3>Connected as: {nickname}</h3>
            <h2>Channel: {channel}</h2>
            <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll', padding: '10px' }}>
                {messages.length === 0 ? <p>No messages yet.</p> : messages.map((msg, index) => <p key={index}>{msg}</p>)}
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
