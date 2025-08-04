using System;
using SwaggerSchemaExample.Nuget;
using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.User.DTO;

namespace TASK_FLOW.NET.Project.DTO;

public class PublicProjectDTO
{
    [SwaggerSchema("Project id")]
    public int Id { get; set; }

    [SwaggerSchema("Project Name")]
    [SwaggerSchemaExample("Next year's projects.")]
    public required string Name { get; set; }

    [SwaggerSchema("Project Description")]
    [SwaggerSchemaExample("Next year's projects include basic tasks for beginners, as well as a review of errors made the previous year.")]
    public required string Description { get; set; }

    [SwaggerIgnore]
    public ICollection<SimpleUserDTO> UsersIncludes { get; set; } = new List<SimpleUserDTO>();

    [SwaggerIgnore]
    public ICollection<SimpleTaskInclude> Tasks { get; set; } = new List<SimpleTaskInclude>();

}
public class SimpleUserDTO
{
    public int Id { get; set; }
    public required string First_name { get; set; }
    public required string Last_name { get; set; }
    public required string Age { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}
public class SimpleProjectIncludeDTObyUp
{
    public int Id { get; set; }
    public required string ProjectName { get; set; }
    public required string Description { get; set; }
    public ICollection<SimpleTaskInclude> Tasks { get; set; } = new List<SimpleTaskInclude>();
}
