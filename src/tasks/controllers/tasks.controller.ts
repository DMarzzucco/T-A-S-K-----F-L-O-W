import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TaskDTO, UpdateTaskDTO } from '../dto/task.dto';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccesLevelGuard } from 'src/auth/guards/acces-level.guard';

import { AccessLevel } from 'src/auth/decorators/acces-level.decorator';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('TaskPoint')
@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard, AccesLevelGuard)
export class TasksController {
    constructor(private readonly service: TasksService) { }

    @AccessLevel('DEVELOPER')
    @ApiParam({ name: "ProjectId" })
    @ApiHeader({ name: 'das_token' })
    @Post(':ProjectId')
    public async CreateTask(@Body() body: TaskDTO, @Param('ProjectId') ProjectId: string) {
        return await this.service.create(body, ProjectId)
    }
    @Get()
    public async GetTasks() {
        return await this.service.get()
    }

    @ApiParam({ name: "TaskId" })
    @ApiHeader({ name: 'das_token' })
    @ApiResponse({ status: 201, description: 'Task Created' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    @Get(':TaskId')
    public async GetTaskById(@Param('TaskId') TaskId: string) {
        return await this.service.getById(TaskId)
    }

    @ApiParam({ name: "TaskId" })
    @Put(':TaskId')
    public async UpdateTask(@Param('TaskId') TaskId: string, @Body() body: UpdateTaskDTO) {
        return await this.service.update(body, TaskId)
    }

    @ApiParam({ name: "TasktId" })
    @Delete(':TaskId')
    public async DeleteTask(@Param('TaskId') TaskId: string) {
        return await this.service.delete(TaskId)
    }
}
