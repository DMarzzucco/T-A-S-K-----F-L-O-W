using System;
using System.Threading.RateLimiting;

namespace TASK_FLOW.NET.Auth.Policy;

public static class RateLimitingPolicy
{
    public static IServiceCollection AddRateLimitingPolicyCustom(this IServiceCollection service)
    {
        service.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                });
            });

            // register
            options.AddPolicy("RegisterPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 3,
                    Window = TimeSpan.FromMinutes(10),
                    QueueLimit = 0
                });
            });

            // login
            options.AddPolicy("LoginPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(20),
                    QueueLimit = 0
                });
            });

            // verification account
            options.AddPolicy("VerifyAccountPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(20),
                    QueueLimit = 0
                });
            });

            // Recuperation Account Policy
            options.AddPolicy("RecuperationAccountPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(20),
                    QueueLimit = 0
                });
            });

            //ForgetAccountPolicy
            options.AddPolicy("ForgetAccountPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 4,
                    Window = TimeSpan.FromMinutes(12),
                    QueueLimit = 0
                });
            });

            // Update Email
            options.AddPolicy("UpdateEmailPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 4,
                    Window = TimeSpan.FromMinutes(12),
                    QueueLimit = 0
                });
            });

            // Remove Own Account
            options.AddPolicy("RemoveOwnAccountPolicy", context =>
            {
                var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 4,
                    Window = TimeSpan.FromMinutes(12),
                    QueueLimit = 0
                });
            });

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        return service;
    }
}
