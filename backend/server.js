/**
 * Live Polling System - Backend Server
 * Express.js server with Socket.io for real-time polling
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocketHandlers } from './socketHandlers.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
    cors: corsOptions
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// API info endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Live Polling System API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            socket: 'ws://localhost:' + (process.env.PORT || 5000)
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export { io };
