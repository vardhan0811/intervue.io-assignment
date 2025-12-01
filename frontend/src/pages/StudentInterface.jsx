/**
 * Student Interface
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket';
import { setName, setSocketId, setKicked } from '../store/slices/userSlice';
import { setCurrentPoll, setResults, setHasAnswered, setSelectedAnswer, setTimeRemaining, decrementTime } from '../store/slices/pollSlice';
import { setStudents } from '../store/slices/studentsSlice';
import { addMessage, setMessages } from '../store/slices/chatSlice';
import Timer from '../components/Timer';
import ChatPopup from '../components/ChatPopup';
import KickedOut from '../components/KickedOut';
import './StudentInterface.css';

function StudentInterface() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { role, name: studentName, isKicked } = useSelector((state) => state.user);
    const { currentPoll, results, hasAnswered, selectedAnswer, timeRemaining } = useSelector((state) => state.poll);

    const [nameInput, setNameInput] = useState('');
    const [localSelectedAnswer, setLocalSelectedAnswer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (role !== 'student') {
            navigate('/');
            return;
        }

        socketService.connect();

        socketService.on('student:joined', (data) => {
            dispatch(setSocketId(data.socketId));
        });

        socketService.on('poll:new', (poll) => {
            dispatch(setCurrentPoll(poll));
            dispatch(setHasAnswered(false));
            setLocalSelectedAnswer(null);
        });

        socketService.on('poll:results', (pollResults) => {
            dispatch(setResults(pollResults));
        });

        socketService.on('poll:ended', () => { });

        socketService.on('students:list', (studentsList) => {
            dispatch(setStudents(studentsList));
        });

        socketService.on('chat:history', (messages) => {
            dispatch(setMessages(messages));
        });

        socketService.on('chat:message', (message) => {
            dispatch(addMessage(message));
        });

        socketService.on('student:kicked', () => {
            dispatch(setKicked(true));
        });

        socketService.on('error', (error) => {
            setError(error.message);
        });

        return () => {
            socketService.removeAllListeners('student:joined');
            socketService.removeAllListeners('poll:new');
            socketService.removeAllListeners('poll:results');
            socketService.removeAllListeners('poll:ended');
            socketService.removeAllListeners('students:list');
            socketService.removeAllListeners('chat:history');
            socketService.removeAllListeners('chat:message');
            socketService.removeAllListeners('student:kicked');
            socketService.removeAllListeners('error');
        };
    }, [role, navigate, dispatch]);

    useEffect(() => {
        if (currentPoll && currentPoll.isActive && !hasAnswered && timeRemaining > 0) {
            const timer = setInterval(() => {
                dispatch(decrementTime());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentPoll, hasAnswered, timeRemaining, dispatch]);

    const handleJoin = (e) => {
        e.preventDefault();
        if (!nameInput.trim()) {
            setError('Please enter your name');
            return;
        }
        dispatch(setName(nameInput.trim()));
        socketService.emit('student:join', { name: nameInput.trim() });
    };

    const handleAnswerSelect = (index) => {
        if (hasAnswered || !currentPoll || !currentPoll.isActive) return;
        setLocalSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        if (localSelectedAnswer === null || hasAnswered) return;
        socketService.emit('poll:answer', localSelectedAnswer);
        dispatch(setSelectedAnswer(localSelectedAnswer));
        dispatch(setHasAnswered(true));
    };

    if (isKicked) {
        return <KickedOut />;
    }

    if (!studentName) {
        return (
            <div className="centered-layout fade-in">
                <div className="student-container student-container-centered">
                    <div className="badge badge-primary mb-md">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
                            <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        Intervue Poll
                    </div>
                    <h2 className="text-center"><span className="heading-regular">Let's</span> <span className="heading-bold">Get Started</span></h2>
                    <p className="text-gray mb-lg text-center student-description">
                        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
                    </p>
                    <form onSubmit={handleJoin} className="name-form name-form-centered">
                        <label htmlFor="name">Enter your Name</label>
                        <input
                            type="text"
                            id="name"
                            className={`input ${error ? 'input-error' : ''}`}
                            placeholder="Rahul Saini"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            maxLength={50}
                        />
                        {error && <p className="text-danger text-small mt-sm">{error}</p>}
                        <button type="submit" className="btn btn-primary" disabled={!nameInput.trim()}>Continue</button>
                    </form>
                </div>
            </div>
        );
    }

    if (!currentPoll || !currentPoll.isActive) {
        return (
            <div className="centered-layout fade-in">
                <div className="student-container student-container-centered">
                    <div className="badge badge-primary mb-md">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
                            <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        Intervue Poll
                    </div>
                    <div className="spinner mb-md"></div>
                    <h2 style={{ whiteSpace: 'nowrap' }}>Wait for the teacher to ask questions..</h2>
                </div>
                <ChatPopup />
            </div>
        );
    }

    // Active poll - show question and options
    if (!hasAnswered) {
        return (
            <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '20px' }}>
                <div style={{ width: '100%', maxWidth: 700, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24, color: '#222', margin: 0 }}>Question 1</h2>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 20, color: '#E53E3E', display: 'flex', alignItems: 'center', gap: 6 }}>
                            🕐 {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
                        </span>
                    </div>
                    <div style={{ background: '#3a3a3a', color: '#fff', padding: 16, borderRadius: 8, marginBottom: 24, fontSize: 18, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                        {currentPoll.question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                        {currentPoll.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: 16,
                                    borderRadius: 8,
                                    background: localSelectedAnswer === index ? '#F0E6FF' : '#E8E8E8',
                                    border: localSelectedAnswer === index ? '2px solid #6C5CE7' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: localSelectedAnswer === index ? 'linear-gradient(90deg, #6C5CE7 0%, #5E4DBD 100%)' : '#999',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </div>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 18, color: '#222' }}>{option}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={localSelectedAnswer === null}
                        style={{
                            width: 220,
                            height: 48,
                            borderRadius: 24,
                            background: localSelectedAnswer === null ? '#ccc' : 'linear-gradient(90deg, #6C5CE7 0%, #5E4DBD 100%)',
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                            border: 'none',
                            boxShadow: '0 4px 16px rgba(108,92,231,0.12)',
                            cursor: localSelectedAnswer === null ? 'not-allowed' : 'pointer',
                            fontFamily: 'Inter, sans-serif'
                        }}
                    >
                        Submit
                    </button>
                </div>
                <ChatPopup />
            </div>
        );
    }

    // Results view - show after answering
    const displayOptions = results ? results.options : currentPoll.options.map((text, index) => ({
        text,
        index,
        percentage: 0
    }));

    const maxPercentage = Math.max(...displayOptions.map(opt => opt.percentage || 0));
    const hasMetrics = results !== null && results !== undefined;

    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: 700, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24, color: '#222', margin: 0 }}>Question 1</h2>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 20, color: '#E53E3E', display: 'flex', alignItems: 'center', gap: 6 }}>
                        🕐 {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                </div>
                
                <div style={{ border: '2px solid #AF8FF1', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
                    <div style={{ background: '#3a3a3a', color: '#fff', padding: '12px 16px', fontSize: 18, fontWeight: 600, fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>
                        {currentPoll.question}
                    </div>
                    
                    <div style={{ padding: '16px 12px' }}>
                        {hasMetrics ? (
                            // Show progress bars with metrics
                            displayOptions.map((option) => (
                                <div key={option.index} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
                                    {/* Full background bar */}
                                    <div style={{
                                        flex: 1,
                                        height: 44,
                                        background: '#E8E8E8',
                                        borderRadius: 6,
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Progress fill with badge and text */}
                                        {option.percentage > 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                height: '100%',
                                                width: `${option.percentage}%`,
                                                background: '#6766D5',
                                                borderRadius: 4,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                paddingLeft: 8
                                            }}>
                                                {/* Badge inside the fill */}
                                                <div style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 4,
                                                    background: '#6766D5',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    flexShrink: 0
                                                }}>
                                                    {option.index + 1}
                                                </div>
                                                <span style={{
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontWeight: 500,
                                                    fontSize: 16,
                                                    color: '#fff'
                                                }}>
                                                    {option.text}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Badge and text when no fill or outside fill area */}
                                        <div style={{
                                            position: 'relative',
                                            zIndex: option.percentage > 0 ? 0 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            paddingLeft: 8,
                                            flex: 1
                                        }}>
                                            {option.percentage === 0 && (
                                                <>
                                                    <div style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: 4,
                                                        background: '#6766D5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        flexShrink: 0
                                                    }}>
                                                        {option.index + 1}
                                                    </div>
                                                    <span style={{
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontWeight: 500,
                                                        fontSize: 16,
                                                        color: '#222'
                                                    }}>
                                                        {option.text}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Percentage visible on the right */}
                                        <span style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 600,
                                            fontSize: 16,
                                            color: option.percentage > 50 ? '#fff' : '#222',
                                            marginRight: 12,
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            {option.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Show simple option list without metrics while waiting for results
                            displayOptions.map((option) => (
                                <div key={option.index} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#E8E8E8', borderRadius: 6 }}>
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 4,
                                        background: '#6766D5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        flexShrink: 0
                                    }}>
                                        {option.index + 1}
                                    </div>
                                    <span style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 500,
                                        fontSize: 16,
                                        color: '#222'
                                    }}>
                                        {option.text}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, color: '#222', marginTop: 32, textAlign: 'center' }}>
                    Wait for the teacher to ask a new question..
                </p>
            </div>
            <ChatPopup />
        </div>
    );
}

export default StudentInterface;
