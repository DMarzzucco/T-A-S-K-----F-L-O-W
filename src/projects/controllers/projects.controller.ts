import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly service: ProjectsService) { }

    @Post()
    public async createProject(@Body() body: ProjectDTO) {
        return await this.service.create(body)
    }

    @Get()
    public async getProjects() {
        return await this.service.get()
    }

    @Get(':id')
    public async getProjectById(@Param('id') id: string) {
        return await this.service.getById(id)
    }

    @Put(':id')
    public async updateProject(@Body() body: UpdateProjectDTO, @Param("id") id: string) {
        return await this.service.update(body, id)
    }

    @Delete(':id')
    public async deleteProject(@Param('id') id: string) {
        return await this.service.delete(id)
    }
}
