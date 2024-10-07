import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProjectDTO {
    @ApiProperty({ name: "name", example: "Project 1" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ name: "description", example: "This is my first project" })
    @IsNotEmpty()
    @IsString()
    description: string;
}
export class UpdateProjectDTO extends PartialType(ProjectDTO) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}