/**
 * Kicked Screen Component
 */

import './KickedScreen.css';

function KickedScreen() {
    const handleReload = () => {
        window.location.href = '/';
    };

    return (
        <div className="centered-layout fade-in">
            <div className="kicked-container">
                <div className="badge badge-primary mb-md">
                    <span>📊</span> Intervue Poll
                </div>

                <div className="kicked-icon">🚫</div>

                <h1>You've been Kicked out !</h1>
                <p className="text-gray mb-lg">
                    Looks like the teacher had removed you from the poll system. Please try again sometime.
                </p>

                <button className="btn btn-primary" onClick={handleReload}>
                    Return to Home
                </button>
            </div>
        </div>
    );
}

export default KickedScreen;
