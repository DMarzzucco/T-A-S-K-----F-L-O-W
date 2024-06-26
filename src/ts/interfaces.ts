import { MouseEventHandler } from "react";

export interface User {
    id: string;
    username: string,
    fullname: string,
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
    logOut: () => Promise<void>;
    user: string | null | User;
    isAuth: boolean;
    fails: { message: string }[];
    loading: boolean;
}
export interface TaskContextType {
    user?: string | null | User;
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
export interface HeaderLinksProps {
    path: string,
    title: string,
    click?: MouseEventHandler<HTMLAnchorElement>;
};