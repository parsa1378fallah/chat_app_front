"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import joinedChatsReducer from "./features/joinedChatsSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        joinedChats: joinedChatsReducer


    },
});

// types برای هوک‌ها
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
