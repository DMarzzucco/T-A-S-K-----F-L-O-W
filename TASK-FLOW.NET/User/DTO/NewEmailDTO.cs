using System;
using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;

namespace TASK_FLOW.NET.User.DTO;

public class NewEmailDTO
{
    [SwaggerSchema("User password to validate credentials")]
    [SwaggerSchemaExample("Pr@motheus98")]
    public required string Password { get; set; }

    [SwaggerSchema("User email")]
    [SwaggerSchemaExample("marzz77_@gmail.com")]
    public string? NewEmail { get; set; }
}
