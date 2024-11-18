import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../constants/key-decorators';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {

  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.get(PUBLIC_KEY, context.getHandler())
    if (isPublic) return true

    const req = context.switchToHttp().getRequest()
    const token = req.cookies?.Authentication

    if (!token) throw new UnauthorizedException("No token Provided")
    try {
      await super.canActivate(context)
      const user = req.user;
      req.idUser = user.idUser
      req.roleUser = user.roleUser

      return true

    } catch (err) {
      throw new UnauthorizedException("Token is invalid ")
    }
  }
}
