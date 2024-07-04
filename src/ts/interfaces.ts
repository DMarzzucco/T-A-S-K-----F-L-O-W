import { MouseEventHandler } from "react";

export interface User {
    user: {
        _id: string;
        username: string,
        fullname: string,
        email: string,
        password?: string,
    },
    response?: {
        data: string;
    }
}
export interface Task {
    task: {
        _id: string;
        title: string;
        description: string;
    },
    response?: {
        data: string;
    }
}
export interface AuthProvI {
    children: JSX.Element
}
export interface AuthContextType {
    showUsers: () => Promise<void>;
    signUp: (user: User) => Promise<void>;
    signIn: (user: User) => Promise<void>;
    logOut: () => Promise<void>;
    deleteUser: (id: User) => Promise<void>
    user: string | null | User;
    isAuth: boolean;
    fails: { message: string }[];
    loading: boolean;
}
export interface TaskContextType {
    user?: string | null | User;
    task?: string | [] | Task;
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
export interface ButtonProps {
    title: string,
    click?: () => void;
}