
using Specs.Project.Mock;
using TASK_FLOW.NET.Tasks.DTOs;
using TASK_FLOW.NET.Tasks.Enums;
using TASK_FLOW.NET.Tasks.Model;
using TASK_FLOW.NET.User.DTO;

namespace Specs.Tasks.Mock
{
    public static class TasksMocks
    {
        public static TaskModel TasksModelMosck => new()
        {
            Id = 1,
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED,
            Project = ProjectMock.ProjectModelMock
        };
        public static CreateTaskDTO CreateTaskDTOMosck => new()
        {
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            Status = STATUSTASK.CREATED,
        };
        public static UpdateTaskDTO UpdateTaskDTOMosck => new()
        {
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED,
        };

        public static SimpleTaskInclude SimpleTaskIncludeMock => new()
        {
            Id = 1,
            Name = "Test Task",
            Descritpion = "This is a Tests Task",
            ResponsibleName = "Dario Marzzucco",
            Status = STATUSTASK.CREATED
        };
    }
}
