
import { authApi } from "@/lib/apiInstances";
import { LoginResponse, RegisterData } from "@/types/user";

// ورود کاربر
export async function loginService(phone: string, password: string): Promise<LoginResponse> {
    const data = await authApi.post<LoginResponse>("/login", { phone, password });


    return data;

}

// ثبت‌نام کاربر
export async function registerService(payload: RegisterData): Promise<LoginResponse> {
    return await authApi.post<LoginResponse>("/register", payload);
}

// خروج کاربر
export async function logout() {
    // پاک کردن توکن‌ها از localStorage
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}
