import React, { useState } from 'react';
import LoginComponent from './components/LoginComponent';
import ChannelListComponent from './components/ChannelListComponent';
import ChatComponent from './components/ChatComponent';
import socket from './socket';

const App = () => {
    const [nickname, setNickname] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(null);

    // Lorsque l'utilisateur choisit un pseudo
    const handleSetNickname = (name) => {
        setNickname(name);
        socket.emit('set_nickname', name);
    };

    // Lorsque l'utilisateur sélectionne un channel
    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
        socket.emit('join_channel', { channelName: channel, nickname });
    };

    return (
        <div>
            {!nickname ? (
                <LoginComponent onSetNickname={handleSetNickname} />
            ) : !selectedChannel ? (
                <ChannelListComponent onSelectChannel={handleSelectChannel} />
            ) : (
                <ChatComponent channel={selectedChannel} nickname={nickname} />
            )}
        </div>
    );
};

export default App;
