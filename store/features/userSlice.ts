import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface UserState {
    id: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
    isLoggedIn: boolean;
    bio: string | null
    profileImage: string | null
}

const initialState: UserState = {
    id: null,
    username: null,
    email: null,
    phone: null,
    isLoggedIn: false,
    bio: null,
    profileImage: null

};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{ id: string; username: string; phone: string, bio: string, profileImage: string }>
        ) => {
            Object.assign(state, action.payload, { isLoggedIn: true });
        },
        logout: (state) => {
            Object.assign(state, initialState);
        },
        updateProfile: (
            state,
            action: PayloadAction<{ username?: string; email?: string, profileImage: string }>
        ) => {
            if (action.payload.username) state.username = action.payload.username;
            if (action.payload.email) state.email = action.payload.email;
            if (action.payload.profileImage) state.profileImage = action.payload.profileImage;
        },
    },
});

// 🔹 اکشن‌ها
export const { login, logout, updateProfile } = userSlice.actions;

// 🔹 سلکتورها
export const selectUser = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUsername = (state: RootState) => state.user.username;
export const selectEmail = (state: RootState) => state.user.email;
export const selectPhone = (state: RootState) => state.user.phone;

export default userSlice.reducer;
