import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UsersEntity>;
  let userProjectRepository: Repository<UsersProjectsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UsersProjectsEntity),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity))
    userProjectRepository = module.get<Repository<UsersProjectsEntity>>(getRepositoryToken(UsersProjectsEntity))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
