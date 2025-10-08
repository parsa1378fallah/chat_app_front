// lib/apiInstances.ts
import { HttpClient } from "./apiClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:5000/api";

// یک instance برای user API
export const userApi = new HttpClient(`${BASE_URL}/user`);
export const authApi = new HttpClient(`${BASE_URL}/auth`);
export const privteChatApi = new HttpClient(`${BASE_URL}/chat/private`);
export const channelChatApi = new HttpClient(`${BASE_URL}/chat/channel`);

export const groupChatApi = new HttpClient(`${BASE_URL}/chat/group`);

export const searchtApi = new HttpClient(`${BASE_URL}/search`);


