using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;

namespace TASK_FLOW.NET.User.DTO;

public class PasswordDTO
{
    [SwaggerSchema("Old Password")]
    [SwaggerSchemaExample("Pr@motheus98")]
    public required string Password { get; set; }
}
