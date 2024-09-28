import { UsersService } from '../../users/services/users.service';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userSerivece: Partial<UsersService>;
  let reflector: Partial<Reflector>;

  beforeEach(() => {
    userSerivece = { findUsersById: jest.fn() }
    reflector = { get: jest.fn() }
    authGuard = new AuthGuard(userSerivece as UsersService, reflector as Reflector);
  })
  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
