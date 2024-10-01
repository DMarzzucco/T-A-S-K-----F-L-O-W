import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksEntity } from '../entities/tasks.entity';
import { TasksService } from '../services/tasks.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProject, mockTask } from '../../constants/mockEnties';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsersService } from '../../users/services/users.service';
import { Reflector } from '@nestjs/core';
import { UpdateTaskDTO } from '../dto/task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let taskRepository: Repository<TasksEntity>;
  let projectService: ProjectsService;
  let user: UsersService

  const mockTaskRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProjectService = { getById: jest.fn(), };
  const mockUserService = {}
  const mockReflector = { get: jest.fn() };
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TasksEntity),
          useValue: mockTaskRepository
        },
        {
          provide: ProjectsService,
          useValue: mockProjectService
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ]
    }).overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    projectService = module.get<ProjectsService>(ProjectsService)
    taskRepository = module.get<Repository<TasksEntity>>(getRepositoryToken(TasksEntity))
    user = module.get<UsersService>(UsersService)
    service = module.get<TasksService>(TasksService)
    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create
  describe('Create a Task', () => {
    it('should create and save a task', async () => {
      const projectID = mockProject.id
      const mockTaskEntity = { ...mockTask, project: projectID }
      mockProjectService.getById.mockResolvedValue(projectID)
      mockTaskRepository.save.mockResolvedValue(mockTaskEntity)

      const result = await service.create(mockTask, projectID)

      expect(result).toEqual(mockTaskEntity);
      expect(mockProjectService.getById).toHaveBeenCalledWith(projectID)
      expect(mockTaskRepository.save).toHaveBeenCalledWith({ ...mockTask, project: projectID })
    })
  })
  // Get
  describe('Get Tasks', () => {
    it('should return a array of tasks', async () => {
      const task: TasksEntity[] = [mockTask]
      mockTaskRepository.find.mockResolvedValue(task)

      const result = await controller.GetTasks()

      expect(result).toEqual(task)
      expect(mockTaskRepository.find).toHaveBeenCalled()
    })
  })
  // Get by Id
  describe('Get a task by id', () => {
    it('should return a task by id', async () => {
      const id: string = mockTask.id

      mockTaskRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask)
      })
      const task = await service.getById(id)
      expect(task).toEqual(mockTask)
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith("task")
      expect(mockTaskRepository.createQueryBuilder().where).toHaveBeenCalledWith({ id })
      expect(mockTaskRepository.createQueryBuilder().getOne).toHaveBeenCalled();
    })
  })
  // Update
  describe('Update Task', () => {
    it('should update a task by id', async () => {
      const id: string = mockTask.id
      const body: UpdateTaskDTO = { taskName: "Update Task" }

      const mockUpdate = { affected: 1 }
      mockTaskRepository.update.mockResolvedValue(mockUpdate)

      const result = await service.update(body, id)
      expect(result).toEqual(mockUpdate)
      expect(mockTaskRepository.update).toHaveBeenCalledWith(id, body)

    })
  })
  // Delete
  describe('Delete a Task ', () => {
    it('should delete a task by id', async () => {
      const id: string = mockTask.id
      const mockDelte = { affected: 1 }

      mockTaskRepository.delete.mockResolvedValue(mockDelte)

      const result = await service.delete(id)

      expect(result).toEqual(mockDelte)
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(id)
    })
  })

});
