/**
 * Chat Popup Component
 */

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChat, setActiveTab, clearUnread } from '../store/slices/chatSlice';
import socketService from '../services/socket';
import './ChatPopup.css';

function ChatPopup() {
    const dispatch = useDispatch();
    const { messages, isOpen, unreadCount, activeTab } = useSelector((state) => state.chat);
    const { name: userName, role } = useSelector((state) => state.user);
    const { list: students } = useSelector((state) => state.students);

    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleToggle = () => {
        dispatch(toggleChat());
        if (!isOpen) {
            dispatch(clearUnread());
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const message = {
            sender: role,
            senderName: role === 'teacher' ? 'Teacher' : userName,
            text: messageInput.trim()
        };

        socketService.emit('chat:message', message);
        setMessageInput('');
    };

    return (
        <>
            <button className="chat-toggle-btn" onClick={handleToggle}>
                💬
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="chat-popup scale-in">
                    <div className="chat-header">
                        <div className="chat-tabs">
                            <button
                                className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`}
                                onClick={() => dispatch(setActiveTab('chat'))}
                            >
                                Chat
                            </button>
                            <button
                                className={`chat-tab ${activeTab === 'participants' ? 'active' : ''}`}
                                onClick={() => dispatch(setActiveTab('participants'))}
                            >
                                Participants
                            </button>
                        </div>
                        <button className="btn-close" onClick={handleToggle}>✕</button>
                    </div>

                    {activeTab === 'chat' ? (
                        <>
                            <div className="chat-messages">
                                {messages.length === 0 ? (
                                    <div className="empty-state">
                                        <p className="text-gray text-small">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.sender === role ? 'own-message' : ''}`}
                                        >
                                            <div className="message-sender text-small">{msg.senderName}</div>
                                            <div className="message-text">{msg.text}</div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="chat-input-form">
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    maxLength={500}
                                />
                                <button type="submit" className="btn btn-primary btn-small">
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="participants-tab">
                            <div className="participants-header">
                                <h4>Name</h4>
                                {role === 'teacher' && <h4>Action</h4>}
                            </div>
                            <div className="participants-list">
                                {/* Always show teacher at the top */}
                                <div className="participant-item">
                                    <span className="participant-name">{role === 'teacher' ? 'Teacher (You)' : 'Teacher'}</span>
                                </div>

                                {/* Show all joined students */}
                                {students.map((student) => (
                                    <div key={student.socketId} className="participant-item">
                                        <span className="participant-name">{student.name}</span>
                                        {role === 'teacher' && (
                                            <button
                                                className="kick-out-btn"
                                                onClick={() => {
                                                    if (window.confirm(`Kick out ${student.name}?`)) {
                                                        socketService.emit('student:kick', student.socketId);
                                                    }
                                                }}
                                            >
                                                Kick out
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {students.length === 0 && role === 'teacher' && (
                                    <p className="text-gray text-small">No students joined yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ChatPopup;
