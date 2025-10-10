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

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword?: string; // optional
}

// پروفایل کاربر
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  displayName: string | null;
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
  id: number;
  chatType: "private" | "group" | "channel";
  name: string;
  createdAt: string;
  lastMessageId: number | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
}
export interface SearchChatItem {
  chatType: "private" | "group" | "channel";
  id: number;                // شناسه کاربر، گروه یا کانال
  name: string;              // نام کاربر، گروه یا کانال
  chatId: number | null;     // شناسه چت (private chat ممکن است null باشد)
  isMember: boolean;       // فقط برای کانال‌ها
}
export interface otherUserInfo {
  id: number;                  // شناسه کاربر
  username: string;            // نام کاربری
  profileImage: string | null; // عکس پروفایل (ممکن است نداشته باشد)
  displayName: string | null;  // نام نمایشی (ممکن است نداشته باشد)
}
export interface initPrivateChatTypes {
  id: number;             // bigint unsigned -> number
  user1_id: number;       // bigint unsigned -> number
  user2_id: number;       // bigint unsigned -> number
  created_at: string | null; // timestamp -> string
  updated_at: string | null; // timestamp -> string
}
export interface ChannelChatTypes {
  id: number;              // bigint unsigned -> number
  name: string;            // varchar(100) -> string
  description: string | null; // text -> string | null
  created_by: number;      // bigint unsigned -> number
  created_at: string | null;  // timestamp -> string | null
  updated_at: string | null;  // timestamp -> string | null
}

export interface groupChatTypes {
  id: number;              // bigint unsigned -> number
  name: string;            // varchar(100) -> string
  description: string | null; // text -> string | null
  created_by: number;      // bigint unsigned -> number
  created_at: string | null;  // timestamp -> string | null
}
