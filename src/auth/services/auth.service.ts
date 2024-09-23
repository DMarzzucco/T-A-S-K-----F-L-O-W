import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { UsersEntity } from 'src/users/entities/users.entity';
import { PayloadToken, singProps } from '../interfaces/auth.interfaces';


@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService) { }

    public async validateUser(username: string, password: string) {

        const userByUsername = await this.userService.findBy({ key: 'username', value: username })
        const userByEmail = await this.userService.findBy({ key: 'email', value: username })

        const user = userByEmail || userByUsername;
        if (user) {
            const match = await bcrypt.compare(password, user.password)
            if (match) return user
        }
        return null
    }

    public async signJWT({ payload, secret, expire }: singProps) {
        return jwt.sign(payload, secret, { expiresIn: expire })
    }
    public async generateToken(user: UsersEntity): Promise<any> {
        const getUser = await this.userService.findUsersById(user.id);

        const payload: PayloadToken = {
            role: getUser.role,
            sub: getUser.id
        }
        return {
            accessToken: this.signJWT({
                payload,
                secret: process.env.AUTH_KEY || "token_key",
                expire: "1h"
            }),
            user
        }
    }
}
