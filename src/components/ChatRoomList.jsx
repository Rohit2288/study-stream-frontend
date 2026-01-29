import React from 'react';
import './ChatRoomList.css';

const ChatRoomList = ({ rooms, onSelectRoom, onCreateRoom, isIETStudent }) => {
    const activeRooms = rooms.filter(room => room.isActive);
    const endedRooms = rooms.filter(room => !room.isActive);

    const RoomCard = ({ room }) => (
        <div
            className={`room-card ${!room.isActive ? 'room-ended' : ''}`}
            onClick={() => onSelectRoom(room)}
        >
            <div className="room-header">
                <h3>{room.title}</h3>
                {!room.isActive && <span className="badge badge-ended">Ended</span>}
            </div>
            <div className="room-meta">
                <span>📚 {room.subject}</span>
                <span>📅 Semester {room.semester}</span>
                <span>📝 {room.year} - {room.examType === 'midsem' ? 'Mid-Sem' : 'End-Sem'}</span>
            </div>
            <div className="room-footer">
                <span className="room-creator">👤 {room.createdByName}</span>
                <span className="room-messages">💬 {room._count?.messages || 0} messages</span>
            </div>
        </div>
    );

    return (
        <div className="chat-room-list">
            <div className="room-list-header">
                <h2>Discussion Rooms</h2>
                {isIETStudent && (
                    <button className="btn btn-primary" onClick={onCreateRoom}>
                        + Create New Room
                    </button>
                )}
            </div>

            {!isIETStudent && (
                <div className="info-message">
                    💡 Only IET DAVV students can create rooms and send messages. Sign up with @ietdavv.edu.in to participate.
                </div>
            )}

            {activeRooms.length === 0 && endedRooms.length === 0 ? (
                <div className="empty-state">
                    <p>📭 No discussion rooms yet.</p>
                    {isIETStudent && <p>Create the first room to start discussing question papers!</p>}
                </div>
            ) : (
                <>
                    {activeRooms.length > 0 && (
                        <div className="room-section">
                            <h3>Active Discussions</h3>
                            <div className="rooms-grid">
                                {activeRooms.map(room => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
                            </div>
                        </div>
                    )}

                    {endedRooms.length > 0 && (
                        <div className="room-section">
                            <h3>Ended Discussions</h3>
                            <div className="rooms-grid">
                                {endedRooms.map(room => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatRoomList;
