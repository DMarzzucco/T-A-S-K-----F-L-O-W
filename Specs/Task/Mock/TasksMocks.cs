
using Specs.Project.Mock;
using TASK_FLOW.NET.Tasks.DTOs;
using TASK_FLOW.NET.Tasks.Enums;
using TASK_FLOW.NET.Tasks.Model;

namespace Specs.Tasks.Mock
{
    public static class TasksMocks
    {
        public static TaskModel TasksModelMosck => new TaskModel
        {
            Id = 1,
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED,
            Project = ProjectMock.ProjectModelMock
        };
        public static CreateTaskDTO CreateTaskDTOMosck = new CreateTaskDTO
        {
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED,
        };
        public static UpdateTaskDTO UpdateTaskDTOMosck = new UpdateTaskDTO
        {
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED,
        };
    }
}
