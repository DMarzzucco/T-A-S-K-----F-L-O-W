import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { PayloadToken } from '../interfaces/auth.interfaces';
import { UsersEntity } from '../../users/entities/users.entity';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    // console.log("TOKEN REFRESH MIDDLEWARE STARTING")
    const refresh = req.cookies["Refresh"];
    if (!refresh) throw new NotFoundException("Refresh Token not found");

    const expirationDate = Date.now() + (1 * 60 * 1000);

    const decoded = this.jwtService.verify(refresh, { secret: process.env.REFRESH_TOKEN_KEY })
    const user = await this.authService.verifyRefreshToken(refresh, decoded.sub);

    if (Date.now() > expirationDate) {
      await this.authService.generateNewAccessToken(user, res);

    }

    next()
  }
}
