/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import pollReducer from './slices/pollSlice';
import chatReducer from './slices/chatSlice';
import studentsReducer from './slices/studentsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        poll: pollReducer,
        chat: chatReducer,
        students: studentsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;
