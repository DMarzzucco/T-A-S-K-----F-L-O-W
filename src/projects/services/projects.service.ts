import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from '../../constants/roles';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ProjectsService {


    constructor(
        @InjectRepository(ProjectsEntity) private readonly projectEntity: Repository<ProjectsEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userRepository: Repository<UsersProjectsEntity>,
        private readonly user: UsersService

    ) { }

    public async create(body: ProjectDTO, UserId: string): Promise<any> {
        const user = await this.user.findUsersById(UserId)
        if (!user) {
            throw new NotFoundException(`User with id ${UserId} not found`)
        }
        const project = await this.projectEntity.save(body);

        return await this.userRepository.save({
            accessLevel: ACCESS_LEVEL.OWNER,
            user: user,
            project: project
        })
    }
    public async get(): Promise<ProjectsEntity[]> {
        const res = await this.projectEntity.find()
        if (res.length === 0) {
            throw new BadRequestException('Not data record')
        }
        return res
    }
    public async getById(id: string): Promise<ProjectsEntity> {
        const project = await this.projectEntity
            .createQueryBuilder('project')
            .where({ id })
            .leftJoinAndSelect("project.usersIncludes", "usersIncludes")
            .leftJoinAndSelect("usersIncludes.user", "user")
            .leftJoinAndSelect("project.task", "task")
            .getOne()
        if (!project) {
            throw new NotFoundException("Project not found")
        }
        return project
    }
    public async update(body: UpdateProjectDTO, id: string): Promise<UpdateResult | undefined> {
        const project: UpdateResult = await this.projectEntity.update(id, body)
        if (project.affected === 0) {
            throw new NotFoundException('Project not found')
        }
        return project
    }
    public async delete(id: string): Promise<DeleteResult | undefined> {
        const project: DeleteResult = await this.projectEntity.delete(id)
        if (project.affected === 0) {
            throw new NotFoundException('Project not found')
        }
        return project
    }
}
