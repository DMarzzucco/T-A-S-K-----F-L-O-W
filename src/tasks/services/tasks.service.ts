import { Injectable } from '@nestjs/common';
import { TasksEntity } from '../entities/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from '../../utils/error.manager';
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
        try {
            const project = await this.project.getById(ProjectId)
            if (project === undefined) {
                throw new ErrorManager({ type: "NOT_FOUND", message: "Projet not found" })
            }
            return await this.task.save({
                ...body,
                project
            })
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }

    public async get(): Promise<TasksEntity[]> {
        try {
            return await this.task.find()
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async getById(TaskId: string): Promise<TasksEntity> {
        try {
            return await this.task
                .createQueryBuilder('task')
                .where(TaskId)
                .getOne()
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async update(body: UpdateTaskDTO, TaskId: string): Promise<UpdateResult> {
        try {
            const user = await this.getById(TaskId)
            const data: UpdateResult = await this.task.update(body, user)
            if (!data) {
                throw new ErrorManager({ type: 'BAD_REQUEST', message: "Bad Request" })
            }
            return data
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
    public async delete(TaskId: string): Promise<DeleteResult> {
        try {
            const task = await this.getById(TaskId)
            if (!task) {
                throw new ErrorManager({ type: "NOT_FOUND", message: "Task not found" })
            }
            return await this.task.delete(task)
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
        }
    }
}
