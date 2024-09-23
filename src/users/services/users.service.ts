import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDTO, UserDTO, UserToProjectDTO } from '../dto/user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userProject: Repository<UsersProjectsEntity>
    ) {
        // process.env.
    }

    public async createUser(body: UserDTO): Promise<UsersEntity> {
        try {
            body.password = await bcrypt.hash(body.password, 10)
            return await this.userRepository.save(body);
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async findUsers(): Promise<UsersEntity[]> {
        try {
            const user: UsersEntity[] = await this.userRepository.find()
            if (user.length === 0) {
                throw new ErrorManager({ type: "BAD_REQUEST", message: "No data record" })
            }
            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async findUsersById(id: string): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.userRepository
                .createQueryBuilder('user')
                .where({ id })
                .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
                .leftJoinAndSelect('projectsIncludes.project', 'project')
                .getOne();
            if (!user) {
                throw new ErrorManager({ type: "NOT_FOUND", message: "User not found" })
            }
            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
        try {
            const user: UsersEntity = await this.userRepository.createQueryBuilder("user")
                .addSelect('user.password')
                .where({ [key]: value })
                .getOne()
            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async updateUser(body: UpdateUserDTO, id: string): Promise<UpdateResult | undefined> {
        try {
            const user: UpdateResult = await this.userRepository.update(id, body)
            if (user.affected === 0) {
                throw new ErrorManager({ type: "BAD_REQUEST", message: "Could not update" })
            }
            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async deleteUser(id: string): Promise<DeleteResult | undefined> {
        try {
            const user: DeleteResult = await this.userRepository.delete(id)
            if (user.affected === 0) {
                throw new ErrorManager({ type: "BAD_REQUEST", message: "Could not delete" })
            }
            return user
        } catch (error) {
            throw ErrorManager.createSignatureError(error.manager)
        }
    }
    public async realtionProject(body: UserToProjectDTO): Promise<UsersProjectsEntity> {
        try {
            return await this.userProject.save(body)
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
}
