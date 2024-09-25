import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCES_LEVEL_KEY, PUBLIC_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccesLevelGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler())
    if (isPublic) return true;

    const acces_level = this.reflector.get<number>(ACCES_LEVEL_KEY, context.getHandler())

    const req = context.switchToHttp().getRequest<Request>();
    const { roleUser, idUser } = req

    if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) return true;

    const user = await this.userService.findUsersById(idUser)

    const userExistInProject = user.projectsIncludes.find((project) => project.project.id === req.params.ProjectId);

    if (userExistInProject === undefined) {
      throw new UnauthorizedException('Not belong to the project')
    }
    if (acces_level !== userExistInProject.accessLevel) {
      throw new UnauthorizedException('Not get the level acces for this operation')
    }

    return true;
  }
}
