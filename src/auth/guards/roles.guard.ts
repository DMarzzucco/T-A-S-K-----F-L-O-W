import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLES } from '../../constants/roles';
import { BaseGuardGuard } from './base-guard.guard';

@Injectable()
export class RolesGuard extends BaseGuardGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {

    if (this.isPublic(context)) return true;

    const roles = this.roles(context)
    const admin = this.admin(context)
    const req = this.getRequest(context);

    const { roleUser } = req

    if (roleUser === ROLES.ADMIN) return true;

    if (roles === undefined) {
      if (!admin) {
        return true
      } else if (admin && roleUser === admin) {
        return true
      }
      throw new UnauthorizedException('You are not get access')
    }

    const isAuth = roles.some((role) => role === roleUser)

    if (!isAuth) {
      throw new UnauthorizedException('You rol are not authorized')
    }
    return true;
  }
}
