/**
 * Participants List Component
 */

import './ParticipantsList.css';

function ParticipantsList({ students, onRemove, isTeacher }) {
    return (
        <div className="participants-card card">
            <div className="participants-card-header">
                <h3>Participants</h3>
                <span className="badge badge-light">{students.length}</span>
            </div>

            <div className="participants-content">
                {students.length === 0 ? (
                    <p className="text-gray text-small text-center">No students joined yet</p>
                ) : (
                    <div className="students-list">
                        {students.map((student) => (
                            <div key={student.socketId} className="student-item">
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="student-details">
                                        <div className="student-name">{student.name}</div>
                                        <div className="student-status text-small">
                                            {student.hasAnswered ? (
                                                <span className="text-success">✓ Answered</span>
                                            ) : (
                                                <span className="text-gray">Waiting...</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {isTeacher && (
                                    <button
                                        className="btn-remove"
                                        onClick={() => onRemove(student.socketId)}
                                        title="Remove student"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ParticipantsList;
