import { AuthTokenResult, IUseToken } from "src/auth/interfaces/auth.interfaces";
import * as jwt from "jsonwebtoken"

export const useToken = (token: string): IUseToken | string => {
    try {
        const decode = jwt.decode(token) as AuthTokenResult

        const currentDate = new Date();
        const expireDate = new Date(decode.exp)

        return {
            sub: decode.sub,
            role: decode.role,
            isExpire: +expireDate <= +currentDate / 1000
        }

    } catch (error) {
        return 'token is invalid'
    }
}