using Specs.Project.Mock;
using Specs.User.Mocks;
using TASK_FLOW.NET.UserProject.DTO;
using TASK_FLOW.NET.UserProject.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace Specs.UserProject.Mocks
{
    public static class UserProjectsMocks
    {
        public static UserProjectModel MockUserProject => new UserProjectModel
        {
            Id = 1,
            AccessLevel = ACCESSLEVEL.OWNER,
            Project = ProjectMock.ProjectModelMock,
            User = UsersMock.UserMock
        };

        public static UserProjectDTO CreateUserProjectDTOMOck => new UserProjectDTO
        {
            AccessLevel = ACCESSLEVEL.OWNER,
            ProjectId = 4,
            UserId = 1
        };
        public static UpdateUserProjectDTO UpdateUserProjectDTOMOck => new UpdateUserProjectDTO
        {
            AccessLevel = ACCESSLEVEL.OWNER,
            ProjectId = 4,
            UserId = 1
        };

        public static PublicUserProjectDTO PublicUserProjectDTOMock => new PublicUserProjectDTO
        {
            Id = 1,
            AccessLevel = ACCESSLEVEL.OWNER,
            Project = ProjectMock.SimpleProjectIncludeDTObyUpMock,
            User = UsersMock.SimpleUserDTOMock
        };

    }
}
