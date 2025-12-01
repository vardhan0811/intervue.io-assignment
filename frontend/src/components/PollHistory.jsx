/**
 * Poll History Component
 */

import PollResults from './PollResults';
import './PollHistory.css';

function PollHistory({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="poll-history-empty">
                <p className="text-gray">No poll history available yet.</p>
            </div>
        );
    }

    return (
        <div className="poll-history">
            {history.map((poll, index) => (
                <div key={poll.id} className="history-item">
                    <div className="history-header">
                        <h3>Question {history.length - index}</h3>
                        <span className="text-small text-gray">
                            {new Date(poll.endTime).toLocaleString()}
                        </span>
                    </div>
                    <PollResults results={poll} />
                    <div className="history-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Participants:</span>
                            <span className="stat-value">{poll.participants?.length || 0}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PollHistory;
