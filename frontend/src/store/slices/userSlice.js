/**
 * User Slice - Redux state for user data
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    role: null, // 'teacher' or 'student'
    name: null,
    socketId: null,
    isKicked: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },
        setKicked: (state, action) => {
            state.isKicked = action.payload;
        },
        resetUser: () => initialState
    }
});

export const { setRole, setName, setSocketId, setKicked, resetUser } = userSlice.actions;
export default userSlice.reducer;
