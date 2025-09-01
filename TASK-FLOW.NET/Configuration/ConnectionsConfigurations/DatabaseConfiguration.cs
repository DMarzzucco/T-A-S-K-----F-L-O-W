using Microsoft.EntityFrameworkCore;
using TASK_FLOW.NET.Configuration.ConnectionsConfigurations.Helper;
using TASK_FLOW.NET.Context;

namespace TASK_FLOW.NET.Configuration.ConnectionsConfigurations
{
    public static class DatabaseConfiguration
    {
        public static IServiceCollection AddDatabaseConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // var connectionString = configuration.GetConnectionString("Connection"); 
            var connectionString = configuration.GetConnectionString("Container");
            // var connectionString = configuration.GetConnectionString("K8s");

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException(nameof(connectionString), "Connection String could not be null or Empty");

            using (var serviceProvider = services.BuildServiceProvider())
            {
                var logger = serviceProvider.GetRequiredService<ILogger<object>>();

                DatabaseHelper.WaitForDatabaseAsync(connectionString, logger).GetAwaiter().GetResult();
            }

            services.AddDbContextPool<AppDBContext>(op =>
            {
                op.UseNpgsql(connectionString, npgsqlOptions => { npgsqlOptions.CommandTimeout(15); });
            });

            return services;
        }
    }
}
