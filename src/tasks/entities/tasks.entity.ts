import { BaseEntity } from "src/config/base.entity";
import { STATUS_TASK } from "src/constants/status-task";
import { ProjectsEntity } from "src/projects/entities/projects.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'task' })
export class TasksEntity extends BaseEntity {
    @Column()
    tasName: string;

    @Column()
    taskDescription: string;

    @Column({ type: 'enum', enum: STATUS_TASK })
    status: STATUS_TASK;

    @Column()
    responsable_name: string;

    @ManyToOne(() => ProjectsEntity, (project) => project.task)
    @JoinColumn({ name: "project_id" })
    project: ProjectsEntity

}