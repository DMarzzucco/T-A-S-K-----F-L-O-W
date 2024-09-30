import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksEntity } from '../entities/tasks.entity';
import { TasksService } from '../services/tasks.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockTask } from '../../constants/mockEnties';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let taskRepository: Repository<TasksEntity>;
  let projectService: ProjectsService

  const mockTaskRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockProjectService = { getById: jest.fn(), };
  const mockUserSerivice = { findUsersById: jest.fn() };
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: TasksService,
          useValue: mockTaskRepository

        },
        {
          provide: getRepositoryToken(TasksEntity),
          useValue: {}
        },
        {
          provide: ProjectsService,
          useValue: mockProjectService
        },
        {
          provide: TasksService,
          useValue: mockUserSerivice
        }

      ]
    }).compile();
    projectService = module.get<ProjectsService>(ProjectsService)
    taskRepository = module.get<Repository<TasksEntity>>(TasksEntity)
    service = module.get<TasksService>(TasksService)
    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get All task', () => {
    it('should return an array of tasks', async () => {
      const task: TasksEntity[] = [mockTask]
      mockTaskRepository.find.mockResolvedValue(task)

      const result = await controller.GetTasks();
      expect(result).toEqual(task);
      expect(mockTaskRepository.find).toHaveBeenCalled()
    })
  })
});
