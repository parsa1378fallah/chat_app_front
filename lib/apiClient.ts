import axios, { AxiosInstance, AxiosResponse } from "axios";
import https from "https";
import { HttpError } from "./httpError";

export class HttpClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        const agent =
            process.env.NODE_ENV === "development"
                ? new https.Agent({ rejectUnauthorized: false })
                : undefined;

        this.client = axios.create({
            baseURL,
            timeout: 8000,
            headers: { "Content-Type": "application/json" },
            withCredentials: false,
            httpsAgent: agent,
        });

        // Response Interceptor
        this.client.interceptors.response.use(
            (res) => {
                if (typeof window !== "undefined") {
                    const accessToken = res.headers["access-token"];
                    const refreshToken = res.headers["refresh-token"];

                    console.log("📥 Response headers:", {
                        accessToken: accessToken || "MISSING",
                        refreshToken: refreshToken || "MISSING",
                    });

                    if (accessToken) {
                        localStorage.setItem("accessToken", accessToken);
                        console.log("✅ Access Token saved to localStorage");
                    }
                    if (refreshToken) {
                        localStorage.setItem("refreshToken", refreshToken);
                        console.log("✅ Refresh Token saved to localStorage");
                    }
                }
                return res;
            },
            (err) => {
                const status = err.response?.status ?? 500;
                const message =
                    err.response?.data?.message ?? err.message ?? "Unexpected error";
                console.error("🔥 HttpClient Error:", status, message);
                return Promise.reject(new HttpError(status, message, err.response?.data));
            }
        );

        // Request Interceptor
        this.client.interceptors.request.use(
            (config) => {
                if (typeof window !== "undefined") {
                    const accessToken = localStorage.getItem("accessToken");
                    const refreshToken = localStorage.getItem("refreshToken");

                    console.log("📤 Attaching tokens to request:", {
                        accessToken: accessToken ? "Present" : "Missing",
                        refreshToken: refreshToken ? "Present" : "Missing",
                    });

                    if (accessToken) config.headers["access-token"] = accessToken;
                    if (refreshToken) config.headers["refresh-token"] = refreshToken;
                }
                return config;
            },
            (err) => Promise.reject(err)
        );
    }

    private async handle<T>(promise: Promise<AxiosResponse<{ data: T }>>): Promise<T> {
        const res = await promise;
        return res.data.data;
    }

    get<T>(url: string, params?: object) {
        return this.handle<T>(this.client.get(url, { params }));
    }

    post<T>(url: string, body?: object) {
        return this.handle<T>(this.client.post(url, body));
    }

    put<T>(url: string, body?: object) {
        return this.handle<T>(this.client.put(url, body));
    }

    patch<T>(url: string, body?: object) {
        return this.handle<T>(this.client.patch(url, body));
    }

    delete<T>(url: string) {
        return this.handle<T>(this.client.delete(url));
    }
}
