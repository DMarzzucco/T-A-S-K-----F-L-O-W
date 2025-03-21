using Microsoft.AspNetCore.Mvc.Filters;
using TASK_FLOW.NET.Auth.Attributes;
using TASK_FLOW.NET.Auth.Helpers;
using TASK_FLOW.NET.User.Enums;

namespace TASK_FLOW.NET.Auth.Filters
{
    public class RolesValidationFilters : IAuthorizationFilter
    {

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (AllowPublicAccessHelper.hasAllowPublicAccess(context)) return;

            var userRoleString = context.HttpContext.Items["UserRole"]?.ToString();
            if (string.IsNullOrEmpty(userRoleString))
            {
                context.Result = ContentResultHelper.CreateContentResult(StatusCodes.Status403Forbidden, "Empty Rol");
                return;
            }
            if (!Enum.TryParse(userRoleString, out ROLES userRole))
            {
                context.Result = ContentResultHelper.CreateContentResult(StatusCodes.Status403Forbidden, "Invalid Rol");
                return;
            }
            if (userRole == ROLES.ADMIN) return;

            var requiredRol = context.ActionDescriptor.EndpointMetadata.OfType<RolesAttribute>().FirstOrDefault()?.Roles;
           
            if (requiredRol == null || !requiredRol.Any())
            {
                context.Result = ContentResultHelper.CreateContentResult(StatusCodes.Status403Forbidden, "No roles defined");
                return;
            }

            bool isAuth = requiredRol.Any(r => (int)userRole <= (int)r);
            if (!isAuth)
            {
                context.Result = ContentResultHelper.CreateContentResult(StatusCodes.Status403Forbidden, "You are not access");
            }
        }
    }
}
