import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { AuthGuard, RolesGuard, AccesLevelGuard } from '../../auth/guards';
import { AccessLevel, Roles } from '../../auth/decorators';

@ApiTags('ProjectPoint')
@ApiHeader({
    name: "das_token",
    description: "put the token here",
    required: true
})
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccesLevelGuard)
export class ProjectsController {
    constructor(private readonly service: ProjectsService) { }

    @Roles('CREATOR')
    @Post(':UserId')
    @ApiBody({ type: ProjectDTO })
    @ApiOperation({ summary: "Create a Project - ROLE: >= CREATOR " })
    @ApiResponse({ status: 201, description: 'Project Created' })
    @ApiResponse({ status: 400, description: "Bad request" })
    public async createProject(@Body() body: ProjectDTO, @Param('UserId') UserId: string) {
        return await this.service.create(body, UserId)
    }

    @Roles('CREATOR')
    @ApiOperation({ summary: "Get all Project - ROLE: >= CREATOR " })
    @ApiResponse({ status: 200, description: 'Array of Project' })
    @ApiResponse({ status: 400, description: "No data record" })
    @Get()
    public async getProjects() {
        return await this.service.get()
    }

    @Roles('CREATOR')
    @ApiOperation({ summary: "Get a Project by id - ROLE: >= CREATOR " })
    @ApiResponse({ status: 200, description: 'Project' })
    @ApiResponse({ status: 404, description: "Project not found" })
    @Get(':ProjectId')
    public async getProjectById(@Param('ProjectId') ProjectId: string) {
        return await this.service.getById(ProjectId)
    }

    @AccessLevel('MANTEINER')
    @Roles('CREATOR')
    @ApiBody({ type: UpdateProjectDTO })
    @ApiOperation({ summary: "Edit a Project - ROLE: >= CREATOR - ACCESS_LEVEL >= MANTEINER " })
    @ApiResponse({ status: 201, description: 'Project edited' })
    @ApiResponse({ status: 404, description: "Not found Project" })
    @Put(':ProjectId')
    public async updateProject(@Body() body: UpdateProjectDTO, @Param("ProjectId") ProjectId: string) {
        return await this.service.update(body, ProjectId)
    }

    @AccessLevel('OWNER')
    @Roles('CREATOR')
    @ApiOperation({ summary: "Delete a Project - ROLE: >= CREATOR - ACCESS_LEVEL >= OWNER " })
    @ApiResponse({ status: 201, description: 'Project deleted' })
    @ApiResponse({ status: 404, description: "Not found Project" })
    @Delete(':ProjectId')
    public async deleteProject(@Param('ProjectId') ProjectId: string) {
        return await this.service.delete(ProjectId)
    }
}
