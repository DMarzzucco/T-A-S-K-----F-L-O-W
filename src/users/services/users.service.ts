import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDTO, UserDTO, UserToProjectDTO } from '../dto/user.dto';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userProject: Repository<UsersProjectsEntity>
    ) { }

    public async createUser(body: UserDTO): Promise<UsersEntity> {
        const existKey = await this.userRepository.findOne({
            where: [{ email: body.email }, { username: body.username }]
        })
        if (existKey) {
            throw new ConflictException("this user already exist")
        }
        body.password = await bcrypt.hash(body.password, 10)
        return await this.userRepository.save(body);
    }

    public async findUsers(): Promise<UsersEntity[]> {
        const user: UsersEntity[] = await this.userRepository.find()
        if (user.length === 0) {
            throw new BadRequestException('No data record')
        }
        return user
    }

    public async findUsersById(id: string): Promise<UsersEntity> {
        const user: UsersEntity = await this.userRepository
            .createQueryBuilder('user')
            .where({ id })
            .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
            .leftJoinAndSelect('projectsIncludes.project', 'project')
            .getOne();
        if (!user) {
            throw new NotFoundException(`User ${user} not found`)
        }
        return user
    }

    public async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
        const user: UsersEntity = await this.userRepository.createQueryBuilder("user")
            .addSelect('user.password')
            .where({ [key]: value })
            .getOne()
        return user
    }

    public async updateUser(body: UpdateUserDTO, id: string): Promise<UpdateResult | undefined> {
        const user: UpdateResult = await this.userRepository.update(id, body)
        if (user.affected === 0) {
            throw new NotFoundException('Could not foun the user')
        }
        return user
    }

    public async deleteUser(id: string): Promise<DeleteResult | undefined> {
        const user: DeleteResult = await this.userRepository.delete(id)
        if (user.affected === 0) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    public async realtionProject(body: UserToProjectDTO): Promise<UsersProjectsEntity> {
        return await this.userProject.save(body)
    }
}
