import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccesLevelGuard } from 'src/auth/guards/acces-level.guard';
import { AccessLevel } from 'src/auth/decorators/acces-level.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PublicAcces } from 'src/auth/decorators/public.decorator';

@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccesLevelGuard)
export class ProjectsController {
    constructor(private readonly service: ProjectsService) { }

    @Roles('CREATOR')
    @Post(':UserId')
    public async createProject(@Body() body: ProjectDTO, @Param('UserId') UserId: string) {
        return await this.service.create(body, UserId)
    }

    @Get()
    public async getProjects() {
        return await this.service.get()
    }

    @Get(':ProjectId')
    public async getProjectById(@Param('ProjectId') ProjectId: string) {
        return await this.service.getById(ProjectId)
    }

    // @Roles('ADMIN', 'BASIC')
    @AccessLevel(50)
    @Put(':ProjectId')
    public async updateProject(@Body() body: UpdateProjectDTO, @Param("ProjectId") ProjectId: string) {
        return await this.service.update(body, ProjectId)
    }

    @Delete(':ProjectId')
    public async deleteProject(@Param('ProjectId') ProjectId: string) {
        return await this.service.delete(ProjectId)
    }
}
