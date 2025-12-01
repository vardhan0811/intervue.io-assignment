/**
 * Socket.io Client Service
 * Manages WebSocket connection and events
 */

import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    /**
     * Connect to Socket.io server
     */
    connect() {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to server:', this.socket.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Emit an event to server
     */
    emit(event, data) {
        if (!this.socket) {
            console.error('Socket not connected');
            return;
        }
        this.socket.emit(event, data);
    }

    /**
     * Listen to an event from server
     */
    on(event, callback) {
        if (!this.socket) {
            console.error('Socket not connected');
            return;
        }
        this.socket.on(event, callback);

        // Store listener for cleanup
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);

        // Remove from stored listeners
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Remove all listeners for an event
     */
    removeAllListeners(event) {
        if (!this.socket) return;
        this.socket.removeAllListeners(event);
        this.listeners.delete(event);
    }

    /**
     * Get socket ID
     */
    getSocketId() {
        return this.socket?.id;
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.socket?.connected || false;
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
