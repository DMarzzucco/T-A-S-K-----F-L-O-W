import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from '../../constants/key-decorators';
import { ROLES } from '../../constants/roles';
import { BaseGuardGuard } from './base-guard.guard';

@Injectable()
export class RolesGuard extends BaseGuardGuard {
  // constructor(
  //   private readonly reflector: Reflector,
  // ) { }
  canActivate(
    context: ExecutionContext,
    // ): boolean | Promise<boolean> | Observable<boolean> {
  ): boolean | Promise<boolean> {


    // const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
    // if (isPublic) return true;

    if (this.isPublic(context)) return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(ROLES_KEY, context.getHandler())

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler())

    // const req = context.switchToHttp().getRequest<Request>();
    const req = this.getRequest(context);

    // 
    const { roleUser } = req

    if (roleUser === ROLES.ADMIN) return true;

    if (roles === undefined) {
      if (!admin) {
        return true
      } else if (admin && roleUser === admin) {
        return true
      }
      throw new UnauthorizedException('You are not get acces')
    }

    const isAuth = roles.some((role) => role === roleUser)

    if (!isAuth) {
      throw new UnauthorizedException('You are not authorized')
    }
    return true;
  }
}
