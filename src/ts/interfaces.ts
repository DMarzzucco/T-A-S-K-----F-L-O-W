
export interface User {
    username: string,
    email: string,
    password: string;
    response: {
        data: string;
    }
}
export interface AuthProvI {
    children: JSX.Element
}
export interface AuthContextType {
    signUp: (user: User) => Promise<void>;
    signIn: (user: User) => Promise<void>;
    user: string | null | User;
    isAuth: boolean;
    fails: { message: string }[];
}
export interface ErrorResponse { response: { data: string; } }
export interface TitleType { title: string }

export interface ValidationError { message: string; }
export interface ApiErrorResponse {
    errors?: ValidationError[];
    error?: string;
}
export interface ApiError {
    response?: {
        data: ApiErrorResponse;
        status: number;
        statusText: string;
        header: any
        config: any
    }
}