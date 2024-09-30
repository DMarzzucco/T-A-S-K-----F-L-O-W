import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { ErrorManager } from '../../utils/error.manager';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { ACCES_LEVEL } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectsEntity) private readonly project: Repository<ProjectsEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userRepository: Repository<UsersProjectsEntity>,
        private readonly user: UsersService

    ) { }

    public async create(body: ProjectDTO, UserId: string): Promise<any> {
        try {
            const user = await this.user.findUsersById(UserId)
            if (!user){
                throw new ErrorManager({type:"NOT_FOUND", message:"User not found"})
            }
            const project = await this.project.save(body);
            return await this.userRepository.save({
                accessLevel: ACCES_LEVEL.OWNER,
                user: user,
                project: project
            })
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async get(): Promise<ProjectsEntity[]> {
        try {
            const res = await this.project.find()
            if (res.length === 0) {
                throw new ErrorManager({ type: "BAD_REQUEST", message: "Not data record" })
            }
            return res
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async getById(id: string): Promise<ProjectsEntity> {
        try {
            const project = await this.project
                .createQueryBuilder('project')
                .where({ id })
                .leftJoinAndSelect("project.usersInludes", "usersInludes")
                .leftJoinAndSelect("usersInludes.user", "user")
                .getOne()
            if (!project) {
                throw new ErrorManager({ type: "NOT_FOUND", message: "Project not found" })
            }
            return project
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async update(body: UpdateProjectDTO, id: string): Promise<UpdateResult | undefined> {
        try {
            const project: UpdateResult = await this.project.update(id, body)
            if (project.affected === 0) {
                throw new ErrorManager({ type: "BAD_REQUEST", message: "Could not update" })
            }
            return project
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async delete(id: string): Promise<DeleteResult | undefined> {
        try {
            const project: DeleteResult = await this.project.delete(id)
            if (!project) {
                throw new ErrorManager({ type: "NOT_FOUND", message: "Project not found" })
            }
            return project
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

}
