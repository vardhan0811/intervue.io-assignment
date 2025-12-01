/**
 * Chat Slice - Redux state for chat functionality
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    isOpen: false,
    unreadCount: 0,
    activeTab: 'chat' // 'chat' or 'participants'
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            if (!state.isOpen) {
                state.unreadCount += 1;
            }
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
            if (state.isOpen) {
                state.unreadCount = 0;
            }
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        clearUnread: (state) => {
            state.unreadCount = 0;
        },
        resetChat: () => initialState
    }
});

export const {
    addMessage,
    setMessages,
    toggleChat,
    setActiveTab,
    clearUnread,
    resetChat
} = chatSlice.actions;

export default chatSlice.reducer;
