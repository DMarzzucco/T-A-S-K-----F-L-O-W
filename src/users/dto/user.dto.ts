import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { ACCES_LEVEL, ROLES } from "../../constants/roles";
import { UsersEntity } from "../entities/users.entity";
import { ProjectsEntity } from "../../projects/entities/projects.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty({ name: "firstName", example: "Ozkar" })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ name: "lastName", example: "Strhazzi" })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ name: "age", example: "25" })
    @IsNotEmpty()
    @IsString()
    age: string;

    @ApiProperty({ name: "username", example: "oskStrzz" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ name: "email", example: "ozk@gamil.com" })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ name: "password", example: "apple4928" })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ name: "role", example: "ADMIN" })
    @IsNotEmpty()
    @IsEnum(ROLES)
    role: ROLES;
}
export class UpdateUserDTO extends PartialType(UserDTO) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    age?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ROLES)
    role?: ROLES;
}
export class UserToProjectDTO {

    @ApiProperty({name:"user", example:"58a94e82-a87b-485b-bc42-647ec5c62b93"})
    @IsNotEmpty()
    @IsUUID()
    user: UsersEntity;

    @ApiProperty({name:"project", example:"5994dff5-9d66-4642-82cb-eee21b702241"})
    @IsNotEmpty()
    @IsUUID()
    project: ProjectsEntity;

    @ApiProperty({name:"accessLevel", example:"OWNER"})
    @IsNotEmpty()
    @IsEnum(ACCES_LEVEL)
    accessLevel: ACCES_LEVEL;
}