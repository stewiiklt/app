using FoodieFriends.Infrastructure.Data;

namespace FoodieFriends.Api.Middleware;

public class CurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public CurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Guid currentUserId = SeedData.DemoUserId; // Fallback demo user (Anna Johansen)

        if (context.Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) 
            && !string.IsNullOrWhiteSpace(userIdHeader))
        {
            if (Guid.TryParse(userIdHeader.ToString(), out var parsedId))
            {
                currentUserId = parsedId;
            }
        }

        context.Items["CurrentUserId"] = currentUserId;

        await _next(context);
    }
}
