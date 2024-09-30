import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { Repository } from 'typeorm';
import { TasksEntity } from '../entities/tasks.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<TasksEntity>;
  let projectService: ProjectsService

  const mockTaskRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockProjectService = { getById: jest.fn(), };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TasksEntity),
          useValue: mockTaskRepository
        },
        {
          provide: ProjectsService,
          useValue: mockProjectService
        }
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<TasksEntity>>(getRepositoryToken(TasksEntity));
    projectService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
