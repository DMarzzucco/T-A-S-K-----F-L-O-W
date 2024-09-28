import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    getUser: jest.fn(() => {
      return [{ id: 1, username: 'testuser', password: 'hashedpassword' }];
    }),}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      // imports: [
      //   TypeOrmModule.forFeature([UsersEntity])
      // ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue:mockUserService
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService)
  });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
  it('should return an array of users', async () => {
    const result = await controller.getUser(); // Asume que tienes un método `findAll` en tu controlador
    expect(result).toEqual([{ id: 1, username: 'testuser', password: 'hashedpassword' }]);
  });
});
