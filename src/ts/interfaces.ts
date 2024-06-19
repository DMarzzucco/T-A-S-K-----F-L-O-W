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
    user: string;
    isAuth: boolean;
    fails: { message: string }[];
}
export interface ErrorResponse { response: { data: string; } }
export interface TitleType { title: string }