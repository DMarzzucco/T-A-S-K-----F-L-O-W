﻿using Swashbuckle.AspNetCore.Annotations;
using TASK_FLOW.NET.Configuration.Swagger.Attributes;
using TASK_FLOW.NET.User.Enums;
using TASK_FLOW.NET.UserProject.Model;

namespace TASK_FLOW.NET.User.Model
{
    public class UsersModel
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
        public required bool VerifyEmail { get; set; } = false;

        [SwaggerIgnore]
        public required string VerifyCode { get; set; }

        [SwaggerIgnore]
        public DateTime? CodeExpiration { get; set; } = null;

        [SwaggerIgnore]
        public int VerifyAttempts { get; set; } = 0;
        
        [SwaggerIgnore]
        public DateTime? LockedUntil { get; set; } = null;

        [SwaggerSchema("User Password ")]
        [SwaggerSchemaExample("Pr@motheus98")]
        public required string Password { get; set; }

        [SwaggerSchema("User Role ")]
        [SwaggerSchemaExample("ADMIN")]
        public required ROLES Roles { get; set; }

        [SwaggerIgnore]
        public string? RefreshToken { get; set; }

        [SwaggerIgnore]
        public ICollection<UserProjectModel> ProjectIncludes { get; set; } = new List<UserProjectModel>();
    }
}
