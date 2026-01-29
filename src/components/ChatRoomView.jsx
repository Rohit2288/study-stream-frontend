import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatRoomView.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ChatRoomView = ({ room, onBack, onRoomEnded, token, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [endingChat, setEndingChat] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch room messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL}/api/chat-rooms/${room.id}/messages`);
                const data = await response.json();
                setMessages(data.messages || []);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                setError('Failed to load messages');
                setLoading(false);
            }
        };

        fetchMessages();
    }, [room.id]);

    // Setup Socket.IO
    useEffect(() => {
        if (!token) return;

        const newSocket = io(API_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Connected to chat');
            newSocket.emit('join-room', { roomId: room.id });
        });

        newSocket.on('joined-room', (data) => {
            console.log('Joined room:', data.roomTitle);
        });

        newSocket.on('new-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        newSocket.on('error', (err) => {
            setError(err.message || 'Socket error');
        });

        setSocket(newSocket);

        return () => {
            newSocket.emit('leave-room');
            newSocket.close();
        };
    }, [token, room.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !socket) {
            return;
        }

        socket.emit('send-message', {
            content: newMessage,
            roomId: room.id
        });
        setNewMessage('');
    };

    const handleEndChat = async () => {
        if (!window.confirm('Are you sure you want to end this chat and generate a summary? This action cannot be undone.')) {
            return;
        }

        setEndingChat(true);
        try {
            const response = await fetch(`${API_URL}/api/chat-rooms/${room.id}/end`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to end chat');
            }

            alert('Chat ended successfully! Summary has been generated.');
            onRoomEnded();
        } catch (err) {
            alert(err.message);
        } finally {
            setEndingChat(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-room-view">
            <div className="room-view-header">
                <button className="btn-back" onClick={onBack}>← Back to Rooms</button>
                <div className="room-info">
                    <h2>{room.title}</h2>
                    <div className="room-details">
                        <span>📚 {room.subject}</span>
                        <span>📅 Semester {room.semester}</span>
                        <span>📝 {room.year} - {room.examType === 'midsem' ? 'Mid-Sem' : 'End-Sem'}</span>
                    </div>
                </div>
                {room.isActive && (
                    <button
                        className="btn btn-warning"
                        onClick={handleEndChat}
                        disabled={endingChat}
                    >
                        {endingChat ? 'Ending...' : '🔚 End Chat & Generate Summary'}
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <p>No messages yet. Start the discussion!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.senderId === user?.id ? 'message-own' : 'message-other'}`}
                        >
                            {msg.isImage ? (
                                <div className="message-image">
                                    <img src={msg.content} alt="Question paper" />
                                    <p className="image-caption">📄 Question Paper</p>
                                </div>
                            ) : (
                                <>
                                    <div className="message-header">
                                        <span className="message-sender">{msg.senderName}</span>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="message-content">{msg.content}</div>
                                </>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {room.isActive ? (
                <form onSubmit={handleSendMessage} className="message-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                    />
                    <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                        Send
                    </button>
                </form>
            ) : (
                <div className="chat-ended-notice">
                    <p>🔒 This chat has ended. View the summary in the Summaries page.</p>
                </div>
            )}
        </div>
    );
};

export default ChatRoomView;
