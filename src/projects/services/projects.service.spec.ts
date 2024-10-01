import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/services/users.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectEntity: Repository<ProjectsEntity>
  let userProjectEntity: Repository<UsersProjectsEntity>
  let userService: UsersService

  const mockProject = {
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const mockUserProject = { save: jest.fn() }
  const mockUserService = { findUsersById: jest.fn() }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectsEntity),
          useValue: mockProject
        },
        {
          provide: getRepositoryToken(UsersProjectsEntity),
          useValue: mockUserProject
        },
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService)
    projectEntity = module.get<Repository<ProjectsEntity>>(getRepositoryToken(ProjectsEntity))
    userProjectEntity = module.get<Repository<UsersProjectsEntity>>(getRepositoryToken(UsersProjectsEntity))
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
