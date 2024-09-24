import { ROLES } from "src/constants/roles";
import * as jwt from "jsonwebtoken"

export interface PayloadToken {
    sub: string;
    role: ROLES
}

export interface AuthBody {
    username: string;
    password: string;
}
export interface singProps {
    payload: jwt.JwtPayload,
    secret: string;
    expire: number | string
}
export interface AuthTokenResult {
    role: string;
    sub: string;
    iat: number;
    exp: number;
}
export interface IUseToken extends Omit<AuthTokenResult, "iat" | "exp"> {
    isExpire: boolean
}