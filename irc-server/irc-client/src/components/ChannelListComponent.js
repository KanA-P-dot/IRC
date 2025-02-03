import React, { useState, useEffect } from 'react';
import socket from '../socket';

const ChannelListComponent = ({ onSelectChannel }) => {
    const [channels, setChannels] = useState([]);
    const [newChannel, setNewChannel] = useState('');

    useEffect(() => {
        socket.emit('get_channels');
        socket.on('channel_list', (channelList) => {
            setChannels(channelList);
        });

        return () => socket.off('channel_list');
    }, []);

    const handleCreateChannel = () => {
        if (newChannel.trim()) {
            socket.emit('create_channel', newChannel.trim());
            setNewChannel(''); 
        }
    };

    return (
        <div>
            <h2>Available Channels</h2>
            <ul>
                {channels.length === 0 ? (
                    <p>No channels available. Create one!</p>
                ) : (
                    channels.map((channel) => (
                        <li key={channel}>
                            <button onClick={() => onSelectChannel(channel)}>
                                {channel}
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <div>
                <input
                    type="text"
                    placeholder="New channel name"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                />
                <button onClick={handleCreateChannel}>Create Channel</button>
            </div>
        </div>
    );
};

export default ChannelListComponent;
