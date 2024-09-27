import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProjectDTO {
    @ApiProperty({ name: "Project Name", example: "Project 1" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ name: "Project Description", example: "This is my first project" })
    @IsNotEmpty()
    @IsString()
    description: string;
}
export class UpdateProjectDTO extends PartialType(ProjectDTO) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string;
}