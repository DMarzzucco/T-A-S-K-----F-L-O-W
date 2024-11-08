import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";
import { UsersEntity } from "src/users/entities/users.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {

    constructor(private readonly auhtService: AuthService) {
        super({
            usernameField: "username",
            passwordField: "password"
        })
    }
    async validate(username: string, password: string) {
        const user: UsersEntity = await this.auhtService.validateUser(username, password)
        if (!user) throw new UnauthorizedException("Not Allowed")
            
        return user
    }
}