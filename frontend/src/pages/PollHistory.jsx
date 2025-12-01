/**
 * Poll History Page
 * Shows all previous polls with their results
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import socketService from '../services/socket';
import './PollHistory.css';

function PollHistory() {
    const navigate = useNavigate();
    const [pollHistory, setPollHistory] = useState([]);

    useEffect(() => {
        socketService.connect();

        // Request poll history from server
        socketService.emit('poll:history:request');

        // Listen for poll history response
        socketService.on('poll:history', (history) => {
            const formattedHistory = history.map(poll => ({
                id: poll.id,
                question: poll.question,
                options: poll.options.map(opt => ({
                    text: opt.text,
                    percentage: calculatePercentage(opt.votes, poll.options)
                }))
            }));
            setPollHistory(formattedHistory);
        });

        return () => {
            socketService.removeAllListeners('poll:history');
        };
    }, []);

    const calculatePercentage = (votes, options) => {
        const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
        return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    };

    return (
        <div className="poll-history-page">
            <div className="poll-history-container">
                <h1 className="poll-history-title">
                    <span className="view-text">View</span> <span className="poll-history-bold">Poll History</span>
                </h1>

                {pollHistory.map((poll, pollIndex) => (
                    <div key={poll.id} className="history-poll-section">
                        <h2 className="history-question-number">Question {pollIndex + 1}</h2>
                        <div className="history-results-container">
                            <div className="history-results-question-header">
                                {poll.question}
                            </div>
                            <div className="history-options-results-list">
                                {poll.options.map((opt, idx) => (
                                    <div key={idx} className="history-option-bar">
                                        <div className="history-option-progress-container">
                                            <div
                                                className="history-option-progress-fill"
                                                style={{ width: `${opt.percentage}%` }}
                                            >
                                                <div className="history-results-option-number">{idx + 1}</div>
                                                <div className="history-option-name">{opt.text}</div>
                                            </div>
                                            <div className="history-option-content">
                                                <div className="history-results-option-number">{idx + 1}</div>
                                                <div className="history-option-name">{opt.text}</div>
                                            </div>
                                        </div>
                                        <div className="history-option-percentage">{opt.percentage}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PollHistory;
