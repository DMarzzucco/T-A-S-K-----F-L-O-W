using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;

namespace TASK_FLOW.NET.User.DTO;

public class UpdateOwnUserDTO
{
    [SwaggerSchema("Old Password")]
    [SwaggerSchemaExample("Pr@motheus98")]
    public required string Password { get; set; }
    
    [SwaggerSchema("User first name ")]
    [SwaggerSchemaExample("Dario")]
    public string? First_name { get; set; }

    [SwaggerSchema("User last name ")]
    [SwaggerSchemaExample("Marzzucco")]
    public string? Last_name { get; set; }

    [SwaggerSchema("User age ")]
    [SwaggerSchemaExample("27")]
    public string? Age { get; set; }

    [SwaggerSchema("User username ")]
    [SwaggerSchemaExample("DMarzz")]
    public string? Username { get; set; }
}
