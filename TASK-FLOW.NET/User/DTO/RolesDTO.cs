using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;
using TASK_FLOW.NET.User.Enums;

namespace TASK_FLOW.NET.User.DTO;

public class RolesDTO
{
    [SwaggerSchema("User Roles")]
    [SwaggerSchemaExample("BASIC")]
    public required ROLES Roles { get; set; }
}
