import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import {  RolesGuard, AccessLevelGuard, JwtAuthGuard } from '../../auth/guards';
import { AccessLevel, Roles } from '../../auth/decorators';

@ApiTags('ProjectPoint')
@ApiBearerAuth()
@Controller('projects')
@UseGuards( JwtAuthGuard ,RolesGuard, AccessLevelGuard)
export class ProjectsController {
    constructor(private readonly service: ProjectsService) { }

    @Roles('BASIC')
    @AccessLevel('MAINTAINER')
    @Post(':UserId')
    @ApiBody({ type: ProjectDTO })
    @ApiOperation({ summary: "Create a Project - ROLE: >= BASIC - ACCESS_LEVEL >= DEVELOPER " })
    @ApiResponse({ status: 201, description: 'Project Created' })
    @ApiResponse({ status: 400, description: "Bad request" })
    public async createProject(@Body() body: ProjectDTO, @Param('UserId') UserId: string) {
        return await this.service.create(body, UserId)
    }

    @Roles('CREATOR')
    @ApiOperation({ summary: "Get all Project - ROLE: >= BASIC " })
    @ApiResponse({ status: 200, description: 'Array of Project' })
    @ApiResponse({ status: 400, description: "No data record" })
    @Get()
    public async getProjects() {
        return await this.service.get()
    }

    @Roles('BASIC')
    @AccessLevel('OWNER')
    @ApiOperation({ summary: "Get a Project by id - ROLE: >= CREATOR " })
    @ApiResponse({ status: 200, description: 'Project' })
    @ApiResponse({ status: 404, description: "Project not found" })
    @Get(':ProjectId')
    public async getProjectById(@Param('ProjectId') ProjectId: string) {
        return await this.service.getById(ProjectId)
    }

    @AccessLevel('MAINTAINER')
    @Roles('BASIC')
    @ApiBody({ type: UpdateProjectDTO })
    @ApiOperation({ summary: "Edit a Project - ROLE: >= CREATOR - ACCESS_LEVEL >= MAINTAINER " })
    @ApiResponse({ status: 201, description: 'Project edited' })
    @ApiResponse({ status: 404, description: "Not found Project" })
    @Put(':ProjectId')
    public async updateProject(@Body() body: UpdateProjectDTO, @Param("ProjectId") ProjectId: string) {
        return await this.service.update(body, ProjectId)
    }

    @Roles('CREATOR')
    @ApiOperation({ summary: "Delete a Project - ROLE: >= CREATOR " })
    @ApiResponse({ status: 201, description: 'Project deleted' })
    @ApiResponse({ status: 404, description: "Not found Project" })
    @Delete(':ProjectId')
    public async deleteProject(@Param('ProjectId') ProjectId: string) {
        return await this.service.delete(ProjectId)
    }
}
