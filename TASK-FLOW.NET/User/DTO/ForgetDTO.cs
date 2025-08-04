using System;
using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;

namespace TASK_FLOW.NET.User.DTO;

public class ForgetDTO
{
    [SwaggerSchema("User Email ")]
    [SwaggerSchemaExample("DMarzz@gmail.com")]
    public required string Email { get; set; }
}
