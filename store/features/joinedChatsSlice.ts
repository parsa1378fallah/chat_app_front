import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Chat {
    id: number;
    chatType: "private" | "group" | "channel";
    name: string;
    lastMessage: string | null;
    lastMessageAt: string | null;
    avatar?: string;
    unread?: number;
    time?: string; // می‌توان برای نمایش ساعت استفاده کرد
}

interface JoinedChatsState {
    chats: Chat[];
}

const initialState: JoinedChatsState = {
    chats: [],
};

const joinedChatsSlice = createSlice({
    name: "joinedChats",
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },

        addChat: (state, action: PayloadAction<Chat>) => {
            // جلوگیری از اضافه شدن چت تکراری
            const exists = state.chats.find(
                (c) => c.id === action.payload.id && c.chatType === action.payload.chatType
            );
            if (!exists) {
                state.chats.unshift(action.payload); // به ابتدای آرایه اضافه شود
            }
        },

        updateChat: (
            state,
            action: PayloadAction<Partial<Chat> & { id: number; chatType: Chat["chatType"] }>
        ) => {
            const index = state.chats.findIndex(
                (c) => c.id === action.payload.id && c.chatType === action.payload.chatType
            );
            if (index !== -1) {
                const updatedChat = {
                    ...state.chats[index],
                    ...action.payload,
                    lastMessage: action.payload.lastMessage ?? state.chats[index].lastMessage,
                    lastMessageAt: action.payload.lastMessageAt ?? state.chats[index].lastMessageAt,
                };

                // حذف از موقعیت فعلی
                state.chats.splice(index, 1);
                // اضافه کردن به ابتدای آرایه
                state.chats.unshift(updatedChat);
            }
        },

        incrementUnread: (
            state,
            action: PayloadAction<{ id: number; chatType: Chat["chatType"]; lastMessage?: string; lastMessageAt?: string }>
        ) => {
            const index = state.chats.findIndex(
                (c) => c.id === action.payload.id && c.chatType === action.payload.chatType
            );
            if (index !== -1) {
                const chat = state.chats[index];
                chat.unread = (chat.unread || 0) + 1;
                chat.lastMessage = action.payload.lastMessage ?? chat.lastMessage;
                chat.lastMessageAt = action.payload.lastMessageAt ?? chat.lastMessageAt;

                // جابجایی به ابتدای آرایه
                state.chats.splice(index, 1);
                state.chats.unshift(chat);
            }
        },

        resetUnread: (state, action: PayloadAction<{ id: number; chatType: Chat["chatType"] }>) => {
            const chat = state.chats.find(
                (c) => c.id === action.payload.id && c.chatType === "https://localhost:5000" + action.payload.chatType
            );
            if (chat) chat.unread = 0;
        },
    },
});

// 🔹 اکشن‌ها
export const { setChats, addChat, updateChat, incrementUnread, resetUnread } = joinedChatsSlice.actions;

// 🔹 سلکتورها
export const selectJoinedChats = (state: RootState) => state.joinedChats.chats;

export default joinedChatsSlice.reducer;
