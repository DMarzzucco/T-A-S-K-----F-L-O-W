using System;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;
using TASK_FLOW.NET.Tasks.Enums;
using TASK_FLOW.NET.Tasks.Model;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.UserProject.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace TASK_FLOW.NET.User.DTO;

public class PublicUserDTO
{
    [SwaggerSchema("User id")]
    public int Id { get; set; }

    [SwaggerSchema("User first name ")]
    [SwaggerSchemaExample("Dario")]
    public required string First_name { get; set; }

    [SwaggerSchema("User last name ")]
    [SwaggerSchemaExample("Marzzucco")]
    public required string Last_name { get; set; }

    [SwaggerSchema("User age ")]
    [SwaggerSchemaExample("27")]
    public required string Age { get; set; }

    [SwaggerSchema("User username ")]
    [SwaggerSchemaExample("DMarzz")]
    public required string Username { get; set; }

    [SwaggerSchema("User Email ")]
    [SwaggerSchemaExample("DMarzz@gmail.com")]
    public required string Email { get; set; }

    [SwaggerIgnore]
    public ICollection<SimpleProjectIncludeDTO> ProjectIncludes { get; set; } = new List<SimpleProjectIncludeDTO>();
}

public class SimpleProjectIncludeDTO
{
    public int RelationId { get; set; }
    public int ProjectId { get; set; }
    public required string ProjectName { get; set; }
    public required string Description { get; set; }
    public ACCESSLEVEL AccessLevel { get; set; }
    public ICollection<SimpleTaskInclude> Tasks { get; set; } = new List<SimpleTaskInclude>();
}

public class SimpleTaskInclude
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Descritpion { get; set; }
    public required STATUSTASK Status { get; set; }
    public required string ResponsibleName { get; set; }
}