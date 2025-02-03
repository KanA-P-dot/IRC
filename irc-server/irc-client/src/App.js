import React, { useState } from 'react';
import ChannelListComponent from './components/ChannelListComponent';
import ChatComponent from './components/ChatComponent';
import socket from './socket';

const App = () => {
    const [nickname, setNickname] = useState('Anonymous');
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleSelectChannel = (channel) => {
        setSelectedChannel(channel);
        socket.emit('join_channel', { channelName: channel, nickname });
    };

    return (
        <div>
            {!selectedChannel ? (
                <ChannelListComponent onSelectChannel={handleSelectChannel} />
            ) : (
                <ChatComponent channel={selectedChannel} nickname={nickname} setNickname={setNickname} />
            )}
        </div>
    );
};

export default App;
