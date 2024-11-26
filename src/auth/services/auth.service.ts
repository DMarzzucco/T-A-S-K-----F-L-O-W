import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from "bcrypt"
import { UsersEntity } from '../../users/entities/users.entity';
import { PayloadToken } from '../interfaces/auth.interfaces';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService

    ) { }

    // GENERATE TOKEN
    public async generateToken(user: UsersEntity, res: Response): Promise<any> {
        const payload: PayloadToken = {
            role: user.role,
            sub: user.id
        }
        // const expirationDate = 24 * 60 * 60;
        const expirationDate = 3 * 60;
        const RefreshExpirationDate = 7 * 24 * 60 * 60;

        const access_Token = this.jwtService.sign(payload, {
            secret: process.env.SECRET_KEY,
            expiresIn: `${expirationDate}`
        })
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: `${RefreshExpirationDate}`
        })
        const hashRefreshToken = await bcrypt.hash(refresh_token, 10)
        await this.userService.updateToken(user.id, hashRefreshToken)

        res.cookie("Authentication", access_Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + expirationDate * 1000)
        })
        res.cookie("Refresh", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + RefreshExpirationDate * 1000)
        })

        return { access_Token, user }

    }
 
    // USER VALIDATION
    public async validateUser(username: string, password: string): Promise<UsersEntity> {
        const user = await this.userService.findBy({ key: 'username', value: username })

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Password is wrong")

        return user
    }

    // Refresh Token Validation
    public async verifyRefreshToken(refreshToken: string, id: string): Promise<UsersEntity> {
        const user = await this.userService.findUsersById(id)
        if (!user) throw new UnauthorizedException(" User not found")

        const authenticated = await bcrypt.compare(refreshToken, user.refreshToken)
        if (!authenticated) throw new UnauthorizedException()

        return user;
    }

    // Get profile of user
    public async profile(req: Request): Promise<{ username: string }> {
        const token = req.cookies["Authentication"]
        if (!token) throw new UnauthorizedException("No token found in cookies")

        const decodeToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY })
        const userId = decodeToken.sub

        const user = await this.userService.findUsersById(userId)
        return ({ username: user.username })
    }

    // Logout
    public async LogOut(id: string, res: Response): Promise<any> {
        await this.userService.updateToken(id, null)

        res.cookie("Authentication", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        res.cookie("Refresh", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ message: "Log Out successfully" });
    }
    
    // GenerateNewToken
    public async generateNewAccessToken(user: UsersEntity, res: Response): Promise<any> {
        const payload: PayloadToken = {
            role: user.role,
            sub: user.id
        }
        const expirationDate = 7 * 24 * 60 * 60;

        const access_Token = this.jwtService.sign(payload, {
            secret: process.env.SECRET_KEY,
            expiresIn: `${expirationDate}`
        })
        res.cookie("Authentication", access_Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + expirationDate * 1000)
        })
        return { access_Token, user };
    }
}
