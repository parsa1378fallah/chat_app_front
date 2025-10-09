// services/user.service.ts
import { userApi } from "@/lib/apiInstances";
import { UserProfile } from "@/types/user";
import {
    ChatResponse
} from "@/types"

// دریافت پروفایل کاربر
export async function getProfile(): Promise<UserProfile> {
    return await userApi.post<UserProfile>("/me");
}

// ویرایش پروفایل کاربر
export async function updateProfile(update: Partial<UserProfile>): Promise<UserProfile> {
    return await userApi.put<UserProfile>("/me", update);
}

// حذف پروفایل کاربر
export async function deleteProfile(): Promise<{ message: string }> {
    return await userApi.delete<{ message: string }>("/me");
}

export async function getChats(): Promise<ChatResponse[]> {
    return await userApi.get<ChatResponse[]>("/me/chats");
}
