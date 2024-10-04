import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { Repository } from 'typeorm';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import { mockUser, mockUserProject } from '../../constants/mockEnties';
import { UpdateUserDTO } from '../dto/user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let userEntity: Repository<UsersEntity>;
  let usersProjectsEntity: Repository<UsersProjectsEntity>;

  const mockUserEntityRepo = {
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(() => Promise.resolve(mockUser[0])),
    save: jest.fn(() => Promise.resolve(mockUser)),
    update: jest.fn(),
    delete: jest.fn()
  }
  const mockUserProjectEntityRepo = { save: jest.fn() }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUserEntityRepo
        },
        {
          provide: getRepositoryToken(UsersProjectsEntity),
          useValue: mockUserProjectEntityRepo,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService)
    controller = module.get<UsersController>(UsersController)
    userEntity = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity))
    usersProjectsEntity = module.get<Repository<UsersProjectsEntity>>(getRepositoryToken(UsersProjectsEntity))
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it("should throw a ConflictException if user already exists", async () => {
      mockUserEntityRepo.findOne.mockResolvedValue(mockUser)
      await expect(service.createUser(mockUser)).rejects.toThrow(ConflictException)
      expect(mockUserEntityRepo.findOne).toHaveBeenCalledWith({ where: [{ email: mockUser.email }, { username: mockUser.username }] })
    });
    
    it('should create a user ', async () => {
      mockUserEntityRepo.findOne.mockResolvedValueOnce(null)
      mockUserEntityRepo.save.mockResolvedValueOnce(mockUser)

      const result = await service.createUser(mockUser)

      expect(result).toEqual(expect.objectContaining(mockUser))
      expect(mockUserEntityRepo.save).toHaveBeenCalledWith(expect.objectContaining(mockUser))
    })
  })
  describe('realtionProject', () => {
    it('should assing a acces_level to user', async () => {
      mockUserProjectEntityRepo.save.mockResolvedValue(mockUserProject)
      const result = await service.realtionProject(mockUserProject)
      expect(result).toEqual(expect.objectContaining(mockUserProject))
      expect(mockUserProjectEntityRepo.save).toHaveBeenCalledWith(mockUserProject)
    })
  })
  describe('Get All User', () => {
    it('should return an array of users', async () => {
      const user: UsersEntity[] = [mockUser]
      mockUserEntityRepo.find.mockResolvedValue(user)

      const result = await controller.getUser();
      expect(result).toEqual(user);
      expect(mockUserEntityRepo.find).toHaveBeenCalled();
    });
  })
  describe('get User by id', () => {
    it('should return a user', async () => {
      const id: string = mockUser.id

      mockUserEntityRepo.createQueryBuilder.mockReturnThis();
      mockUserEntityRepo.where.mockReturnThis();
      mockUserEntityRepo.getOne.mockResolvedValue(mockUser)

      const user = await service.findUsersById(id)
      expect(user).toEqual(mockUser);
      expect(mockUserEntityRepo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockUserEntityRepo.where).toHaveBeenCalledWith({ id })
      expect(mockUserEntityRepo.getOne).toHaveBeenCalled();
    })
  })
  describe('Update', () => {
    it('shoudl update a user', async () => {
      const id: string = "dkmsd";
      const body: UpdateUserDTO = {
        firstName: "UpdateName",
        lastName: "UpdateLastName"
      }
      const mockUpdateResult = { affected: 1 }
      mockUserEntityRepo.update.mockResolvedValue(mockUpdateResult)

      const result = await service.updateUser(body, id)
      expect(result).toEqual(mockUpdateResult);
      expect(mockUserEntityRepo.update).toHaveBeenCalledWith(id, body)
    })
  })
  describe('Delete', () => {
    it('should delete a user', async () => {
      const id: string = "sdsdas"
      const mockDeleteResult = { affected: 1 }

      mockUserEntityRepo.delete.mockResolvedValue(mockDeleteResult)

      const result = await service.deleteUser(id)

      expect(result).toEqual(mockDeleteResult);
      expect(mockUserEntityRepo.delete).toHaveBeenCalledWith(id)
    })
  })
  describe('findBY', () => {
    it("should find a user by given key and value", async () => {
      const key = 'password';
      const value = mockUser.password;

      mockUserEntityRepo.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      })
      const user = await service.findBy({ key, value })
      expect(user).toEqual(mockUser)
      expect(mockUserEntityRepo.createQueryBuilder).toHaveBeenCalledWith("user")
      expect(mockUserEntityRepo.createQueryBuilder().addSelect).toHaveBeenCalledWith('user.password')
      expect(mockUserEntityRepo.createQueryBuilder().where).toHaveBeenCalledWith({ [key]: value })
      expect(mockUserEntityRepo.createQueryBuilder().getOne).toHaveBeenCalled();
    })
  })
});
