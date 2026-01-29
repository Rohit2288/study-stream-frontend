import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatRoomList from '../components/ChatRoomList';
import CreateRoomModal from '../components/CreateRoomModal';
import ChatRoomView from '../components/ChatRoomView';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Chat = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token, user, isIETStudent } = useAuth();

    // Fetch chat rooms
    const fetchRooms = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat-rooms`);
            const data = await response.json();
            setRooms(data.rooms || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
            setError('Failed to load chat rooms');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
    };

    const handleBackToList = () => {
        setSelectedRoom(null);
        fetchRooms(); // Refresh room list
    };

    const handleRoomCreated = (newRoom) => {
        setRooms([newRoom, ...rooms]);
        setSelectedRoom(newRoom); // Automatically open the new room
    };

    const handleRoomEnded = () => {
        setSelectedRoom(null);
        fetchRooms(); // Refresh to update room status
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading chat rooms...</p>
            </div>
        );
    }

    return (
        <div className="chat-page">
            {error && <div className="error-message">{error}</div>}

            {selectedRoom ? (
                <ChatRoomView
                    room={selectedRoom}
                    onBack={handleBackToList}
                    onRoomEnded={handleRoomEnded}
                    token={token}
                    user={user}
                />
            ) : (
                <ChatRoomList
                    rooms={rooms}
                    onSelectRoom={handleSelectRoom}
                    onCreateRoom={() => setShowCreateModal(true)}
                    isIETStudent={isIETStudent}
                />
            )}

            <CreateRoomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onRoomCreated={handleRoomCreated}
                token={token}
            />
        </div>
    );
};

export default Chat;
