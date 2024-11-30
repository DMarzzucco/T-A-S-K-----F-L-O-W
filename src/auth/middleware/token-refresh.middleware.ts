import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies["Authentication"]
    if (!token) throw new UnauthorizedException("No access token found.")

    const decoded = this.jwtService.verify(token, { secret: process.env.SECRET_KEY })

    const timeLeft = decoded.exp - Math.floor(Date.now() / 1000);

    if (timeLeft < 1 * 60 * 1000) {
      const user = await this.authService.GetUser(req);
      const result  = await this.authService.generateNewAccessToken(user, res);
      console.log ("New token generated:", result);
      return;
    }

    next()

  }
}
