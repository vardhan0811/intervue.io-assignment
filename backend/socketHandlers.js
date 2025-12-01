/**
 * Socket.io Event Handlers
 * Manages all real-time communication between server and clients
 */

import PollManager from './pollManager.js';

const pollManager = new PollManager();
const teacherSocket = { id: null }; // Track teacher socket
const chatMessages = []; // Store chat messages

/**
 * Initialize Socket.io handlers
 */
export function initializeSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // ==================== TEACHER EVENTS ====================

        /**
         * Teacher joins the system
         */
        socket.on('teacher:join', () => {
            teacherSocket.id = socket.id;
            socket.join('teacher');
            console.log(`Teacher joined: ${socket.id}`);

            // Send current state
            socket.emit('poll:current', pollManager.getCurrentPoll());
            socket.emit('students:list', pollManager.getStudentsList());
            socket.emit('poll:history', pollManager.getPollHistory());
            socket.emit('chat:history', chatMessages);
        });

        /**
         * Teacher creates a new poll
         */
        socket.on('poll:create', (pollData) => {
            try {
                const poll = pollManager.createPoll(pollData);

                // Notify all clients about new poll
                io.emit('poll:new', {
                    id: poll.id,
                    question: poll.question,
                    options: poll.options.map(opt => opt.text),
                    timeLimit: poll.timeLimit,
                    startTime: poll.startTime,
                    isActive: true
                });

                // Send initial results (0% for all options)
                const initialResults = pollManager.getResults();
                io.emit('poll:results', initialResults);

                // Start timer
                setTimeout(() => {
                    if (pollManager.currentPoll && pollManager.currentPoll.id === poll.id) {
                        handlePollTimeout(io, poll.id);
                    }
                }, poll.timeLimit * 1000);

                console.log(`Poll created: ${poll.question}`);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * Teacher kicks a student
         */
        socket.on('student:kick', (studentSocketId) => {
            try {
                const studentSocket = io.sockets.sockets.get(studentSocketId);
                if (studentSocket) {
                    // Notify student they were kicked
                    studentSocket.emit('student:kicked');

                    // Remove from poll manager
                    pollManager.removeStudent(studentSocketId);

                    // Update all clients
                    io.emit('students:list', pollManager.getStudentsList());
                }
            } catch (error) {
                console.error('Error kicking student:', error);
            }
        });

        /**
         * Teacher removes a student
         */
        socket.on('student:remove', (studentSocketId) => {
            try {
                const studentSocket = io.sockets.sockets.get(studentSocketId);
                if (studentSocket) {
                    // Notify student they were removed
                    studentSocket.emit('student:kicked');

                    // Remove from poll manager
                    pollManager.removeStudent(studentSocketId);

                    // Update all clients
                    io.emit('students:list', pollManager.getStudentsList());

                    // Disconnect student
                    studentSocket.disconnect(true);

                    console.log(`Student removed: ${studentSocketId}`);
                }
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * Teacher requests poll history
         */
        socket.on('poll:history:request', () => {
            socket.emit('poll:history', pollManager.getPollHistory());
        });

        // ==================== STUDENT EVENTS ====================

        /**
         * Student joins with their name
         */
        socket.on('student:join', (name) => {
            try {
                pollManager.addStudent(socket.id, name);
                socket.join('students');

                // Send welcome data
                socket.emit('student:joined', {
                    socketId: socket.id,
                    name
                });

                // Send current poll if exists
                const currentPoll = pollManager.getCurrentPoll();
                if (currentPoll) {
                    socket.emit('poll:new', currentPoll);
                    
                    // If poll is active and has votes, also send current results
                    if (currentPoll.isActive) {
                        const results = pollManager.getResults();
                        if (results && results.totalVotes > 0) {
                            socket.emit('poll:results', results);
                        }
                    }
                }

                // Send chat history
                socket.emit('chat:history', chatMessages);

                // Notify all clients about updated student list
                io.emit('students:list', pollManager.getStudentsList());

                console.log(`Student joined: ${name} (${socket.id})`);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * Student submits an answer
         */
        socket.on('poll:answer', (answerIndex) => {
            try {
                const results = pollManager.submitAnswer(socket.id, answerIndex);

                // Broadcast results to ALL clients in real-time
                io.emit('poll:results', results);

                // Update students list for all clients
                io.emit('students:list', pollManager.getStudentsList());

                // If all students answered, send poll:ended to everyone
                if (pollManager.areAllStudentsAnswered()) {
                    io.emit('poll:ended', { reason: 'all_answered' });
                }

                console.log(`Answer submitted by ${socket.id}: ${answerIndex}`);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // ==================== CHAT EVENTS ====================

        /**
         * Chat message sent
         */
        socket.on('chat:message', (messageData) => {
            const message = {
                id: Date.now(),
                sender: messageData.sender,
                senderName: messageData.senderName,
                text: messageData.text,
                timestamp: Date.now()
            };

            chatMessages.push(message);

            // Broadcast to all clients
            io.emit('chat:message', message);

            console.log(`Chat message from ${message.senderName}: ${message.text}`);
        });

        // ==================== DISCONNECT ====================

        /**
         * Client disconnects
         */
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);

            // If it's a student, remove them
            if (pollManager.hasStudent(socket.id)) {
                pollManager.removeStudent(socket.id);
                io.emit('students:list', pollManager.getStudentsList());
            }

            // If it's the teacher, clear reference
            if (teacherSocket.id === socket.id) {
                teacherSocket.id = null;
            }
        });
    });
}

/**
 * Handle poll timeout
 */
function handlePollTimeout(io, pollId) {
    const currentPoll = pollManager.getCurrentPoll();

    if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
        const results = pollManager.endPoll();

        // Send results to all clients
        io.emit('poll:results', results);
        io.emit('poll:ended', { reason: 'timeout' });

        console.log(`Poll ${pollId} ended due to timeout`);
    }
}

export { pollManager };
