import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/services/users.service';
import { useToken } from '../../utils/use.token';
import { IUseToken } from '../interfaces/auth.interfaces';
import { BaseGuardGuard } from './base-guard.guard';

@Injectable()
export class AuthGuard extends BaseGuardGuard {

  constructor(
    private readonly userService: UsersService,
    reflector: Reflector
  ) { super(reflector) }

  async canActivate(
    context: ExecutionContext,
  ) {
    if (this.isPublic(context)) return true
    
    const req = this.getRequest(context)

    const token = req.headers['das_token']

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Invalid token key')
    }

    const manageToken: IUseToken | string = useToken(token)

    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken)
    }
    if (manageToken.isExpire) {
      throw new UnauthorizedException('token is expired')
    }
    const { sub } = manageToken;

    const user = await this.userService.findUsersById(sub);

    if (!user) {
      throw new UnauthorizedException('user invalid')
    }
    req.idUser = user.id
    req.roleUser = user.role
    return true;
  }
}
