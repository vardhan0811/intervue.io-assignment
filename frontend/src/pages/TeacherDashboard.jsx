/**
 * Teacher Dashboard
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';
import { setCurrentPoll, setResults } from '../store/slices/pollSlice';
import { setStudents } from '../store/slices/studentsSlice';
import { addMessage, setMessages } from '../store/slices/chatSlice';
import PollCreationForm from '../components/PollCreationForm';
import PollResults from '../components/PollResults';
import ChatPopup from '../components/ChatPopup';
import Timer from '../components/Timer';
import './TeacherDashboard.css';

function TeacherDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { role } = useSelector((state) => state.user);
    const { currentPoll, results, timeRemaining } = useSelector((state) => state.poll);
    const { list: students } = useSelector((state) => state.students);

    useEffect(() => {
        if (role !== 'teacher') {
            navigate('/');
            return;
        }

        // Connect to socket
        socketService.connect();
        socketService.emit('teacher:join');

        // Listen for events
        socketService.on('poll:current', (poll) => {
            if (poll) dispatch(setCurrentPoll(poll));
        });

        socketService.on('poll:new', (poll) => {
            if (poll) dispatch(setCurrentPoll(poll));
        });

        socketService.on('poll:results', (pollResults) => {
            dispatch(setResults(pollResults));
        });

        socketService.on('students:list', (studentsList) => {
            dispatch(setStudents(studentsList));
        });

        socketService.on('chat:history', (messages) => {
            dispatch(setMessages(messages));
        });

        socketService.on('chat:message', (message) => {
            dispatch(addMessage(message));
        });

        socketService.on('error', (error) => {
            console.error('Socket error:', error);
            alert(error.message);
        });

        return () => {
            socketService.removeAllListeners('poll:current');
            socketService.removeAllListeners('poll:new');
            socketService.removeAllListeners('poll:results');
            socketService.removeAllListeners('students:list');
            socketService.removeAllListeners('chat:history');
            socketService.removeAllListeners('chat:message');
            socketService.removeAllListeners('error');
        };
    }, [role, navigate, dispatch]);

    const handleCreatePoll = (pollData) => {
        socketService.emit('poll:create', pollData);
    };

    const handleResetPoll = () => {
        dispatch(setCurrentPoll(null));
        dispatch(setResults(null));
    };

    const canCreateNewPoll = !currentPoll || !currentPoll.isActive;

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-main">
                <div className="dashboard-container">
                    {!currentPoll || canCreateNewPoll ? (
                        <div className="poll-section slide-up">
                            <div className="badge badge-primary mb-md">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
                                    <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                                    <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                Intervue Poll
                            </div>
                            <h1><span className="heading-regular">Let&apos;s</span> <span className="heading-bold">Get Started</span></h1>
                            <p className="subtitle">
                                you&apos;ll have the ability to create and manage polls, ask questions, and monitor your students&apos; responses in real-time.
                            </p>
                            <PollCreationForm onSubmit={handleCreatePoll} />
                        </div>
                    ) : (
                        <div className={`poll-section slide-up ${results ? 'poll-results-view' : ''}`}>
                            <div className="poll-history-header">
                                <button className="btn-view-history" onClick={() => navigate('/teacher/history')}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View Poll history
                                </button>
                            </div>

                            <div className="question-header-row">
                                <h2 className="question-title">Question</h2>
                            </div>

                            <div className="results-container">
                                <div className="results-question-header">
                                    {currentPoll?.question}
                                </div>
                                <div className="options-results-list">
                                    {(results ? results.options : currentPoll.options.map(opt => ({ text: opt, percentage: 0 }))).map((opt, idx, arr) => {
                                        const maxPercentage = Math.max(...arr.map(o => o.percentage));
                                        const isHighest = results && opt.percentage === maxPercentage && maxPercentage > 0;

                                        return (
                                            <div key={idx} className={`option-bar ${isHighest ? 'highlighted' : ''}`}>
                                                {/* Badge - Always on top */}
                                                <div className="results-option-number">{idx + 1}</div>

                                                {/* Base Layer (Black Text) */}
                                                <div className="option-content-base">
                                                    <span className="option-name">{opt.text}</span>
                                                </div>

                                                {/* Progress Mask Layer (Purple BG + White Text) */}
                                                <div
                                                    className="option-progress-mask"
                                                    style={{ width: `${opt.percentage}%` }}
                                                >
                                                    <div className="option-content-overlay">
                                                        <span className="option-name">{opt.text}</span>
                                                    </div>
                                                </div>

                                                {/* Percentage - Always on top right */}
                                                <div className="option-percentage">{opt.percentage}%</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="button-container">
                                <button
                                    className="btn-ask-new"
                                    onClick={handleResetPoll}
                                >
                                    + Ask a new question
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {currentPoll && currentPoll.isActive && <ChatPopup />}
        </div>
    );
}

export default TeacherDashboard;
