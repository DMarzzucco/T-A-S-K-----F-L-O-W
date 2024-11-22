import { ACCESS_LEVEL, ROLES } from "../constants/roles"
import { ProjectsEntity } from "../projects/entities/projects.entity"
import { UsersEntity } from "../users/entities/users.entity"
import { UsersProjectsEntity } from "../users/entities/usersProjects.entity"
import { TasksEntity } from "../tasks/entities/tasks.entity"
import { STATUS_TASK } from "./status-task"

const mockUserProject: UsersProjectsEntity = {
    id: "up1",
    accessLevel: ACCESS_LEVEL.OWNER,
    user: {} as UsersEntity,
    project: {} as ProjectsEntity,
    createAt: new Date(),
    updateAt: new Date(),
}
const mockProject: ProjectsEntity = {
    id: "up1939341",
    name: "Project One",
    description: "Project One Description",
    usersIncludes: {} as UsersProjectsEntity[],
    task: {} as TasksEntity[],
    createAt: new Date(),
    updateAt: new Date(),
}
const mockUser: UsersEntity = {
    id: "mdsk123mksd",
    firstName: "Nest",
    lastName: "Conf",
    age: "32",
    username: "NEst23",
    email: "Nes@gamil.com",
    password: "1231123",
    role: ROLES.ADMIN,
    projectsIncludes: {} as UsersProjectsEntity[],
    createAt: new Date(),
    updateAt: new Date()
}
const mockTask: TasksEntity = {
    id: "mdsk123mksddsd",
    taskName: "Task 1",
    taskDescription: "Task Description",
    status: STATUS_TASK.CREATED,
    responsible_name: "User",
    project: {} as ProjectsEntity,
    createAt: new Date(),
    updateAt: new Date(),
}

export { mockProject, mockUser, mockUserProject, mockTask }