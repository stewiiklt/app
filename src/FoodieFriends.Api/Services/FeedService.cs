using FoodieFriends.Api.DTOs;
using FoodieFriends.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Services;

public class FeedService
{
    private readonly FoodieFriendsDbContext _context;
    private readonly TrendingService _trendingService;

    public FeedService(FoodieFriendsDbContext context, TrendingService trendingService)
    {
        _context = context;
        _trendingService = trendingService;
    }

    public async Task<FeedResponseDto> GetFeedAsync(Guid currentUserId, string? cursor, int limit = 20)
    {
        // 1. Get followees of current user (+ current user so they see their own posts)
        var followedUserIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        followedUserIds.Add(currentUserId);

        DateTime? cursorDate = null;
        if (!string.IsNullOrWhiteSpace(cursor) && DateTime.TryParse(cursor, out var parsedCursor))
        {
            cursorDate = parsedCursor;
        }

        // 2. Query friend reviews
        var reviewQuery = _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Include(r => r.Photos)
            .Include(r => r.Tags)
            .Include(r => r.Likes)
            .Include(r => r.Comments)
            .Where(r => followedUserIds.Contains(r.UserId));

        if (cursorDate.HasValue)
        {
            reviewQuery = reviewQuery.Where(r => r.CreatedAt < cursorDate.Value);
        }

        var friendReviews = await reviewQuery
            .OrderByDescending(r => r.CreatedAt)
            .Take(limit + 5)
            .ToListAsync();

        // 3. Query friend WantToTry bookmarks
        var wantQuery = _context.WantToTryEntries
            .Include(w => w.User)
            .Include(w => w.Restaurant)
                .ThenInclude(rest => rest!.Municipality)
            .Where(w => followedUserIds.Contains(w.UserId));

        if (cursorDate.HasValue)
        {
            wantQuery = wantQuery.Where(w => w.CreatedAt < cursorDate.Value);
        }

        var friendWants = await wantQuery
            .OrderByDescending(w => w.CreatedAt)
            .Take(limit + 5)
            .ToListAsync();

        // 4. Transform into unified chronological stream
        var rawItems = new List<(DateTime CreatedAt, FeedItemDto Dto)>();

        foreach (var r in friendReviews)
        {
            var isLikedByMe = r.Likes.Any(l => l.UserId == currentUserId);
            var bodyPreview = r.Body.Length > 120 ? r.Body.Substring(0, 117) + "..." : r.Body;

            var dto = new FeedItemDto(
                Type: "review",
                Id: r.Id,
                CreatedAt: r.CreatedAt,
                User: new ReviewUserSummaryDto(
                    r.User!.Id,
                    r.User.Username,
                    r.User.DisplayName,
                    r.User.ProfilePhotoUrl
                ),
                Restaurant: new FeedRestaurantSummaryDto(
                    r.Restaurant!.Id,
                    r.Restaurant.Name,
                    r.Restaurant.CuisineType,
                    r.Restaurant.Municipality?.Name,
                    r.Restaurant.AverageRating,
                    r.Restaurant.IsNew
                ),
                Review: new FeedReviewDetailsDto(
                    r.Rating,
                    r.Title,
                    r.Body,
                    bodyPreview,
                    r.VisitNumber,
                    r.PriceRangeIndicator,
                    r.Visibility.ToString(),
                    r.Photos.OrderBy(p => p.Order).Select(p => new ReviewPhotoDto(p.Id, p.Url, p.Caption, p.Order)).ToList(),
                    r.Tags.Select(t => t.Name).ToList(),
                    r.Likes.Count,
                    r.Comments.Count,
                    isLikedByMe
                ),
                Trending: null
            );

            rawItems.Add((r.CreatedAt, dto));
        }

        foreach (var w in friendWants)
        {
            var dto = new FeedItemDto(
                Type: "wantToTry",
                Id: w.Id,
                CreatedAt: w.CreatedAt,
                User: new ReviewUserSummaryDto(
                    w.User!.Id,
                    w.User.Username,
                    w.User.DisplayName,
                    w.User.ProfilePhotoUrl
                ),
                Restaurant: new FeedRestaurantSummaryDto(
                    w.Restaurant!.Id,
                    w.Restaurant.Name,
                    w.Restaurant.CuisineType,
                    w.Restaurant.Municipality?.Name,
                    w.Restaurant.AverageRating,
                    w.Restaurant.IsNew
                ),
                Review: null,
                Trending: null
            );

            rawItems.Add((w.CreatedAt, dto));
        }

        // Sort chronologically
        var sorted = rawItems.OrderByDescending(x => x.CreatedAt).ToList();

        // 5. Inject trending card on first page (cursor is null) if we have items
        if (!cursorDate.HasValue)
        {
            var currentUser = await _context.Users.Include(u => u.City).FirstOrDefaultAsync(u => u.Id == currentUserId);
            var cityId = currentUser?.CityId ?? 1;
            var cityName = currentUser?.City?.Name ?? "Oslo";

            var trendingRestaurants = await _trendingService.GetTrendingAsync(cityId, 3);
            if (trendingRestaurants.Count > 0)
            {
                var trendingDto = new FeedItemDto(
                    Type: "trending",
                    Id: Guid.NewGuid(),
                    CreatedAt: DateTime.UtcNow,
                    User: null,
                    Restaurant: null,
                    Review: null,
                    Trending: new TrendingFeedDetailsDto(cityName, trendingRestaurants)
                );

                // Insert trending card near top (after 2nd item if available, or at top)
                int insertIndex = Math.Min(2, sorted.Count);
                sorted.Insert(insertIndex, (DateTime.UtcNow, trendingDto));
            }
        }

        var pagedItems = sorted.Take(limit).Select(x => x.Dto).ToList();
        var hasMore = sorted.Count > limit;
        string? nextCursor = null;

        if (hasMore && pagedItems.Count > 0)
        {
            nextCursor = pagedItems.Last().CreatedAt.ToString("o");
        }

        return new FeedResponseDto(pagedItems, nextCursor, hasMore);
    }
}
