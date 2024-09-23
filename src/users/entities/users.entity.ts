import { BaseEntity } from "../../config/base.entity";
import { ROLES } from "../../constants/roles";
import { IUser } from "../../interfaces/users.interface";
import { Column, Entity, OneToMany } from "typeorm";
import { UsersProjectsEntity } from "./usersProjects.entity";

@Entity({ name: "users" })
export class UsersEntity extends BaseEntity implements IUser {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ROLES })
    role: ROLES;

    @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.user)
    projectsIncludes:UsersProjectsEntity[]
}