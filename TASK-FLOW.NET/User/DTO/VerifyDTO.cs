using System;
using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;

namespace TASK_FLOW.NET.User.DTO;

public class VerifyDTO
{
    [SwaggerSchema("User Email")]
    [SwaggerSchemaExample("DMarzz@gmail.com")]
    public required string Email { get; set; }

    [SwaggerSchema ("User Code")]
    [SwaggerSchemaExample("00000")]
    public required string VerifyCode { get; set; }
}
