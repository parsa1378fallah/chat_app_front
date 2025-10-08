import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


// types/index.ts

// پاسخ لاگین
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// داده‌های ثبت‌نام
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string
}

// پروفایل کاربر
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}
export interface Message {
  id: number; // شناسه پیام
  senderId: number; // آیدی فرستنده
  chatType: string; // نوع چت (private, group, channel و غیره)
  chatId: number; // آیدی چت مربوطه
  content: string; // محتوای پیام
  messageType: string; // نوع پیام (text, image و غیره)
  createdAt: string; // تاریخ ایجاد پیام (timestamp)
  updatedAt: string; // تاریخ آخرین بروزرسانی
  senderProfileImage: string;
}
export interface ChatResponse {
  chat_id: number;
  chat_type: "private" | "group" | "channel";
  name: string;                // نام چت یا نام گروه/کانال
  created_at: string;
  last_message_id: number | null;
  last_message_content: string | null;
  last_message_time: string | null;
}
export interface SearchChatItem {
  type: "user" | "group" | "channel";
  name: string;
  isMember: boolean;          // مشخص می‌کنه کاربر عضو است یا چت خصوصی وجود دارد
  chatId?: number | null;     // فقط برای کاربران (چت خصوصی)
  userId?: number;            // فقط برای کاربران
  groupId?: number;           // فقط برای گروه‌ها
  channelId?: number;
  chatType: "private" | "channel" | "group"     // فقط برای کانال‌ها
}