import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STATUS_TASK } from "../../constants/status-task";
import { ProjectDTO } from "../../projects/dto/project.dto";

export class TaskDTO {
    @ApiProperty({ name: "Task Name", example: "Task Number 1" })
    @IsNotEmpty()
    @IsString()
    taskName: string;

    @ApiProperty({ name: "Task Description", example: "This is the first task" })
    @IsNotEmpty()
    @IsString()
    taskDescription: string;

    @ApiProperty({ name: "Status Task", example: "CREATED" })
    @IsNotEmpty()
    @IsEnum(STATUS_TASK)
    status: STATUS_TASK;

    @ApiProperty({ name: "Responsable name", example: "Ozkar Strhazzi" })
    @IsNotEmpty()
    @IsString()
    responsable_name: string;

    @IsOptional()
    project: ProjectDTO;
}

export class UpdateTaskDTO extends PartialType(TaskDTO) {
    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    tasName: string;

    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    taskDescription: string;

    @ApiProperty({required:false})
    @IsOptional()
    @IsEnum(STATUS_TASK)
    status: STATUS_TASK;

    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    responsable_name: string;

    @IsOptional()
    project: ProjectDTO;
}