using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using TASK_FLOW.NET.Utils.Exceptions;

namespace TASK_FLOW.NET.Utils.Filters
{
    public class GlobalFilterExceptions(ILogger<GlobalFilterExceptions> logger) : IExceptionFilter
    {
        private readonly ILogger<GlobalFilterExceptions> _logger = logger;

        public void OnException(ExceptionContext context)
        {

            var statusCode = context.Exception switch
            {
                BadRequestExceptions => 400,
                ForbiddenExceptions => 403,
                KeyNotFoundException => 404,
                UnauthorizedAccessException => 401,
                ConflictExceptions => 409,
                SecurityTokenExpiredException => 401,
                SecurityTokenSignatureKeyNotFoundException => 401,
                TooManyRequestsExceptions =>429,
                _ => 500
            };
            var message = context.Exception switch
            {
                BadRequestExceptions ex => ex.Message,
                UnauthorizedAccessException ex => ex.Message,
                ForbiddenExceptions ex => ex.Message,
                SecurityTokenExpiredException => "Token is expired",
                SecurityTokenSignatureKeyNotFoundException => "Token is invalid",
                KeyNotFoundException ex => ex.Message,
                ConflictExceptions ex => ex.Message,
                TooManyRequestsExceptions ex => ex.Message,
                _ => context.Exception.Message
            };

            var response = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = message, 
                Details = statusCode == 500 ?
                    context.Exception.InnerException?.Message : null
            };
            context.Result = new ObjectResult(response)
            {
                StatusCode = statusCode
            };
            context.ExceptionHandled = true;
        }

        public class ErrorResponse
        {
            public int StatusCode { get; set; }
            public required string Message { get; set; }
            public string? Details { get; set; }
        }
    }
}
