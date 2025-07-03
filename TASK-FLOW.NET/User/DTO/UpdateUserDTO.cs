using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;

namespace TASK_FLOW.NET.User.DTO
{
    public class UpdateUserDTO
    {
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
}
