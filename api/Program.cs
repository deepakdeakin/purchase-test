using Purchase.Api.Mapping;
using Purchase.Api.Models;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/api/property/normalize", (ExternalProperty payload) =>
{
    var normalized = PropertyMapper.NormalizeProperty(payload);
    return Results.Ok(normalized);
});

app.Run();
