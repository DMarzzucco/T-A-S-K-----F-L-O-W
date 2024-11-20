import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { mockUser } from '../../constants/mockEnties';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    userService = {
      findBy: jest.fn(),
      findUsersById: jest.fn(),
      updateToken: jest.fn()
    }
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({

      providers: [AuthService, { provide: UsersService, useValue: userService }, { provide: JwtService, useValue: jwtService }]

    }).compile();
    service = module.get<AuthService>(AuthService);
  })

  it("should be defined", () => { expect(service).toBeDefined() })

  describe('Generate Token', () => {
    it('should generate a token for a user', async () => {

      const mockHash = jest.spyOn(bcrypt, "hash").mockImplementation(() => Promise.resolve("hashRefreshToken"));

      (jwtService.sign as jest.Mock).mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const res = { cookie: jest.fn() };

      const result = await service.generateToken(mockUser, res as any)
      expect(result).toEqual({ access_Token: 'accessToken', user: mockUser })
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(mockHash).toHaveBeenCalledTimes(1);

    })
  })

  describe('Validate User', () => {
    it('should return a user if the credential are valid', async () => {
      (userService.findBy as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser("NEst23", "1231123");
      expect(result).toEqual(mockUser);
      expect(userService.findBy).toHaveBeenCalledWith({ key: "username", value: "NEst23" })

    })
    it("should throw UnauthorizedException if password is invalid ", async () => {
      (userService.findBy as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.validateUser('NEst23', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
  })

  describe('verifyRefreshToken', () => {
    it('should return user if refresh token is valid', async () => {
      const mockUser = { id: '1', refreshToken: 'hashedToken' };
      (userService.findUsersById as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.verifyRefreshToken('refreshToken', '1');
      expect(result).toEqual(mockUser);
      expect(userService.findUsersById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const mockUser = { id: '1', refreshToken: 'hashedToken' };
      (userService.findUsersById as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.verifyRefreshToken('invalidToken', '1')).rejects.toThrow(UnauthorizedException);
    });
  });
})

