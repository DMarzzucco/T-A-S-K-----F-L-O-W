import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from '../services/projects.service';
import { Repository } from 'typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { UsersService } from '../../users/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProject, mockUser } from '../../constants/mockEnties';
import { ACCESS_LEVEL } from '../../constants/roles';
import { UpdateProjectDTO } from '../dto/project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;
  let projectEntity: Repository<ProjectsEntity>
  let userProjectEntity: Repository<UsersProjectsEntity>
  let userService: UsersService

  const mockService = {
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const mockUserProject = { save: jest.fn() }
  const mockUserService = { findUsersById: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectsEntity),
          useValue: mockService
        },
        {
          provide: getRepositoryToken(UsersProjectsEntity),
          useValue: mockUserProject
        },
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ]
    }).compile();

    userService = module.get<UsersService>(UsersService)
    projectEntity = module.get<Repository<ProjectsEntity>>(getRepositoryToken(ProjectsEntity))
    userProjectEntity = module.get<Repository<UsersProjectsEntity>>(getRepositoryToken(UsersProjectsEntity))
    service = module.get<ProjectsService>(ProjectsService);
    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // Create
  describe('Create Project', () => {
    it('should create a project ', async () => {
      const project = {
        accessLevel: ACCESS_LEVEL.OWNER,
        user: mockUser,
        project: mockProject
      }
      const objet = {
        user: mockUser,
        project: mockProject
      }
      mockUserService.findUsersById.mockResolvedValue(mockUser)
      mockService.save.mockResolvedValue(mockProject)
      mockUserProject.save.mockResolvedValue(project)

      const result = await controller.createProject(mockProject, mockUser.id)

      expect(mockUserService.findUsersById).toHaveBeenCalledWith(mockUser.id);
      expect(mockService.save).toHaveBeenCalledWith(mockProject);
      expect(mockUserProject.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(objet));

    })
  })
  // Get
  describe('Get Projects', () => {
    it('should get a array of projects', async () => {
      const project: ProjectsEntity[] = [mockProject]
      mockService.find.mockResolvedValue(project)

      const result = await controller.getProjects()

      expect(result).toEqual(project)
      expect(mockService.find).toHaveBeenCalled()
    })
  })
  // Get by Id
  describe('Get a Project', () => {
    it('should get a project by id', async () => {
      const id: string = mockProject.id

      mockService.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockProject)
      })
      const project = await service.getById(id)

      expect(project).toEqual(mockProject)
      expect(mockService.createQueryBuilder).toHaveBeenCalledWith("project")
      expect(mockService.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith("project.usersIncludes", "usersIncludes")
      expect(mockService.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith("usersIncludes.user", "user")
      expect(mockService.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith("project.task", "task")
      expect(mockService.createQueryBuilder().where).toHaveBeenCalledWith({ id })
      expect(mockService.createQueryBuilder().getOne).toHaveBeenCalled();

    })
  })
  // Update
  describe('Update Project', () => {
    it('should update a project by id', async () => {
      const id: string = mockProject.id;
      const body: UpdateProjectDTO = { description: "change description" }
      const mockUpdate = { affected: 1 }

      mockService.update.mockResolvedValue(mockUpdate)
      const result = await service.update(body, id)

      expect (result).toEqual(mockUpdate)
      expect(mockService.update).toHaveBeenCalledWith(id, body)
    })
  })
  // Delete
  describe('Delete Project', () => {
    it('should delete a project by id', async () => {
      const id: string = mockProject.id;
      const mockDeleteResult = { affected: 1 }

      mockService.delete.mockResolvedValue(mockDeleteResult)

      const result = await service.delete(id)

      expect(result).toEqual(mockDeleteResult)
      expect(mockService.delete).toHaveBeenCalledWith(id)
    })
  })
});
