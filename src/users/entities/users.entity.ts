import { BaseEntity } from "../../config/base.entity";
import { ROLES } from "../../constants/roles";
import { IUser } from "../../interfaces/users.interface";
import { Column, Entity, OneToMany } from "typeorm";
import { UsersProjectsEntity } from "./usersProjects.entity";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "users" })
export class UsersEntity extends BaseEntity implements IUser {
    @ApiProperty({ name: "firstName", example: "Ozkar" })
    @Column()
    firstName: string;

    @ApiProperty({ name: "lastName", example: "Strhazzi" })
    @Column()
    lastName: string;

    @ApiProperty({ name: "age", example: "25" })
    @Column()
    age: string;

    @ApiProperty({ name: "email", example: "ozk@gamil.com" })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ name: "username", example: "oskStrzz" })
    @Column({ unique: true })
    username: string;

    @ApiProperty({ name: "password", example: "apple4928" })
    @Exclude()
    @Column()
    password: string;

    @ApiProperty({ name: "role", example: "ADMIN" })
    @Column({ type: 'enum', enum: ROLES })
    role: ROLES;

    @ApiProperty({ name: "refreshToken", required: false })
    @Column({ nullable: true })
    refreshToken?: string;

    @ApiProperty()
    @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.user, { cascade: true })
    projectsIncludes: UsersProjectsEntity[]
}