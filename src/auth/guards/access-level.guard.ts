import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_LEVEL, ROLES } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';
import { BaseGuardGuard } from './base-guard.guard';

@Injectable()
export class AccessLevelGuard extends BaseGuardGuard {

  constructor(
    private readonly userService: UsersService,
    reflector: Reflector,
  ) { super(reflector) }

  async canActivate(
    context: ExecutionContext,
  ) {
    if (this.isPublic(context)) return true;

    const access_level = this.access_level(context)

    const req = this.getRequest(context);
    // 
    const { roleUser, idUser } = req

    if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) return true;

    const user = await this.userService.findUsersById(idUser)

    const userExistInProject = user.projectsIncludes.find((project) => project.project.id === req.params.ProjectId);

    if (userExistInProject === undefined) {
      throw new UnauthorizedException('Not belong to the project')
    }
    if (ACCESS_LEVEL[access_level] > userExistInProject.accessLevel) {
      throw new UnauthorizedException('Not get the level access for this operation')
    }
    return true;
  }
}
