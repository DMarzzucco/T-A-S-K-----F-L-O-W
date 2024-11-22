import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCESS_LEVEL_KEY, ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from '../../constants/key-decorators';
import { ACCESS_LEVEL, ROLES } from '../../constants/roles';


@Injectable()
export abstract class BaseGuardGuard implements CanActivate {

  constructor(protected readonly reflector: Reflector) { }

  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean>;

  protected isPublic(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
  }
  protected roles(context: ExecutionContext): Array<keyof typeof ROLES> {
    return this.reflector.get<Array<keyof typeof ROLES>>(ROLES_KEY, context.getHandler())
  }
  protected access_level(context: ExecutionContext): keyof typeof ACCESS_LEVEL {
    return this.reflector.get<keyof typeof ACCESS_LEVEL>(ACCESS_LEVEL_KEY, context.getHandler())
  }
  protected admin(context: ExecutionContext): string {
    return this.reflector.get<string>(ADMIN_KEY, context.getHandler())
  }
  protected getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>()
  }
}
