using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Core.Entities;
using FoodieFriends.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;

    public UsersController(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/users/me - Retrieve current logged-in user profile.
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var user = await _context.Users
            .Include(u => u.City)
            .Include(u => u.Reviews)
            .Include(u => u.Following)
            .Include(u => u.Followers)
            .FirstOrDefaultAsync(u => u.Id == currentUserId);

        if (user == null)
        {
            // Fallback to first user in database
            user = await _context.Users
                .Include(u => u.City)
                .Include(u => u.Reviews)
                .Include(u => u.Following)
                .Include(u => u.Followers)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("No user found.");
            }
        }

        var dto = new UserProfileDto(
            user.Id,
            user.Username,
            user.DisplayName,
            user.Email,
            user.ProfilePhotoUrl,
            user.Bio,
            user.CityId,
            user.City?.Name,
            user.City?.CountryCode,
            user.Reviews.Count,
            user.Following.Count,
            user.Followers.Count,
            IsFollowing: false,
            IsMe: true
        );

        return Ok(dto);
    }

    /// <summary>
    /// PUT /api/users/me - Update current user profile.
    /// </summary>
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateCurrentUser([FromBody] UpdateProfileDto dto)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var user = await _context.Users
            .Include(u => u.City)
            .Include(u => u.Reviews)
            .Include(u => u.Following)
            .Include(u => u.Followers)
            .FirstOrDefaultAsync(u => u.Id == currentUserId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(dto.DisplayName))
            user.DisplayName = dto.DisplayName.Trim();

        if (dto.Bio != null)
            user.Bio = dto.Bio.Trim();

        if (!string.IsNullOrWhiteSpace(dto.ProfilePhotoUrl))
            user.ProfilePhotoUrl = dto.ProfilePhotoUrl.Trim();

        if (dto.CityId.HasValue && dto.CityId.Value > 0)
        {
            var cityExists = await _context.Municipalities.AnyAsync(m => m.Id == dto.CityId.Value);
            if (cityExists)
            {
                user.CityId = dto.CityId.Value;
            }
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Refresh city navigation if updated
        if (user.City == null || user.City.Id != user.CityId)
        {
            await _context.Entry(user).Reference(u => u.City).LoadAsync();
        }

        var result = new UserProfileDto(
            user.Id,
            user.Username,
            user.DisplayName,
            user.Email,
            user.ProfilePhotoUrl,
            user.Bio,
            user.CityId,
            user.City?.Name,
            user.City?.CountryCode,
            user.Reviews.Count,
            user.Following.Count,
            user.Followers.Count,
            IsFollowing: false,
            IsMe: true
        );

        return Ok(result);
    }

    /// <summary>
    /// GET /api/users/{username} - View user profile by username.
    /// </summary>
    [HttpGet("{username}")]
    public async Task<ActionResult<UserProfileDto>> GetUserByUsername(string username)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var user = await _context.Users
            .Include(u => u.City)
            .Include(u => u.Reviews)
            .Include(u => u.Following)
            .Include(u => u.Followers)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.Trim().ToLower());

        if (user == null)
        {
            return NotFound($"User '{username}' was not found.");
        }

        var isFollowing = await _context.Follows
            .AnyAsync(f => f.FollowerId == currentUserId && f.FolloweeId == user.Id);

        var isMe = (user.Id == currentUserId);

        var dto = new UserProfileDto(
            user.Id,
            user.Username,
            user.DisplayName,
            user.Email,
            user.ProfilePhotoUrl,
            user.Bio,
            user.CityId,
            user.City?.Name,
            user.City?.CountryCode,
            user.Reviews.Count,
            user.Following.Count,
            user.Followers.Count,
            IsFollowing: isFollowing,
            IsMe: isMe
        );

        return Ok(dto);
    }

    /// <summary>
    /// GET /api/users/search?q= - Search users by username or display name.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<UserSummaryDto>>> SearchUsers([FromQuery] string? q)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var query = _context.Users
            .Include(u => u.City)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var search = q.Trim().ToLower();
            query = query.Where(u => u.Username.ToLower().Contains(search) || u.DisplayName.ToLower().Contains(search));
        }

        var users = await query.Take(20).ToListAsync();

        var followedIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var myFriendsIds = followedIds.ToHashSet();

        var result = new List<UserSummaryDto>();

        foreach (var u in users)
        {
            if (u.Id == currentUserId) continue;

            // Mutual friends = users who follow u AND whom current user follows
            var uFollowers = await _context.Follows
                .Where(f => f.FolloweeId == u.Id)
                .Select(f => f.FollowerId)
                .ToListAsync();

            var mutualCount = uFollowers.Count(id => myFriendsIds.Contains(id));

            result.Add(new UserSummaryDto(
                u.Id,
                u.Username,
                u.DisplayName,
                u.ProfilePhotoUrl,
                u.City?.Name,
                IsFollowing: myFriendsIds.Contains(u.Id),
                MutualFollowersCount: mutualCount
            ));
        }

        return Ok(result);
    }

    /// <summary>
    /// GET /api/users/{username}/reviews - Paginated reviews written by user.
    /// </summary>
    [HttpGet("{username}/reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetUserReviews(
        string username,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.Trim().ToLower());
        if (user == null)
        {
            return NotFound($"User '{username}' was not found.");
        }

        var isMe = user.Id == currentUserId;
        var isFollower = await _context.Follows.AnyAsync(f => f.FollowerId == currentUserId && f.FolloweeId == user.Id);

        var query = _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .Where(r => r.UserId == user.Id);

        // Visibility filter: If not me and not follower, only show Public
        if (!isMe && !isFollower)
        {
            query = query.Where(r => r.Visibility == Core.Enums.ReviewVisibility.Public);
        }

        var reviews = await query
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
    /// GET /api/users/{username}/want-to-try - User's want-to-try restaurant list.
    /// </summary>
    [HttpGet("{username}/want-to-try")]
    public async Task<ActionResult<List<WantToTryDto>>> GetUserWantToTry(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.Trim().ToLower());
        if (user == null)
        {
            return NotFound($"User '{username}' was not found.");
        }

        var entries = await _context.WantToTryEntries
            .Include(w => w.User)
            .Include(w => w.Restaurant)
                .ThenInclude(r => r!.Municipality)
            .Where(w => w.UserId == user.Id)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();

        var result = entries.Select(w => new WantToTryDto(
            w.Id,
            w.UserId,
            w.User!.Username,
            w.User.DisplayName,
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

    /// <summary>
    /// GET /api/users/suggestions - Suggested follows (people followed by friends).
    /// </summary>
    [HttpGet("suggestions")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetFollowSuggestions()
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        // 1. Who does current user follow?
        var myFolloweeIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var myFolloweeSet = myFolloweeIds.ToHashSet();
        myFolloweeSet.Add(currentUserId);

        // 2. Who do friends follow?
        var friendsFollows = await _context.Follows
            .Where(f => myFolloweeIds.Contains(f.FollowerId) && !myFolloweeSet.Contains(f.FolloweeId))
            .GroupBy(f => f.FolloweeId)
            .Select(g => new { UserId = g.Key, MutualCount = g.Count() })
            .OrderByDescending(x => x.MutualCount)
            .Take(10)
            .ToListAsync();

        var candidateIds = friendsFollows.Select(x => x.UserId).ToList();

        // If not enough suggestions, fill with other users
        if (candidateIds.Count < 5)
        {
            var additional = await _context.Users
                .Where(u => !myFolloweeSet.Contains(u.Id) && !candidateIds.Contains(u.Id))
                .Take(5 - candidateIds.Count)
                .Select(u => u.Id)
                .ToListAsync();

            candidateIds.AddRange(additional);
        }

        var users = await _context.Users
            .Include(u => u.City)
            .Where(u => candidateIds.Contains(u.Id))
            .ToListAsync();

        var mutualMap = friendsFollows.ToDictionary(x => x.UserId, x => x.MutualCount);

        var result = users.Select(u => new UserSummaryDto(
            u.Id,
            u.Username,
            u.DisplayName,
            u.ProfilePhotoUrl,
            u.City?.Name,
            IsFollowing: false,
            MutualFollowersCount: mutualMap.TryGetValue(u.Id, out var count) ? count : 0
        )).OrderByDescending(u => u.MutualFollowersCount).ToList();

        return Ok(result);
    }
}
