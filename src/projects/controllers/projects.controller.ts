import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AccesLevelGuard } from '../../auth/guards/acces-level.guard';
import { AccessLevel } from '../../auth/decorators/acces-level.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

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
    @AccessLevel('OWNER')
    @Put(':ProjectId')
    public async updateProject(@Body() body: UpdateProjectDTO, @Param("ProjectId") ProjectId: string) {
        return await this.service.update(body, ProjectId)
    }

    @Delete(':ProjectId')
    public async deleteProject(@Param('ProjectId') ProjectId: string) {
        return await this.service.delete(ProjectId)
    }
}
