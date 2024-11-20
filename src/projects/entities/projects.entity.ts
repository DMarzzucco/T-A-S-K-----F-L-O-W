import { TasksEntity } from "../../tasks/entities/tasks.entity";
import { BaseEntity } from "../../config/base.entity";
import { IProject } from "../../interfaces/projects.interface";
import { UsersProjectsEntity } from "../../users/entities/usersProjects.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "projects" })
export class ProjectsEntity extends BaseEntity implements IProject {
    @ApiProperty({ name: "Project Name", example: "Project 1" })
    @Column()
    name: string;

    @ApiProperty({ name: "Project Description", example: "This is my first project" })
    @Column()
    description: string;

    @ApiProperty()
    @ManyToOne(() => UsersProjectsEntity, (usersProjects) => usersProjects.project, { onDelete: "CASCADE" })
    usersInludes: UsersProjectsEntity[]

    @ApiProperty()
    @OneToMany(() => TasksEntity, (task) => task.project, { cascade: true })
    task: TasksEntity[]
}