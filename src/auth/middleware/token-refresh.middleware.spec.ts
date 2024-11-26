import { JwtService } from '@nestjs/jwt';
import { TokenRefreshMiddleware } from './token-refresh.middleware';
import { AuthService } from '../services/auth.service';

describe('TokenRefreshMiddleware', () => {
  let tokenRefreshMiddleware: TokenRefreshMiddleware;
  let jwtService: Partial<JwtService>
  let authService:Partial<AuthService>

  beforeEach(() => {
    jwtService = {get:jest.fn()} as Partial <JwtService>;
    authService = {get:jest.fn()} as Partial <AuthService>;

    tokenRefreshMiddleware= new TokenRefreshMiddleware(jwtService as JwtService, authService as AuthService);


  })

  it('should be defined', () => {
    expect(tokenRefreshMiddleware).toBeDefined();
  });
});
