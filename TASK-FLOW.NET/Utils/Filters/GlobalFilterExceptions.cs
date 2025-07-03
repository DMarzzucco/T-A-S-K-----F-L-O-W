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
                BadRequestException => 400,
                ForbiddentExceptions => 403,
                KeyNotFoundException => 404,
                UnauthorizedAccessException => 401,
                ConflictException => 409,
                SecurityTokenExpiredException => 401,
                SecurityTokenSignatureKeyNotFoundException => 401,
                TooManyRequestExceptions =>429,
                _ => 500
            };
            var response = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = statusCode switch
                {
                    400 => context.Exception.Message,
                    403 => context.Exception.Message,
                    404 => context.Exception.Message,
                    401 => context.Exception switch
                    {
                        SecurityTokenExpiredException => "Token has expired",
                        SecurityTokenSignatureKeyNotFoundException => "Invalid Token",
                        _ => context.Exception.Message
                    },
                    409 => context.Exception.Message,
                    429 => context.Exception.Message,
                    _ => context.Exception.Message
                },
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
