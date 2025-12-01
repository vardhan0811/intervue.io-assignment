/**
 * Welcome Page - Role Selection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/slices/userSlice';
import './Welcome.css';

function Welcome() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleContinue = () => {
        if (!selectedRole) return;

        dispatch(setRole(selectedRole));
        navigate(`/${selectedRole}`);
    };

    return (
        <div className="centered-layout fade-in">
            <div className="welcome-container">
                <div className="badge badge-primary mb-md">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                        {/* Large 4-point star with rounded tips */}
                        <path d="M10 2C10 2 10.5 6 10.5 8.5C10.5 9 11 9.5 11.5 9.5C14 9.5 18 10 18 10C18 10 14 10.5 11.5 10.5C11 10.5 10.5 11 10.5 11.5C10.5 14 10 18 10 18C10 18 9.5 14 9.5 11.5C9.5 11 9 10.5 8.5 10.5C6 10.5 2 10 2 10C2 10 6 9.5 8.5 9.5C9 9.5 9.5 9 9.5 8.5C9.5 6 10 2 10 2Z" />
                        {/* Small plus top right */}
                        <path d="M16 3V5.5M14.75 4.25H17.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Small plus bottom right */}
                        <path d="M17 6V7.5M16.25 6.75H17.75" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    Intervue Poll
                </div>

                <h1 className="text-center">Welcome to the <strong>Live Polling System</strong></h1>
                <p className="text-center text-gray mb-lg">
                    Please select the role that best describes you to begin using the live polling <br /> system
                </p>

                <div className="role-selection">
                    <div
                        className={`role-card card card-interactive ${selectedRole === 'student' ? 'card-selected' : ''}`}
                        onClick={() => setSelectedRole('student')}
                    >
                        <h3>I’m a Student</h3>
                        <p className="text-small text-gray">
                            Lorem Ipsum is simply dummy text of the <br /> printing and typesetting industry
                        </p>
                    </div>

                    <div
                        className={`role-card card card-interactive ${selectedRole === 'teacher' ? 'card-selected' : ''}`}
                        onClick={() => setSelectedRole('teacher')}
                    >
                        <h3>I’m a Teacher</h3>
                        <p className="text-small text-gray">
                            Submit answers and view live poll results in real-time.
                        </p>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleContinue}
                    disabled={!selectedRole}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default Welcome;
