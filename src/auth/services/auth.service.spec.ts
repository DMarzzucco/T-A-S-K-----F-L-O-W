import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { mockUser } from '../../constants/mockEnties';
import { PayloadToken } from '../interfaces/auth.interfaces';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { getMockRes } from "@jest-mock/express";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  const mockUserService = {
    findBy: jest.fn(),
    findUsersById: jest.fn(),
    updateToken: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: "localhost",
        port: 5432,
        username: "user",
        password: "password",
        database: "data_base",
        entities: [__dirname + '/../**/**/*.entity.{ts,js}'],
        migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: true,
        logging: false,
        dropSchema: true,
        namingStrategy: new SnakeNamingStrategy(),
      }), UsersModule, PassportModule, JwtModule.registerAsync({
        useFactory: () => {
          console.log('Valor de SECRET_KEY:', process.env.SECRET_KEY);
          return {
            secret:"this_is_the_key",
            signOptions: { expiresIn: "10h" }
          }
        }
      })],
      providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, { provide: 'DataSource', useValue: {} }],

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

  describe('Generate Token', () => {
    it('should generate a token for a user', async () => {

      const userID = mockUser.id

      const payload: PayloadToken = {
        role: mockUser.role,
        sub: mockUser.id
      }

      const mockJwtService = { sign: jest.fn() };
      mockJwtService.sign.mockReturnValue('jwt.token.here')

      const mockHash = jest.spyOn(bcrypt, "hash").mockImplementation(() => Promise.resolve("hashRefreshToken"));


      const mockUpdateToken = jest.spyOn(userService, "updateToken").mockResolvedValue(undefined);

      const MockRes = getMockRes();
      MockRes.res.cookie = jest.fn();

      mockUserService.findUsersById.mockResolvedValue(mockUser)

      const result = await service.generateToken(mockUser, MockRes.res)

      expect(result).toEqual({
        accessToken: 'jwt.token.here',
        user: mockUser
      })
      expect(mockUserService.findUsersById).toHaveBeenCalledWith(userID);

      expect(payload).toHaveBeenCalledWith(payload, expect.objectContaining({
        secret: expect.any(String),
        expireIn: expect.any(String)
      }));

      expect(mockHash).toHaveBeenNthCalledWith(1, "hashRefreshToken", 10);

      expect(MockRes.res.cookie).toHaveBeenCalledWith("Authentication", "jwt.token.here", expect.any(Object));
      expect(MockRes.res.cookie).toHaveBeenCalledWith("Refresh", "jwt.token.here", expect.any(Object));
    })
  })


});
