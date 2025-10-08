// types/api.ts
export interface ApiError {
    status: number;
    message: string;
    details?: any;
}
