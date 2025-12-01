/**
 * Poll Creation Form Component
 * Redesigned to match exact Figma specifications
 */

import { useState } from 'react';
import './PollCreationForm.css';

function PollCreationForm({ onSubmit }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
    ]);
    const [timeLimit, setTimeLimit] = useState(60);
    const [error, setError] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectToggle = (index, isCorrect) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = isCorrect;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        if (options.length < 4) {
            setOptions([...options, { text: '', isCorrect: false }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        if (options.some(opt => !opt.text.trim())) {
            setError('Please fill in all options');
            return;
        }

        setError('');
        onSubmit({
            question: question.trim(),
            options: options.map(opt => opt.text.trim()),
            correctAnswer: options.findIndex(opt => opt.isCorrect),
            timeLimit
        });

        // Reset form
        setQuestion('');
        setOptions([
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
        ]);
        setTimeLimit(60);
    };

    return (
        <form onSubmit={handleSubmit} className="poll-creation-form">
            {/* Question Input */}
            <div className="form-group">
                <div className="question-header">
                    <label htmlFor="question">Enter your question</label>
                    <div className="time-selector">
                        <select
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                            className="time-dropdown"
                        >
                            <option value={30}>30 seconds</option>
                            <option value={60}>60 seconds</option>
                            <option value={90}>90 seconds</option>
                            <option value={120}>120 seconds</option>
                        </select>
                        <svg width="12" height="8" viewBox="0 0 12 8" className="dropdown-arrow">
                            <path d="M1 1L6 6L11 1" stroke="#7765DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </div>
                </div>
                <div className="question-input-wrapper">
                    <textarea
                        id="question"
                        className="question-input"
                        placeholder="Rahul Bajaj"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
                        maxLength={100}
                    />
                    <div className="char-counter">{question.length}/100</div>
                </div>
            </div>

            {/* Options */}
            <div className="form-group">
                <div className="options-header">
                    <label>Edit Options</label>
                    <label className="correct-label">Is it Correct?</label>
                </div>
                <div className="options-list">
                    {options.map((option, index) => (
                        <div key={index} className="option-row">
                            <div className="option-number">{index + 1}</div>
                            <input
                                type="text"
                                className="option-input"
                                placeholder="Rahul Bajaj"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                maxLength={100}
                            />
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name={`correct-${index}`}
                                        checked={option.isCorrect}
                                        onChange={() => handleCorrectToggle(index, true)}
                                    />
                                    <span className="radio-custom"></span>
                                    <span className="radio-label">Yes</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name={`correct-${index}`}
                                        checked={!option.isCorrect}
                                        onChange={() => handleCorrectToggle(index, false)}
                                    />
                                    <span className="radio-custom"></span>
                                    <span className="radio-label">No</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {options.length < 4 && (
                    <button
                        type="button"
                        className="add-option-btn"
                        onClick={handleAddOption}
                    >
                        + Add More option
                    </button>
                )}
            </div>

            {error && <p className="text-danger text-small mb-md">{error}</p>}

            <button type="submit" className="ask-question-btn">
                Ask Question
            </button>
        </form>
    );
}

export default PollCreationForm;
