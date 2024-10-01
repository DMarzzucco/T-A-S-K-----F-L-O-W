import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { mockUser } from '../../constants/mockEnties';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UsersService;

  const mockService = {
    validateUser: jest.fn(),
    generateToken: jest.fn(),
  }
  const mockUserService = {
    findBy: jest.fn(),
    findUsersById: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService
        },
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ]
    }).compile();
    userService = module.get<UsersService>(UsersService)
    service = module.get<AuthService>(AuthService)
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe('login', () => {
    it('should validate the user and generate a token', async () => {
      const dtoAtuh = { username: "NEst23", password: "1231123" };
      const token = 'jwt.token.here';

      mockService.validateUser.mockResolvedValue(mockUser)
      mockService.generateToken.mockResolvedValue(token)

      const result = await controller.login(dtoAtuh)

      expect(mockService.validateUser).toHaveBeenCalledWith(dtoAtuh.username, dtoAtuh.password)
      expect(mockService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(token);
    })
  })
});
