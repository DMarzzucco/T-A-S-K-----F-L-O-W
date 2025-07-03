using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;

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
