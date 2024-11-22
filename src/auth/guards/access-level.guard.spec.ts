import { ExecutionContext } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { AccessLevelGuard } from './access-level.guard';
import { Reflector } from '@nestjs/core';

describe('AccessLevelGuard', () => {
  let accessLevelGuard: AccessLevelGuard;
  let user: Partial<UsersService>;
  let reflector: Partial<Reflector>

  beforeEach(() => {
    user = { findUsersById: jest.fn() }
    reflector = { get: jest.fn() } as Partial<Reflector>
    accessLevelGuard = new AccessLevelGuard(user as UsersService, reflector as Reflector)
  })
  it('should be defined', () => {
    expect(accessLevelGuard).toBeDefined();
  });
  it ("should allow access for public routes", async () =>{
    // reflector.get = jest.fn().mockReturnValue(true)
    // const result = await accessLevelGuard.canActivate(createExecutionContext())
  })
  it('should allow access for ADMIN role', async () => {
  });

  it('should allow access for CREATOR role', async () => {
  });

  it('should deny access if user does not belong to the project', async () => {
  });

  it('should deny access if user has insufficient access level', async () => {
  });

  it('should allow access if user has sufficient access level', async () => {
  });

  // function createExecutionContext({roleUser, idUser, params = {}} = {}):ExecutionContext{
  //   return {
  //     switchToHttp: () => ({
  //       getRequest: () => ({
  //         roleUser,
  //         idUser,
  //         params
  //       })
  //     }),
  //     getHandler:() => jest.fn()
  //   } as unknown as ExecutionContext;
  // }
});

