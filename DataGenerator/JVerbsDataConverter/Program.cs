using JVerbsDataConverter;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/convert-verb", (InputData input) =>
{
    var error = VerbConverter.ValidateInputData(input);
    if (!string.IsNullOrEmpty(error))
        return Results.BadRequest($"Error: {error.Trim()}");

    var result = VerbConverter.MakeResult(input);
    return Results.Ok(result);
})
.WithName("ConvertVerb")
.WithOpenApi();

app.UseCors(builder => builder
 .AllowAnyOrigin()
 .AllowAnyMethod()
 .AllowAnyHeader()
);

app.Run();
