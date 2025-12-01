/**
 * Main App Component with Routing
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Welcome from './pages/Welcome';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentInterface from './pages/StudentInterface';
import PollHistory from './pages/PollHistory';
import KickedScreen from './components/KickedScreen';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    const { isKicked } = useSelector((state) => state.user);

    if (isKicked) {
        return <KickedScreen />;
    }

    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/teacher" element={
                <ErrorBoundary>
                    <TeacherDashboard />
                </ErrorBoundary>
            } />
            <Route path="/teacher/history" element={<PollHistory />} />
            <Route path="/student" element={<StudentInterface />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
