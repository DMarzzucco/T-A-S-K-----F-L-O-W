import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { mockUser } from '../../constants/mockEnties';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  const mockUserService = {
    findBy: jest.fn(),
    findUsersById: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Validate User', () => {
    it('should return a user if the credential are valid', async () => {
      const username: string = "NEst23"
      const password: string = "1231123"
      const hashPassword = await bcrypt.hash(password, 10);
      const user = { ...mockUser, password: hashPassword }

      mockUserService.findBy.mockResolvedValue(user)

      const result = await service.validateUser(username, password);

      expect(result).toEqual(user)
      expect(mockUserService.findBy).toHaveBeenCalledWith({ key: 'username', value: mockUser.username })
    })
  })
  describe('Sing JWT', () => {
    it('should sign a JWT token', async () => {
      const payload: jwt.JwtPayload = { role: "user", sub: "1" }
      const secret = "SecretKey";
      const expire = "1h";

      jest.spyOn(jwt, 'sign').mockImplementation(() => 'jwt.token.here')
      const token = await service.signJWT({ payload, secret, expire })

      expect(token).toBe('jwt.token.here');
      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, { expiresIn: expire })
    })
  })
  describe('Generate Token', () => {
    it('should generate a token for a user', async () => {
      const userID = mockUser.id

      mockUserService.findUsersById.mockResolvedValue(mockUser)
      jest.spyOn(service, "signJWT").mockResolvedValue('jwt.token.here');

      const result = await service.generateToken(mockUser)

      expect(result).toEqual({
        accessToken: 'jwt.token.here',
        user: mockUser
      })
      expect(mockUserService.findUsersById).toHaveBeenCalledWith(userID);
      expect(service.signJWT).toHaveBeenCalledWith({
        payload: { role: mockUser.role, sub: mockUser.id },
        secret: expect.any(String),
        expire: "1h"
      })
    })
  })
});
