import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TasksEntity } from '../entities/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectsService } from '../../projects/services/projects.service';
import { TaskDTO, UpdateTaskDTO } from '../dto/task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksEntity)
        private readonly task: Repository<TasksEntity>,
        private readonly project: ProjectsService
    ) { }

    public async create(body: TaskDTO, ProjectId: string): Promise<TasksEntity> {
        const project = await this.project.getById(ProjectId)
        if (project === undefined) {
            throw new NotFoundException('Project not found')
        }
        return await this.task.save({ ...body, project })
    }

    public async get(): Promise<TasksEntity[]> {
        const data = await this.task.find()
        if (data.length === 0) {
            throw new BadRequestException('No data record')
        }
        return data
    }
    public async getById(id: string): Promise<TasksEntity> {
        const task = await this.task
            .createQueryBuilder('task')
            .where({ id })
            .getOne()
        if (!task) {
            throw new NotFoundException(` task ${task} not found`)
        }
        return task
    }
    public async update(body: UpdateTaskDTO, id: string): Promise<UpdateResult> {
        const data: UpdateResult = await this.task.update(id, body)
        if (!data) {
            throw new BadRequestException('Colud not update')
        }
        return data
    }
    public async delete(TaskId: string): Promise<DeleteResult | undefined> {
        const del = await this.task.delete(TaskId)
        if (!del) {
            throw new NotFoundException('Task not found')
        }
        return del
    }
}
