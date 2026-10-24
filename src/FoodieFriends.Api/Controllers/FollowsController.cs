using FoodieFriends.Api.DTOs;
using FoodieFriends.Api.Middleware;
using FoodieFriends.Core.Entities;
using FoodieFriends.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;

    public FollowsController(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// POST /api/follows/{userId} - Follow a user.
    /// </summary>
    [HttpPost("{userId}")]
    public async Task<IActionResult> FollowUser(Guid userId)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        if (currentUserId == userId)
        {
            return BadRequest("You cannot follow yourself.");
        }

        var targetUser = await _context.Users.FindAsync(userId);
        if (targetUser == null)
        {
            return NotFound("User to follow not found.");
        }

        var existing = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FolloweeId == userId);

        if (existing == null)
        {
            var follow = new Follow
            {
                FollowerId = currentUserId,
                FolloweeId = userId,
                CreatedAt = DateTime.UtcNow
            };
            await _context.Follows.AddAsync(follow);
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, isFollowing = true });
    }

    /// <summary>
    /// DELETE /api/follows/{userId} - Unfollow a user.
    /// </summary>
    [HttpDelete("{userId}")]
    public async Task<IActionResult> UnfollowUser(Guid userId)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var existing = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FolloweeId == userId);

        if (existing != null)
        {
            _context.Follows.Remove(existing);
            await _context.SaveChangesAsync();
        }

        return Ok(new { success = true, isFollowing = false });
    }

    /// <summary>
    /// GET /api/follows/following - Who current user follows.
    /// </summary>
    [HttpGet("following")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetFollowing()
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var followingUsers = await _context.Follows
            .Include(f => f.Followee)
                .ThenInclude(u => u!.City)
            .Where(f => f.FollowerId == currentUserId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.Followee!)
            .ToListAsync();

        var result = followingUsers.Select(u => new UserSummaryDto(
            u.Id,
            u.Username,
            u.DisplayName,
            u.ProfilePhotoUrl,
            u.City?.Name,
            IsFollowing: true,
            MutualFollowersCount: 0
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// GET /api/follows/followers - Followers of current user.
    /// </summary>
    [HttpGet("followers")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetFollowers()
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var followers = await _context.Follows
            .Include(f => f.Follower)
                .ThenInclude(u => u!.City)
            .Where(f => f.FolloweeId == currentUserId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.Follower!)
            .ToListAsync();

        var myFollowingIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var myFollowingSet = myFollowingIds.ToHashSet();

        var result = followers.Select(u => new UserSummaryDto(
            u.Id,
            u.Username,
            u.DisplayName,
            u.ProfilePhotoUrl,
            u.City?.Name,
            IsFollowing: myFollowingSet.Contains(u.Id),
            MutualFollowersCount: 0
        )).ToList();

        return Ok(result);
    }
}
