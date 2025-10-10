import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface UserState {
    id: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
    isLoggedIn: boolean;
    bio: string | null;
    profileImage: string | null;
    displayName: string | null;
}

export const initialState: UserState = {
    id: null,
    username: null,
    email: null,
    phone: null,
    isLoggedIn: false,
    bio: null,
    profileImage: null,
    displayName: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) => {
            Object.assign(state, action.payload, { isLoggedIn: true });
        },
        logout: (state) => {
            Object.assign(state, initialState);
        },
        updateProfile: (
            state,
            action: PayloadAction<Partial<Omit<UserState, "id" | "isLoggedIn">>>
        ) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { login, logout, updateProfile } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
