using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedController : ControllerBase
{
    private readonly FeedService _feedService;
    private readonly TrendingService _trendingService;

    public FeedController(FeedService feedService, TrendingService trendingService)
    {
        _feedService = feedService;
        _trendingService = trendingService;
    }

    /// <summary>
    /// GET /api/feed?cursor=&limit=20 - Chronological newsfeed of friend reviews, want-to-try bookmarks, and trending cards.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<FeedResponseDto>> GetFeed(
        [FromQuery] string? cursor,
        [FromQuery] int limit = 20)
    {
        var currentUserId = HttpContext.GetCurrentUserId();
        var result = await _feedService.GetFeedAsync(currentUserId, cursor, limit);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/feed/trending?city=1 - Trending restaurants list calculated for municipality.
    /// </summary>
    [HttpGet("trending")]
    public async Task<ActionResult<List<TrendingFeedItemDto>>> GetTrending([FromQuery] int? city)
    {
        var result = await _trendingService.GetTrendingAsync(city, 10);
        return Ok(result);
    }
}
