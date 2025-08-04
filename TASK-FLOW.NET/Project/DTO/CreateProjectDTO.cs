using SwaggerSchemaExample.Nuget;
using Swashbuckle.AspNetCore.Annotations;

namespace TASK_FLOW.NET.Project.DTO
{
    public class CreateProjectDTO
    {
        [SwaggerSchema("Project Name")]
        [SwaggerSchemaExample("Next year's projects.")]
        public required string Name { get; set; }

        [SwaggerSchema("Project Description")]
        [SwaggerSchemaExample("Next year's projects include basic tasks for beginners, as well as a review of errors made the previous year.")]
        public required string Description { get; set; }
    }
}
