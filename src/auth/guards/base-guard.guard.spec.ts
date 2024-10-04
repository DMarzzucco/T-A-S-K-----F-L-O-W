import { Reflector } from '@nestjs/core';
import { BaseGuardGuard } from './base-guard.guard';

describe('BaseGuardGuard', () => {
  let baseGuard: BaseGuardGuard;
  let reflector: Partial<Reflector>;

  class TestGuard extends BaseGuardGuard {
    canActivate(): boolean {
      return true;
    }
  }
  beforeEach(() => {
    reflector = { get: jest.fn() }
    baseGuard = new TestGuard(reflector as Reflector)
  })
  it('should be defined', () => {
    expect(baseGuard).toBeDefined();
  });
});
