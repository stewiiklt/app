using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RankingsController : ControllerBase
{
    private readonly RankingService _rankingService;

    public RankingsController(RankingService rankingService)
    {
        _rankingService = rankingService;
    }

    /// <summary>
    /// GET /api/rankings/all?city=&limit= - Leaderboard of top-rated restaurants by all users.
    /// </summary>
    [HttpGet("all")]
    public async Task<ActionResult<List<RankingRestaurantDto>>> GetAllRankings(
        [FromQuery] int? city,
        [FromQuery] int limit = 20)
    {
        var result = await _rankingService.GetAllRankingsAsync(city, limit);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/rankings/friends?city=&limit= - Leaderboard of top-rated restaurants by friends.
    /// </summary>
    [HttpGet("friends")]
    public async Task<ActionResult<List<RankingRestaurantDto>>> GetFriendsRankings(
        [FromQuery] int? city,
        [FromQuery] int limit = 20)
    {
        var currentUserId = HttpContext.GetCurrentUserId();
        var result = await _rankingService.GetFriendsRankingsAsync(currentUserId, city, limit);
        return Ok(result);
    }

    /// <summary>
    /// GET /api/rankings/category/{slug}?city= - Leaderboard of top-rated restaurants by cuisine category.
    /// </summary>
    [HttpGet("category/{slug}")]
    public async Task<ActionResult<List<RankingRestaurantDto>>> GetCategoryRankings(
        string slug,
        [FromQuery] int? city,
        [FromQuery] int limit = 20)
    {
        var result = await _rankingService.GetCategoryRankingsAsync(slug, city, limit);
        return Ok(result);
    }
}
