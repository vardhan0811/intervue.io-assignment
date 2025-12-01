/**
 * Kicked Out Screen
 * Shown when teacher removes a student from the session
 */

import './KickedOut.css';

function KickedOut() {
    return (
        <div className="kicked-out-container">
            <div className="kicked-out-content">
                <div className="intervue-badge">
                    <span className="badge-icon">✦</span>
                    Intervue Poll
                </div>

                <h1 className="kicked-out-title">You've been Kicked out !</h1>

                <p className="kicked-out-message">
                    Looks like the teacher had removed you from the poll system. Please Try again sometime.
                </p>
            </div>
        </div>
    );
}

export default KickedOut;
