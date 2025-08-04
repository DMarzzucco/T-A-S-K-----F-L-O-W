using System;
using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;

namespace TASK_FLOW.NET.User.DTO;

public class PasswordDTO
{
    [SwaggerSchema("Old Password")]
    [SwaggerSchemaExample("Pr@motheus98")]
    public required string Password { get; set; }
}
