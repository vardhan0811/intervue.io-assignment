/**
 * Poll Results Component
 */

import './PollResults.css';

function PollResults({ results, highlightAnswer = null }) {
    if (!results) return null;

    return (
        <div className="poll-results">
            <div className="question-box mb-lg">
                <p className="question-text">{results.question}</p>
            </div>

            <div className="results-list">
                {results.options.map((option) => (
                    <div
                        key={option.index}
                        className={`result-item ${option.isCorrect ? 'correct' : ''} ${highlightAnswer === option.index ? 'highlighted' : ''}`}
                    >
                        <div className="result-header">
                            <div className="result-label">
                                <div className="radio-button">
                                    {highlightAnswer === option.index && <div className="radio-inner" />}
                                </div>
                                <span className="option-text">{option.text}</span>
                            </div>
                            <span className="percentage">{option.percentage}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${option.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PollResults;
