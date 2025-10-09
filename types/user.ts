// types/user.ts

// پاسخ لاگین
export interface LoginResponse {

    id: string;
    phone: string;
    email: string | null;
    bio: string | null;
    profileImage: string | null;
    password: string | null
    username: string | null,
    isLoggedIn: boolean


}

// داده‌های ثبت‌نام
export interface RegisterData {
    email: string;          // ایمیل
    password: string;       // رمز عبور
    phone?: string;         // شماره موبایل (اختیاری)
    username?: string;      // نام کاربری (اختیاری)
}

// پروفایل کاربر
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    phone?: string | null;
    bio?: string | null;
    profileImage?: string | null;
}
