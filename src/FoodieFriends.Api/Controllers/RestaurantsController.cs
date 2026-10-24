using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;

    public RestaurantsController(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/restaurants/search?q=&city=&cuisine=&price=&isNew= - Search restaurants with filters.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<RestaurantDto>>> SearchRestaurants(
        [FromQuery] string? q,
        [FromQuery] int? city,
        [FromQuery] string? cuisine,
        [FromQuery] int? price,
        [FromQuery] bool? isNew)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var query = _context.Restaurants
            .Include(r => r.Municipality)
            .Include(r => r.Reviews)
            .Include(r => r.WantToTryEntries)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var search = q.Trim().ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(search) || r.Address.ToLower().Contains(search) || r.CuisineType.ToLower().Contains(search));
        }

        if (city.HasValue && city.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == city.Value);
        }

        if (!string.IsNullOrWhiteSpace(cuisine))
        {
            var c = cuisine.Trim().ToLower();
            query = query.Where(r => r.CuisineType.ToLower().Contains(c));
        }

        if (price.HasValue && price.Value >= 1 && price.Value <= 4)
        {
            query = query.Where(r => r.PriceRange == price.Value);
        }

        if (isNew.HasValue && isNew.Value)
        {
            var sixMonthsAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));
            query = query.Where(r => r.OpenedDate.HasValue && r.OpenedDate.Value >= sixMonthsAgo);
        }

        var restaurants = await query.ToListAsync();

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var result = restaurants.Select(r =>
        {
            var friendReviews = r.Reviews.Where(rev => friendIds.Contains(rev.UserId)).ToList();
            var friendAvg = friendReviews.Count > 0 ? (decimal?)Math.Round(friendReviews.Average(rev => rev.Rating), 1) : null;
            var isWant = r.WantToTryEntries.Any(w => w.UserId == currentUserId);

            return new RestaurantDto(
                r.Id,
                r.Name,
                r.Address,
                r.Latitude,
                r.Longitude,
                r.MunicipalityId,
                r.Municipality?.Name ?? "",
                r.CuisineType,
                r.PriceRange,
                r.WebsiteUrl,
                r.MenuUrl,
                r.CoverImageUrl,
                r.AverageRating,
                r.TotalReviews,
                r.OpenedDate,
                r.IsNew,
                friendReviews.Count,
                friendAvg,
                isWant
            );
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// GET /api/restaurants/{id} - Get detailed restaurant profile.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<RestaurantDto>> GetRestaurant(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var r = await _context.Restaurants
            .Include(r => r.Municipality)
            .Include(r => r.Reviews)
            .Include(r => r.WantToTryEntries)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (r == null)
        {
            return NotFound($"Restaurant with ID {id} was not found.");
        }

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var friendReviews = r.Reviews.Where(rev => friendIds.Contains(rev.UserId)).ToList();
        var friendAvg = friendReviews.Count > 0 ? (decimal?)Math.Round(friendReviews.Average(rev => rev.Rating), 1) : null;
        var isWant = r.WantToTryEntries.Any(w => w.UserId == currentUserId);

        var dto = new RestaurantDto(
            r.Id,
            r.Name,
            r.Address,
            r.Latitude,
            r.Longitude,
            r.MunicipalityId,
            r.Municipality?.Name ?? "",
            r.CuisineType,
            r.PriceRange,
            r.WebsiteUrl,
            r.MenuUrl,
            r.CoverImageUrl,
            r.AverageRating,
            r.TotalReviews,
            r.OpenedDate,
            r.IsNew,
            friendReviews.Count,
            friendAvg,
            isWant
        );

        return Ok(dto);
    }

    /// <summary>
    /// GET /api/restaurants/{id}/reviews - Paginated all reviews for restaurant.
    /// </summary>
    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetRestaurantReviews(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .Where(r => r.RestaurantId == id)
            // Public reviews OR FriendsOnly if author is a friend or current user
            .Where(r => r.Visibility == Core.Enums.ReviewVisibility.Public || r.UserId == currentUserId || friendIds.Contains(r.UserId))
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = reviews.Select(r => new ReviewDto(
            r.Id,
            r.CreatedAt,
            new ReviewUserSummaryDto(r.User!.Id, r.User.Username, r.User.DisplayName, r.User.ProfilePhotoUrl),
            new ReviewRestaurantSummaryDto(r.Restaurant!.Id, r.Restaurant.Name, r.Restaurant.CuisineType, r.Restaurant.Municipality?.Name ?? "", r.Restaurant.IsNew),
            r.Rating,
            r.Title,
            r.Body,
            r.VisitNumber,
            r.PriceRangeIndicator,
            r.Visibility.ToString(),
            r.Photos.OrderBy(p => p.Order).Select(p => new ReviewPhotoDto(p.Id, p.Url, p.Caption, p.Order)).ToList(),
            r.Tags.Select(t => t.Name).ToList(),
            r.Likes.Count,
            r.Comments.Count,
            r.Likes.Any(l => l.UserId == currentUserId)
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// GET /api/restaurants/{id}/friends-reviews - Friends' reviews only for restaurant.
    /// </summary>
    [HttpGet("{id}/friends-reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetFriendsRestaurantReviews(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .Where(r => r.RestaurantId == id && (friendIds.Contains(r.UserId) || r.UserId == currentUserId))
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var result = reviews.Select(r => new ReviewDto(
            r.Id,
            r.CreatedAt,
            new ReviewUserSummaryDto(r.User!.Id, r.User.Username, r.User.DisplayName, r.User.ProfilePhotoUrl),
            new ReviewRestaurantSummaryDto(r.Restaurant!.Id, r.Restaurant.Name, r.Restaurant.CuisineType, r.Restaurant.Municipality?.Name ?? "", r.Restaurant.IsNew),
            r.Rating,
            r.Title,
            r.Body,
            r.VisitNumber,
            r.PriceRangeIndicator,
            r.Visibility.ToString(),
            r.Photos.OrderBy(p => p.Order).Select(p => new ReviewPhotoDto(p.Id, p.Url, p.Caption, p.Order)).ToList(),
            r.Tags.Select(t => t.Name).ToList(),
            r.Likes.Count,
            r.Comments.Count,
            r.Likes.Any(l => l.UserId == currentUserId)
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// GET /api/restaurants/categories - List cuisine categories with counts.
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var cuisines = await _context.Restaurants
            .Select(r => r.CuisineType)
            .ToListAsync();

        var categories = cuisines
            .GroupBy(c => c)
            .Select(g => new CategoryDto(
                g.Key,
                g.Key.ToLower().Replace(" ", "-"),
                g.Count()
            ))
            .OrderByDescending(c => c.Count)
            .ToList();

        return Ok(categories);
    }

    /// <summary>
    /// GET /api/restaurants/by-category/{slug} - Filter restaurants by cuisine type slug.
    /// </summary>
    [HttpGet("by-category/{slug}")]
    public async Task<ActionResult<List<RestaurantDto>>> GetByCategory(
        string slug,
        [FromQuery] int? city)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var query = _context.Restaurants
            .Include(r => r.Municipality)
            .Include(r => r.Reviews)
            .Include(r => r.WantToTryEntries)
            .AsQueryable();

        if (city.HasValue && city.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == city.Value);
        }

        var normalizedSlug = slug.Trim().ToLowerInvariant().Replace("-", "");

        if (normalizedSlug == "new")
        {
            var sixMonthsAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));
            query = query.Where(r => r.OpenedDate.HasValue && r.OpenedDate.Value >= sixMonthsAgo);
        }
        else
        {
            query = query.Where(r => r.CuisineType.ToLower().Replace(" ", "").Replace("-", "").Contains(normalizedSlug));
        }

        var restaurants = await query.ToListAsync();

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var result = restaurants.Select(r =>
        {
            var friendReviews = r.Reviews.Where(rev => friendIds.Contains(rev.UserId)).ToList();
            var friendAvg = friendReviews.Count > 0 ? (decimal?)Math.Round(friendReviews.Average(rev => rev.Rating), 1) : null;
            var isWant = r.WantToTryEntries.Any(w => w.UserId == currentUserId);

            return new RestaurantDto(
                r.Id,
                r.Name,
                r.Address,
                r.Latitude,
                r.Longitude,
                r.MunicipalityId,
                r.Municipality?.Name ?? "",
                r.CuisineType,
                r.PriceRange,
                r.WebsiteUrl,
                r.MenuUrl,
                r.CoverImageUrl,
                r.AverageRating,
                r.TotalReviews,
                r.OpenedDate,
                r.IsNew,
                friendReviews.Count,
                friendAvg,
                isWant
            );
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// GET /api/restaurants/new?city= - New restaurants opened within the last 6 months.
    /// </summary>
    [HttpGet("new")]
    public async Task<ActionResult<List<RestaurantDto>>> GetNewRestaurants([FromQuery] int? city)
    {
        var sixMonthsAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));

        var query = _context.Restaurants
            .Include(r => r.Municipality)
            .Include(r => r.Reviews)
            .Include(r => r.WantToTryEntries)
            .Where(r => r.OpenedDate.HasValue && r.OpenedDate.Value >= sixMonthsAgo);

        if (city.HasValue && city.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == city.Value);
        }

        var restaurants = await query.OrderByDescending(r => r.OpenedDate).ToListAsync();
        var currentUserId = HttpContext.GetCurrentUserId();

        var friendIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var result = restaurants.Select(r =>
        {
            var friendReviews = r.Reviews.Where(rev => friendIds.Contains(rev.UserId)).ToList();
            var friendAvg = friendReviews.Count > 0 ? (decimal?)Math.Round(friendReviews.Average(rev => rev.Rating), 1) : null;
            var isWant = r.WantToTryEntries.Any(w => w.UserId == currentUserId);

            return new RestaurantDto(
                r.Id,
                r.Name,
                r.Address,
                r.Latitude,
                r.Longitude,
                r.MunicipalityId,
                r.Municipality?.Name ?? "",
                r.CuisineType,
                r.PriceRange,
                r.WebsiteUrl,
                r.MenuUrl,
                r.CoverImageUrl,
                r.AverageRating,
                r.TotalReviews,
                r.OpenedDate,
                r.IsNew,
                friendReviews.Count,
                friendAvg,
                isWant
            );
        }).ToList();

        return Ok(result);
    }
}
