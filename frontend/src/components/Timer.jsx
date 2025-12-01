/**
 * Timer Component
 */

import './Timer.css';

function Timer({ timeRemaining }) {
    if (timeRemaining === null || timeRemaining === undefined) return null;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const getTimerClass = () => {
        if (timeRemaining <= 10) return 'timer-danger';
        if (timeRemaining <= 30) return 'timer-warning';
        return '';
    };

    return (
        <div className={`timer ${getTimerClass()}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formattedTime}</span>
        </div>
    );
}

export default Timer;
