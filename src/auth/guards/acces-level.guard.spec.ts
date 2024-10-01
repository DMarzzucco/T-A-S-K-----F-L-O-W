import { ExecutionContext } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { AccesLevelGuard } from './acces-level.guard';
import { Reflector } from '@nestjs/core';

describe('AccesLevelGuard', () => {
  let accesLevelGuard: AccesLevelGuard;
  let user: Partial<UsersService>;
  let reflector: Partial<Reflector>

  beforeEach(() => {
    user = { findUsersById: jest.fn() }
    reflector = { get: jest.fn() } as Partial<Reflector>
    accesLevelGuard = new AccesLevelGuard(user as UsersService, reflector as Reflector)
  })
  it('should be defined', () => {
    expect(accesLevelGuard).toBeDefined();
  });
  it ("should allow acces for publci routes", async () =>{
    // reflector.get = jest.fn().mockReturnValue(true)
    // const resutl = await accesLevelGuard.canActivate(createExecuetionContext())
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

  // function createExecuetionContext({roleUser, idUser, params = {}} = {}):ExecutionContext{
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

