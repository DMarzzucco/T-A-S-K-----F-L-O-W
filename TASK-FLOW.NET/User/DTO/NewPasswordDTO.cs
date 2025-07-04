using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;

namespace TASK_FLOW.NET.User.DTO;

public class NewPasswordDTO
{
    [SwaggerSchema("Old Password")]
    [SwaggerSchemaExample("Pr@motheus98")]
    public required string OldPassword { get; set; }

    [SwaggerSchema("New Password")]
    [SwaggerSchemaExample("Sr@motheus23")]
    public required string NewPassword { get; set; }
}
