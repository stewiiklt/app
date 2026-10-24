using System.Text.Json.Serialization;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Api.Services;
using FoodieFriends.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 2. Configure Database Context (Supports SQLite and PostgreSQL)
var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var sqliteConnection = builder.Configuration.GetConnectionString("Sqlite") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=foodiefriends.db";
var postgresConnection = builder.Configuration.GetConnectionString("PostgreSql") 
    ?? "Host=localhost;Database=foodiefriends;Username=postgres;Password=postgres";

builder.Services.AddDbContext<FoodieFriendsDbContext>(options =>
{
    if (dbProvider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(postgresConnection);
    }
    else
    {
        options.UseSqlite(sqliteConnection);
    }
});

// 3. Register Domain Services
builder.Services.AddScoped<TrendingService>();
builder.Services.AddScoped<RankingService>();
builder.Services.AddScoped<FeedService>();
builder.Services.AddScoped<NotificationService>();

// 4. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 5. Initialize & Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FoodieFriendsDbContext>();
    await context.Database.EnsureCreatedAsync();
    await SeedData.InitializeAsync(context);
}

// 6. Configure HTTP pipeline
app.UseCors("AllowAll");

// Custom simulated auth middleware
app.UseMiddleware<CurrentUserMiddleware>();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
