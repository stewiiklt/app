using FoodieFriends.Api.DTOs;
using FoodieFriends.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Services;

public class RankingService
{
    private readonly FoodieFriendsDbContext _context;

    public RankingService(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    public async Task<List<RankingRestaurantDto>> GetAllRankingsAsync(int? cityId, int limit = 20)
    {
        var query = _context.Restaurants
            .Include(r => r.Reviews)
            .AsQueryable();

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == cityId.Value);
        }

        var restaurants = await query.ToListAsync();

        // Qualification: Minimum 3 public reviews (fallback to min 1 if sparse prototype)
        var qualified = restaurants.Where(r => r.Reviews.Count >= 3).ToList();
        if (qualified.Count == 0)
        {
            qualified = restaurants.Where(r => r.Reviews.Count >= 1).ToList();
        }

        var sorted = qualified
            .OrderByDescending(r => r.AverageRating)
            .ThenByDescending(r => r.TotalReviews)
            .Take(limit)
            .ToList();

        var result = new List<RankingRestaurantDto>();
        for (int i = 0; i < sorted.Count; i++)
        {
            var r = sorted[i];
            result.Add(new RankingRestaurantDto(
                Rank: i + 1,
                Id: r.Id,
                Name: r.Name,
                Address: r.Address,
                CuisineType: r.CuisineType,
                PriceRange: r.PriceRange,
                CoverImageUrl: r.CoverImageUrl,
                AverageRating: r.AverageRating,
                TotalReviews: r.TotalReviews,
                IsNew: r.IsNew,
                FriendReviewCount: 0,
                FriendAverageRating: null
            ));
        }

        return result;
    }

    public async Task<List<RankingRestaurantDto>> GetFriendsRankingsAsync(Guid currentUserId, int? cityId, int limit = 20)
    {
        // 1. Get IDs of users current user follows
        var followedUserIds = await _context.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FolloweeId)
            .ToListAsync();

        // Include current user's own reviews as well
        followedUserIds.Add(currentUserId);

        var query = _context.Restaurants
            .Include(r => r.Reviews.Where(rev => followedUserIds.Contains(rev.UserId)))
            .AsQueryable();

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == cityId.Value);
        }

        var restaurants = await query.ToListAsync();

        // Filter restaurants reviewed by friends (min 2, fallback to min 1)
        var friendReviewed = restaurants.Where(r => r.Reviews.Any(rev => followedUserIds.Contains(rev.UserId))).ToList();
        var qualified = friendReviewed.Where(r => r.Reviews.Count(rev => followedUserIds.Contains(rev.UserId)) >= 2).ToList();
        if (qualified.Count == 0)
        {
            qualified = friendReviewed;
        }

        var ranked = qualified
            .Select(r =>
            {
                var friendReviews = r.Reviews.Where(rev => followedUserIds.Contains(rev.UserId)).ToList();
                var count = friendReviews.Count;
                var avg = count > 0 ? (decimal)friendReviews.Average(rev => rev.Rating) : 0m;
                return new
                {
                    Restaurant = r,
                    FriendCount = count,
                    FriendAvg = Math.Round(avg, 1)
                };
            })
            .OrderByDescending(x => x.FriendAvg)
            .ThenByDescending(x => x.FriendCount)
            .Take(limit)
            .ToList();

        var result = new List<RankingRestaurantDto>();
        for (int i = 0; i < ranked.Count; i++)
        {
            var item = ranked[i];
            result.Add(new RankingRestaurantDto(
                Rank: i + 1,
                Id: item.Restaurant.Id,
                Name: item.Restaurant.Name,
                Address: item.Restaurant.Address,
                CuisineType: item.Restaurant.CuisineType,
                PriceRange: item.Restaurant.PriceRange,
                CoverImageUrl: item.Restaurant.CoverImageUrl,
                AverageRating: item.Restaurant.AverageRating,
                TotalReviews: item.Restaurant.TotalReviews,
                IsNew: item.Restaurant.IsNew,
                FriendReviewCount: item.FriendCount,
                FriendAverageRating: item.FriendAvg
            ));
        }

        return result;
    }

    public async Task<List<RankingRestaurantDto>> GetCategoryRankingsAsync(string slug, int? cityId, int limit = 20)
    {
        var query = _context.Restaurants
            .Include(r => r.Reviews)
            .AsQueryable();

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == cityId.Value);
        }

        // Match slug with CuisineType or special "new"
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

        var sorted = restaurants
            .OrderByDescending(r => r.AverageRating)
            .ThenByDescending(r => r.TotalReviews)
            .Take(limit)
            .ToList();

        var result = new List<RankingRestaurantDto>();
        for (int i = 0; i < sorted.Count; i++)
        {
            var r = sorted[i];
            result.Add(new RankingRestaurantDto(
                Rank: i + 1,
                Id: r.Id,
                Name: r.Name,
                Address: r.Address,
                CuisineType: r.CuisineType,
                PriceRange: r.PriceRange,
                CoverImageUrl: r.CoverImageUrl,
                AverageRating: r.AverageRating,
                TotalReviews: r.TotalReviews,
                IsNew: r.IsNew,
                FriendReviewCount: 0,
                FriendAverageRating: null
            ));
        }

        return result;
    }
}
