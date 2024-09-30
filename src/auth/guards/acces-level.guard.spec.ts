import { UsersService } from '../../users/services/users.service';
import { AccesLevelGuard } from './acces-level.guard';
import { Reflector } from '@nestjs/core';

describe('AccesLevelGuard', () => {
  let accesLevelGuard: AccesLevelGuard;
  let user: Partial<UsersService>;
  let reflector: Partial<Reflector>

  beforeEach(() => {
    user = { findUsersById: jest.fn() }
    reflector = { get: jest.fn() }
    accesLevelGuard = new AccesLevelGuard(user as UsersService, reflector as Reflector)
  })
  it('should be defined', () => {
    expect(accesLevelGuard).toBeDefined();
  });
});
