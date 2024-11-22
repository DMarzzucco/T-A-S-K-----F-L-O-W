import { BaseEntity } from "../../config/base.entity";
import { STATUS_TASK } from "../../constants/status-task";
import { ProjectsEntity } from "../../projects/entities/projects.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'task' })
export class TasksEntity extends BaseEntity {
    @ApiProperty({ name: "taskName", example: "First Task" })
    @Column()
    taskName: string;

    @ApiProperty({ name: "TaskDescription", example: "This is the first task" })
    @Column()
    taskDescription: string;

    @ApiProperty({ name: "status", example: "CREATED" })
    @Column({ type: 'enum', enum: STATUS_TASK })
    status: STATUS_TASK;

    @ApiProperty({name:"responsible_name", example:"Ozark Strazzi"})
    @Column()
    responsible_name: string;

    @ApiProperty()
    @ManyToOne(() => ProjectsEntity, (project) => project.task, { onDelete: "CASCADE" })
    @JoinColumn({ name: "project_id" })
    project: ProjectsEntity

}