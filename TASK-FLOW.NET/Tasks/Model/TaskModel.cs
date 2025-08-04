using Swashbuckle.AspNetCore.Annotations;
using SwaggerSchemaExample.Nuget;
using TASK_FLOW.NET.Project.Model;
using TASK_FLOW.NET.Tasks.Enums;

namespace TASK_FLOW.NET.Tasks.Model
{
    public class TaskModel
    {
        [SwaggerSchema("Task id")]
        public int Id { get; set; }

        [SwaggerSchema("Task Name")]
        [SwaggerSchemaExample("Change of management policies")]
        public required string Name { get; set; }

        [SwaggerSchema("Task Desciption")]
        [SwaggerSchemaExample("The changes in management policies have to be different from those of last year.")]
        public required string Descritpion { get; set; }

        [SwaggerSchema("Task Status")]
        [SwaggerSchemaExample("CREATED")]
        public required STATUSTASK Status { get; set; }

        [SwaggerIgnore]
        public required string ResponsibleName { get; set; }

        [SwaggerIgnore]
        public int ProjectId { get; set; }

        [SwaggerSchema("Project")]
        [SwaggerSchemaExample("Project")]
        public required ProjectModel Project { get; set; }
    }
}
