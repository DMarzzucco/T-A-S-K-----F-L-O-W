using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;
using TASK_FLOW.NET.Project.DTO;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.User.DTO;
using TASK_FLOW.NET.User.Model;
using TASK_FLOW.NET.UserProject.Enums;

namespace TASK_FLOW.NET.UserProject.Model
{
    public class UserProjectModel
    {
        [SwaggerSchema("UserProject Id")]
        public int Id { get; set; }

        [SwaggerSchema("UserProject Access Level")]
        [SwaggerSchemaExample("OWNER")]
        public required ACCESSLEVEL AccessLevel { get; set; }

        [SwaggerIgnore]
        public int UserId { get; set; }

        [SwaggerSchema("User")]
        [SwaggerSchemaExample("User")]
        public required UsersModel User { get; set; }

        [SwaggerIgnore]
        public int ProjectId { get; set; }

        [SwaggerSchema("Project")]
        [SwaggerSchemaExample("Project")]
        public required ProjectModel Project { get; set; }
    }

    public class PublicUserProjectDTO
    {
        public int Id { get; set; }
        public required ACCESSLEVEL AccessLevel { get; set; }
        public int UserId { get; set; }
        public required SimpleUserDTO User { get; set; }
        public int ProjectId { get; set; }
        public required SimpleProjectIncludeDTObyUp Project { get; set; }
    }

}
