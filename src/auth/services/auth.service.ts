import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { UsersEntity } from '../../users/entities/users.entity';
import { PayloadToken, singProps } from '../interfaces/auth.interfaces';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService) { }

    public async validateUser(username: string, password: string) {

        const userByUsername = await this.userService.findBy({ key: 'username', value: username })
        const userByEmail = await this.userService.findBy({ key: 'email', value: username })

        const user = userByEmail || userByUsername;
        if (!user) {
            throw new NotFoundException("Incorrect username/email or non-existent username.")
        }
        const match = await bcrypt.compare(password, user.password)
        if (match) return user
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
        const accessToken = await this.signJWT({
            payload,
            secret: process.env.AUTH_KEY || "token_key",
            expire: "1h"
        })
        return { accessToken, user }
    }
}
