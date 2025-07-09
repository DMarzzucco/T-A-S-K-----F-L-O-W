
using Specs.Tasks.Mock;
using Specs.User.Mocks;
using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.UserProject.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace Specs.Project.Mock
{
    public static class ProjectMock
    {
        public static ProjectModel ProjectModelMock => new()
        {
            Id = 4,
            Name = "Project test",
            Description = "This is a project test"
        };

        public static ProjectModel ProjectModelForTaskMock => new()
        {
            Id = 4,
            Name = "Project test",
            Description = "This is a project test",
            UsersIncludes = new List<UserProjectModel>
            {
                new UserProjectModel
                {
                    Id = 1,
                    AccessLevel = ACCESSLEVEL.OWNER,
                    Project = ProjectModelMock,
                    User = UsersMock.UserMock
                }
            }
        };
        
        public static CreateProjectDTO CreateProjectDTOMock => new()
        {
            Name = "Project test",
            Description = "This is a project test"
        };
        public static UpdateProjectDTO UpdateProjectDTOMock => new()
        {
            Name = "Project test",
            Description = "This is a project test"
        };
        public static PublicProjectDTO PublicProjectDTOMock => new()
        {
            Id = 4,
            Name = "Project test",
            Description = "This is a project test"
        };

        public static SimpleProjectIncludeDTObyUp SimpleProjectIncludeDTObyUpMock => new()
        {
            Id = 4,
            ProjectName = "Project test",
            Description = "This is a project test"
        };
    }
}
