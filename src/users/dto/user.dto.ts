import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { ACCES_LEVEL, ROLES } from "src/constants/roles";
import { UsersEntity } from "../entities/users.entity";
import { ProjectsEntity } from "src/projects/entities/projects.entity";

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    age: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(ROLES)
    role: ROLES;
}
export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    age: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(ROLES)
    role: ROLES;
}
export class UserToProjectDTO{
    @IsNotEmpty()
    @IsUUID()
    user:UsersEntity;

    @IsNotEmpty()
    @IsUUID()
    project: ProjectsEntity;

    @IsNotEmpty()
    @IsEnum(ACCES_LEVEL)
    accessLevel: ACCES_LEVEL;
}