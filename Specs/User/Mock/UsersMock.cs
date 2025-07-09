
using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.UserProject.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace Specs.User.Mocks
{
    public static class UsersMock
    {
        public static UsersModel UserMock => new()
        {
            Id = 4,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
            VerifyEmail = false,
            VerifyCode = "00000",
            Password = "Pr@motheus98",
            Roles = ROLES.ADMIN,
        };
        public static UsersModel UserMockWithOutProject => new()
        {
            Id = 5,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
            VerifyEmail = false,
            VerifyCode = "000000",
            Password = "Pr@motheus98",
            Roles = ROLES.ADMIN,
        };
        public static UsersModel UserHashPassMock => new()
        {
            Id = 4,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
            VerifyEmail = true,
            VerifyCode = "00000",
            Password = "AQAAAAIAAYagAAAAEMS4jLBZxqiCLDbX0FXyV3VoeSnq0FBBpYSVdgpFfHw83cBB33cnzomg736FuySfJg==",
            Roles = ROLES.ADMIN
        };
        public static UsersModel UserWithBasicRolesMock => new()
        {
            Id = 4,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
            VerifyEmail = false,
            VerifyCode = "00000",
            Password = "Pr@motheus98",
            Roles = ROLES.BASIC,
        };
        public static PublicUserDTO PublicUserDTOMOck => new()
        {
            Id = 4,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
        };

        public static CreateUserDTO CreateUserDTOMOck => new()
        {
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
            Password = "Pr@motheus98",
            Roles = ROLES.ADMIN
        };
        public static UpdateUserDTO UpdateUserDTOMOck => new UpdateUserDTO
        {
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
        };
        public static UpdateOwnUserDTO UpdateOwnUserDTOMock => new()
        {
            Password = "Pr@motheus98",
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz"
        };
        public static RolesDTO RolesDTOMock => new() { Roles = ROLES.CREATOR };
        public static NewPasswordDTO NewPasswordDTOMock => new NewPasswordDTO
        {
            OldPassword = "Pr@motheus98",
            NewPassword = "Sr@motheus23"
        };

        public static RecuperationDTO RecuperationDTOMock => new()
        {
            Email = "DMarzz@gmail.com",
            VerifyCode = "00000",
            Password = "Sr@motheus23"
        };
        public static SimpleUserDTO SimpleUserDTOMock => new()
        {
            Id = 4,
            First_name = "Dario",
            Last_name = "Marzzucco",
            Age = "27",
            Username = "DMarzz",
            Email = "DMarzz@gmail.com",
        };
        public static NewEmailDTO NewEmailDTOMock => new()
        {
            Password = "Pr@motheus98",
            NewEmail = "darmarzzuco@outlock.com"
        };
        public static VerifyDTO VerifyDTOMock => new()
        {
            Email = "DMarzz@gmail.com",
            VerifyCode = "00000",
        };

        public static ForgetDTO ForgetDTOMock => new()
        {
            Email = "DMarzz@gmail.com",
        };

        public static PasswordDTO PasswordDTODeletedMock => new()
        {
            Password = "Pr@motheus98",
        };
        public static UsersModel UserMockWithRelations
        {
            get
            {
                var user = new UsersModel
                {
                    Id = 4,
                    First_name = "Dario",
                    Last_name = "Marzzucco",
                    Age = "27",
                    Username = "DMarzz",
                    Email = "DMarzz@gmail.com",
                    VerifyEmail = false,
                    VerifyCode = "00000",
                    Password = "Pr@motheus98",
                    Roles = ROLES.BASIC,
                    ProjectIncludes = new List<UserProjectModel>()
                };

                var project = new ProjectModel
                {
                    Id = 1,
                    Name = "Test Project",
                    Description = "Mocked Project",
                    UsersIncludes = new List<UserProjectModel>()
                };

                var userProject = new UserProjectModel
                {
                    UserId = user.Id,
                    ProjectId = project.Id,
                    AccessLevel = ACCESSLEVEL.DEVELOPER,
                    User = user,
                    Project = project
                };

                user.ProjectIncludes.Add(userProject);
                project.UsersIncludes.Add(userProject);

                return user;
            }
        }

    }
}
