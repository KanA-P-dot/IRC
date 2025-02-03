import React, { useState } from 'react';

const LoginComponent = ({ onSetNickname }) => {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            onSetNickname(nickname.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <button type="submit">Join</button>
        </form>
    );
};

export default LoginComponent;
