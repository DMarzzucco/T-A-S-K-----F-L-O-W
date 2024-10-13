import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { UsersEntity } from '../../users/entities/users.entity';
import { PayloadToken, singProps } from '../interfaces/auth.interfaces';
import { Response } from 'express';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService) { }

    // USER VALIDATION
    public async validateUser(username: string, password: string) {
        const userByUsername = await this.userService.findBy({ key: 'username', value: username })
        const userByEmail = await this.userService.findBy({ key: 'email', value: username })

        const user = userByEmail || userByUsername;
        if (!user) {
            throw new NotFoundException("Incorrect username/email or non-existent username.")
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new UnauthorizedException("Password or email wrong")
        }
        return user
    }

    // SIGN-JWT
    public async signJWT({ payload, secret, expire }: singProps) {
        return jwt.sign(payload, secret, { expiresIn: expire })
    }

    // GENERATE TOKEN
    public async generateToken(user: UsersEntity, res: Response): Promise<any> {
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
        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            // maxAge: 1000 * 60 * 60 * 24 * 1
            maxAge: 3600000
        })

        return { user }
    }
}
