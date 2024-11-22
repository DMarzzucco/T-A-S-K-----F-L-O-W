import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody,  ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { TaskDTO, UpdateTaskDTO } from '../dto/task.dto';
import { RolesGuard, AccessLevelGuard, JwtAuthGuard } from '../../auth/guards';
import { AccessLevel, Roles } from '../../auth/decorators';

@ApiTags('TaskPoint')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard)
export class TasksController {
    constructor(private readonly service: TasksService) { }

    // Create a Task
    @Roles("BASIC")
    @AccessLevel('DEVELOPER')
    @ApiParam({ name: "ProjectId" })
    @ApiBody({ type: TaskDTO })
    @ApiOperation({ summary: "Create a Task - ROLE: >= BASIC - ACCESS_LEVEL: >= DEVELOPER" })
    @ApiResponse({ status: 201, description: "Task Created" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @Post(':ProjectId')
    public async CreateTask(@Body() body: TaskDTO, @Param('ProjectId') ProjectId: string) {
        return await this.service.create(body, ProjectId)
    }

    // Get All Tasks
    @Roles("BASIC")
    @AccessLevel('DEVELOPER')
    @ApiOperation({ summary: "Get all Task - ROLE: >= BASIC - ACCESS_LEVEL: >= DEVELOPER" })
    @ApiResponse({ status: 200, description: "Array of Task" })
    @ApiResponse({ status: 400, description: "No data record" })
    @Get()
    public async GetTasks() {
        return await this.service.get()
    }

    // Get a Task by Id
    @Roles("BASIC")
    @AccessLevel('DEVELOPER')
    @ApiParam({ name: "TaskId" })
    @ApiOperation({ summary: "Get a Task by id - ROLE: >= BASIC - ACCESS_LEVEL: >= DEVELOPER" })
    @ApiResponse({ status: 200, description: 'Task Created' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    @Get(':TaskId')
    public async GetTaskById(@Param('TaskId') TaskId: string) {
        return await this.service.getById(TaskId)
    }

    // Update a Task
    @Roles("BASIC")
    @AccessLevel('DEVELOPER')
    @ApiParam({ name: "TaskId" })
    @ApiBody({ type: UpdateTaskDTO })
    @ApiOperation({ summary: "Edit a Task - ROLE: >= BASIC - ACCESS_LEVEL: >= DEVELOPER" })
    @ApiResponse({ status: 201, description: "Task Updated" })
    @ApiResponse({ status: 404, description: "Task not found" })
    @Put(':TaskId')
    public async UpdateTask(@Param('TaskId') TaskId: string, @Body() body: UpdateTaskDTO) {
        return await this.service.update(body, TaskId)
    }

    // Delete a Task
    @Roles("BASIC")
    @AccessLevel('DEVELOPER')
    @ApiParam({ name: "TaskId" })
    @ApiOperation({ summary: "Delete a Task - ROLE: >= BASIC - ACCESS_LEVEL: >= DEVELOPER" })
    @ApiResponse({ status: 201, description: "Task Deleted" })
    @ApiResponse({ status: 404, description: "Task not found" })
    @Delete(':TaskId')
    public async DeleteTask(@Param('TaskId') TaskId: string) {
        return await this.service.delete(TaskId)
    }
}
