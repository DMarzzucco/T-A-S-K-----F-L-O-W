import { TasksEntity } from "../../tasks/entities/tasks.entity";
import { BaseEntity } from "../../config/base.entity";
import { IProject } from "../../interfaces/projects.interface";
import { UsersProjectsEntity } from "../../users/entities/usersProjects.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "projects" })
export class ProjectsEntity extends BaseEntity implements IProject {
    @Column()
    name: string;
    @Column()
    description: string;

    @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.project)
    usersInludes: UsersProjectsEntity[]

    @OneToMany(() => TasksEntity, (task) => task.project)
    task: TasksEntity[]
}