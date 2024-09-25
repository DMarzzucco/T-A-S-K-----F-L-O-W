import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STATUS_TASK } from "src/constants/status-task";
import { ProjectDTO } from "src/projects/dto/project.dto";

export class TaskDTO {
    @IsNotEmpty()
    @IsString()
    tasName: string;

    @IsNotEmpty()
    @IsString()
    taskDescription: string;

    @IsNotEmpty()
    @IsEnum(STATUS_TASK)
    status: STATUS_TASK;

    @IsNotEmpty()
    @IsString()
    responsable_name: string;

    @IsOptional()
    project: ProjectDTO;
}

export class UpdateTaskDTO {
    @IsOptional()
    @IsString()
    tasName: string;

    @IsOptional()
    @IsString()
    taskDescription: string;

    @IsOptional()
    @IsEnum(STATUS_TASK)
    status: STATUS_TASK;

    @IsOptional()
    @IsString()
    responsable_name: string;

    @IsOptional()
    project: ProjectDTO;
}