import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from '../../constants/key-decorators';
import { ROLES } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export abstract class BaseGuardGuard implements CanActivate {

  constructor(protected readonly reflector: Reflector) { }

  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean>;
  
  protected isPublic(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
  }
  protected getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>()
  }

}
