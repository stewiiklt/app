using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Api.Services;
using FoodieFriends.Core.Entities;
using FoodieFriends.Core.Enums;
using FoodieFriends.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/want-to-try")]
[Route("api/[controller]")]
public class WantToTryController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;
    private readonly NotificationService _notificationService;

    public WantToTryController(FoodieFriendsDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    /// <summary>
    /// POST /api/want-to-try/{restaurantId} - Bookmark a restaurant to want-to-try list.
    /// </summary>
    [HttpPost("{restaurantId}")]
    public async Task<IActionResult> AddWantToTry(Guid restaurantId)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var restaurant = await _context.Restaurants.FindAsync(restaurantId);
        if (restaurant == null)
        {
            return NotFound("Restaurant not found.");
        }

        var existing = await _context.WantToTryEntries
            .FirstOrDefaultAsync(w => w.UserId == currentUserId && w.RestaurantId == restaurantId);

        if (existing == null)
        {
            var entry = new WantToTry
            {
                Id = Guid.NewGuid(),
                UserId = currentUserId,
                RestaurantId = restaurantId,
                CreatedAt = DateTime.UtcNow
            };
            await _context.WantToTryEntries.AddAsync(entry);
            await _context.SaveChangesAsync();

            // Notify friends who follow current user
            var followers = await _context.Follows
                .Where(f => f.FolloweeId == currentUserId)
                .Select(f => f.FollowerId)
                .ToListAsync();

            var user = await _context.Users.FindAsync(currentUserId);
            var userName = user?.DisplayName ?? "A friend";

            foreach (var followerId in followers)
            {
                await _notificationService.CreateNotificationAsync(
                    recipientUserId: followerId,
                    actorId: currentUserId,
                    type: NotificationType.WantToTry,
                    reviewId: null,
                    restaurantId: restaurantId,
                    message: $"{userName} wants to try {restaurant.Name}"
                );
            }
        }

        return Ok(new { success = true, isWantToTry = true });
    }

    /// <summary>
    /// DELETE /api/want-to-try/{restaurantId} - Remove restaurant from want-to-try list.
    /// </summary>
    [HttpDelete("{restaurantId}")]
    public async Task<IActionResult> RemoveWantToTry(Guid restaurantId)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var existing = await _context.WantToTryEntries
            .FirstOrDefaultAsync(w => w.UserId == currentUserId && w.RestaurantId == restaurantId);

        if (existing != null)
        {
            _context.WantToTryEntries.Remove(existing);
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, isWantToTry = false });
    }

    /// <summary>
    /// GET /api/want-to-try - Retrieve current user's want-to-try list.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<WantToTryDto>>> GetMyWantToTry()
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var entries = await _context.WantToTryEntries
            .Include(w => w.User)
            .Include(w => w.Restaurant)
                .ThenInclude(r => r!.Municipality)
            .Where(w => w.UserId == currentUserId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        var result = entries.Select(w => new WantToTryDto(
            w.Id,
            w.UserId,
            w.User?.Username ?? "user",
            w.User?.DisplayName ?? "User",
            w.RestaurantId,
            new WantToTryRestaurantDto(
                w.Restaurant!.Id,
                w.Restaurant.Name,
                w.Restaurant.Address,
                w.Restaurant.CuisineType,
                w.Restaurant.PriceRange,
                w.Restaurant.CoverImageUrl,
                w.Restaurant.AverageRating,
                w.Restaurant.TotalReviews,
                w.Restaurant.IsNew,
                w.Restaurant.Municipality?.Name ?? ""
            ),
            w.CreatedAt
        )).ToList();

        return Ok(result);
    }
}
