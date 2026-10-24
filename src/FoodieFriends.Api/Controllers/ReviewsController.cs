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
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;
    private readonly NotificationService _notificationService;

    public ReviewsController(FoodieFriendsDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    /// <summary>
    /// POST /api/reviews - Create a new restaurant review.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto dto)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        if (dto.Rating < 1 || dto.Rating > 10)
        {
            return BadRequest("Rating must be between 1 and 10.");
        }

        if (string.IsNullOrWhiteSpace(dto.Body))
        {
            return BadRequest("Review body is required (min 1 word).");
        }

        var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
        if (restaurant == null)
        {
            return NotFound("Restaurant not found.");
        }

        // Section 6.2: Auto-calculate visit number
        var previousVisits = await _context.Reviews
            .CountAsync(r => r.UserId == currentUserId && r.RestaurantId == dto.RestaurantId);
        var visitNumber = previousVisits + 1;

        var title = dto.Title?.Trim() ?? "Restaurant Visit";
        if (visitNumber > 1)
        {
            // If title doesn't already contain the visit number
            if (!title.Contains($"#{visitNumber}"))
            {
                title = $"{title} (#{visitNumber})";
            }
        }

        var review = new Review
        {
            Id = Guid.NewGuid(),
            UserId = currentUserId,
            RestaurantId = dto.RestaurantId,
            Rating = dto.Rating,
            Title = title,
            Body = dto.Body.Trim(),
            VisitNumber = visitNumber,
            Visibility = dto.Visibility,
            PriceRangeIndicator = dto.PriceRangeIndicator >= 1 && dto.PriceRangeIndicator <= 4 ? dto.PriceRangeIndicator : restaurant.PriceRange,
            CreatedAt = DateTime.UtcNow
        };

        // Attach photos if provided (up to 5)
        if (dto.Photos != null && dto.Photos.Count > 0)
        {
            var order = 0;
            foreach (var p in dto.Photos.Take(5))
            {
                if (!string.IsNullOrWhiteSpace(p.Url))
                {
                    review.Photos.Add(new ReviewPhoto
                    {
                        Id = Guid.NewGuid(),
                        ReviewId = review.Id,
                        Url = p.Url.Trim(),
                        Caption = p.Caption?.Trim(),
                        Order = order++
                    });
                }
            }
        }

        // Attach tags if provided
        if (dto.TagIds != null && dto.TagIds.Count > 0)
        {
            var tags = await _context.Tags
                .Where(t => dto.TagIds.Contains(t.Id))
                .ToListAsync();

            foreach (var t in tags)
            {
                review.Tags.Add(t);
            }
        }

        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();

        // Recalculate restaurant AverageRating and TotalReviews
        var allRatings = await _context.Reviews
            .Where(r => r.RestaurantId == restaurant.Id)
            .Select(r => r.Rating)
            .ToListAsync();

        restaurant.TotalReviews = allRatings.Count;
        restaurant.AverageRating = allRatings.Count > 0
            ? Math.Round((decimal)allRatings.Average(), 1)
            : 0m;

        await _context.SaveChangesAsync();

        // Notify followers about the new review
        var followers = await _context.Follows
            .Include(f => f.Follower)
            .Where(f => f.FolloweeId == currentUserId)
            .Select(f => f.FollowerId)
            .ToListAsync();

        var author = await _context.Users.FindAsync(currentUserId);
        var authorName = author?.DisplayName ?? "A friend";

        foreach (var followerId in followers)
        {
            await _notificationService.CreateNotificationAsync(
                recipientUserId: followerId,
                actorId: currentUserId,
                type: NotificationType.NewReview,
                reviewId: review.Id,
                restaurantId: restaurant.Id,
                message: $"{authorName} reviewed {restaurant.Name}"
            );
        }

        // Fetch full created review with relations for DTO
        var created = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .FirstAsync(r => r.Id == review.Id);

        var resultDto = new ReviewDto(
            created.Id,
            created.CreatedAt,
            new ReviewUserSummaryDto(created.User!.Id, created.User.Username, created.User.DisplayName, created.User.ProfilePhotoUrl),
            new ReviewRestaurantSummaryDto(created.Restaurant!.Id, created.Restaurant.Name, created.Restaurant.CuisineType, created.Restaurant.Municipality?.Name ?? "", created.Restaurant.IsNew),
            created.Rating,
            created.Title,
            created.Body,
            created.VisitNumber,
            created.PriceRangeIndicator,
            created.Visibility.ToString(),
            created.Photos.OrderBy(p => p.Order).Select(p => new ReviewPhotoDto(p.Id, p.Url, p.Caption, p.Order)).ToList(),
            created.Tags.Select(t => t.Name).ToList(),
            created.Likes.Count,
            created.Comments.Count,
            IsLikedByMe: false
        );

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, resultDto);
    }

    /// <summary>
    /// GET /api/reviews/{id} - Get detail of a specific review.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDto>> GetReview(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var r = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (r == null)
        {
            return NotFound($"Review {id} not found.");
        }

        var isLikedByMe = r.Likes.Any(l => l.UserId == currentUserId);

        var dto = new ReviewDto(
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
            isLikedByMe
        );

        return Ok(dto);
    }

    /// <summary>
    /// POST /api/reviews/{id}/like - Like a review.
    /// </summary>
    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeReview(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var review = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
        {
            return NotFound("Review not found.");
        }

        var existing = await _context.ReviewLikes
            .FirstOrDefaultAsync(l => l.ReviewId == id && l.UserId == currentUserId);

        if (existing == null)
        {
            var like = new ReviewLike
            {
                ReviewId = id,
                UserId = currentUserId,
                CreatedAt = DateTime.UtcNow
            };
            await _context.ReviewLikes.AddAsync(like);
            await _context.SaveChangesAsync();

            // Send notification to author
            var actor = await _context.Users.FindAsync(currentUserId);
            var actorName = actor?.DisplayName ?? "Someone";

            await _notificationService.CreateNotificationAsync(
                recipientUserId: review.UserId,
                actorId: currentUserId,
                type: NotificationType.Like,
                reviewId: review.Id,
                restaurantId: review.RestaurantId,
                message: $"{actorName} liked your review of {review.Restaurant?.Name}"
            );
        }

        var totalLikes = await _context.ReviewLikes.CountAsync(l => l.ReviewId == id);
        return Ok(new { success = true, isLiked = true, likeCount = totalLikes });
    }

    /// <summary>
    /// DELETE /api/reviews/{id}/like - Unlike a review.
    /// </summary>
    [HttpDelete("{id}/like")]
    public async Task<IActionResult> UnlikeReview(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var existing = await _context.ReviewLikes
            .FirstOrDefaultAsync(l => l.ReviewId == id && l.UserId == currentUserId);

        if (existing != null)
        {
            _context.ReviewLikes.Remove(existing);
            await _context.SaveChangesAsync();
        }

        var totalLikes = await _context.ReviewLikes.CountAsync(l => l.ReviewId == id);
        return Ok(new { success = true, isLiked = false, likeCount = totalLikes });
    }

    /// <summary>
    /// GET /api/reviews/{id}/comments - Get comments on a review with mutual friend visibility filtering.
    /// SDD Section 6.1: Visible only if (currentUserId == comment.UserId) OR (currentUserId == review.UserId)
    /// OR (currentUserId follows BOTH review.UserId AND comment.UserId).
    /// </summary>
    [HttpGet("{id}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetComments(Guid id)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound("Review not found.");
        }

        // Get list of users that current user follows
        var followedUserIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        var followedSet = followedUserIds.ToHashSet();
        var followsReviewAuthor = followedSet.Contains(review.UserId);
        var isReviewAuthor = (currentUserId == review.UserId);

        var comments = await _context.ReviewComments
            .Include(c => c.User)
            .Where(c => c.ReviewId == id)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();

        // Apply Section 6.1 filter strictly:
        var visibleComments = comments.Where(c =>
            c.UserId == currentUserId // I wrote it
            || isReviewAuthor // I'm the review author
            || (followsReviewAuthor && followedSet.Contains(c.UserId)) // I follow both review author and commenter
        ).ToList();

        var result = visibleComments.Select(c => new CommentDto(
            c.Id,
            c.ReviewId,
            c.UserId,
            c.User?.Username ?? "user",
            c.User?.DisplayName ?? "User",
            c.User?.ProfilePhotoUrl,
            c.Content,
            c.CreatedAt
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// POST /api/reviews/{id}/comments - Add a comment to a review.
    /// </summary>
    [HttpPost("{id}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid id, [FromBody] CreateCommentDto dto)
    {
        var currentUserId = HttpContext.GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(dto.Content))
        {
            return BadRequest("Comment content cannot be empty.");
        }

        var review = await _context.Reviews
            .Include(r => r.Restaurant)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
        {
            return NotFound("Review not found.");
        }

        var comment = new ReviewComment
        {
            Id = Guid.NewGuid(),
            ReviewId = id,
            UserId = currentUserId,
            Content = dto.Content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _context.ReviewComments.AddAsync(comment);
        await _context.SaveChangesAsync();

        // Notify review author
        var actor = await _context.Users.FindAsync(currentUserId);
        var actorName = actor?.DisplayName ?? "Someone";

        await _notificationService.CreateNotificationAsync(
            recipientUserId: review.UserId,
            actorId: currentUserId,
            type: NotificationType.Comment,
            reviewId: review.Id,
            restaurantId: review.RestaurantId,
            message: $"{actorName} commented on your review of {review.Restaurant?.Name}"
        );

        var result = new CommentDto(
            comment.Id,
            comment.ReviewId,
            comment.UserId,
            actor?.Username ?? "user",
            actor?.DisplayName ?? "User",
            actor?.ProfilePhotoUrl,
            comment.Content,
            comment.CreatedAt
        );

        return CreatedAtAction(nameof(GetComments), new { id = review.Id }, result);
    }
}
