using TASK_FLOW.NET.Configuration.ConnectionsConfigurations.Extensions;
using TASK_FLOW.NET.Extensions;

var builder = WebApplication.CreateBuilder(args);
//Jwt Configurations
builder.Configuration.AddJsonFile("appsettings.json");
builder.Services.AddServicesBuilderExtensions(builder.Configuration);
//Port Listen
builder.WebHost.ConfigureKestrel(op =>
{
    op.ListenAnyIP(5024, listenOp =>
    {
        listenOp.UseHttps();
        listenOp.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2;
    });
});
//app config
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseApllicationBuilderExtension();
app.ApplyMigration();
app.MapControllers();
app.Run();
