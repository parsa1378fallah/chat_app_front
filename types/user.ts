// types/user.ts

// پاسخ لاگین
export interface LoginResponse {
    token: string;
    user: UserProfile;
}

// داده‌های ثبت‌نام
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// پروفایل کاربر
export interface UserProfile {
    id: string;
    name: string;
    email: string;
}
