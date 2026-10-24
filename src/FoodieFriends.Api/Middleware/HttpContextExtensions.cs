using FoodieFriends.Infrastructure.Data;

namespace FoodieFriends.Api.Middleware;

public static class HttpContextExtensions
{
    public static Guid GetCurrentUserId(this HttpContext context)
    {
        if (context.Items.TryGetValue("CurrentUserId", out var item) && item is Guid guid)
        {
            return guid;
        }

        return SeedData.DemoUserId;
    }
}
