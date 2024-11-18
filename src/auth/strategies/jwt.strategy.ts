import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../../users/services/users.service";
import { Request } from "express";
import { PayloadToken } from "../interfaces/auth.interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {

    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.Authentication
            ]),
            secretOrKey: process.env.SECRET_KEY,
            ignoreExpiration: true
        })
    }

    async validate(payload: PayloadToken) {
        if (!payload.sub) throw new UnauthorizedException("Token does not conatin a valid user ")
        const user = await this.userService.findUsersById(payload.sub)
        return {
            idUser: user.id,
            roleUser: user.role
        }
    }
}