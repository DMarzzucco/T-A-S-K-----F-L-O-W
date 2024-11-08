import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";
import { Request } from "express";
import { PayloadToken } from "../interfaces/auth.interfaces";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {

    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.Refresh
            ]),
            secretOrKey: process.env.REFRESH_TOKEN_KEY,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: PayloadToken) {
        const user = await this.authService.verifyRefreshToken(req.cookies?.Refresh, payload.sub)
        if (!user) throw new UnauthorizedException()
        return user;
    }
}