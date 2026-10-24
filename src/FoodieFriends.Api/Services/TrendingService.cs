using FoodieFriends.Api.DTOs;
using FoodieFriends.Core.Entities;
using FoodieFriends.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Services;

public class TrendingService
{
    private readonly FoodieFriendsDbContext _context;

    public TrendingService(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    public async Task<List<TrendingFeedItemDto>> GetTrendingAsync(int? cityId, int limit = 5)
    {
        var query = _context.Restaurants
            .Include(r => r.Reviews)
            .Include(r => r.WantToTryEntries)
            .AsQueryable();

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(r => r.MunicipalityId == cityId.Value);
        }

        var restaurants = await query.ToListAsync();
        if (restaurants.Count == 0)
        {
            return new List<TrendingFeedItemDto>();
        }

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

        var stats = restaurants.Select(r =>
        {
            var recentReviews = r.Reviews.Where(rev => rev.CreatedAt >= thirtyDaysAgo).ToList();
            if (recentReviews.Count == 0)
            {
                // Fallback to all reviews for prototype if no recent reviews
                recentReviews = r.Reviews.ToList();
            }

            var reviewCount = recentReviews.Count;
            var avgRating = reviewCount > 0 ? (double)recentReviews.Average(rev => rev.Rating) : (double)r.AverageRating;
            var wantCount = r.WantToTryEntries.Count;
            var uniqueReviewers = recentReviews.Select(rev => rev.UserId).Distinct().Count();

            return new
            {
                Restaurant = r,
                ReviewCount = reviewCount,
                AvgRating = avgRating,
                WantCount = wantCount,
                UniqueReviewers = uniqueReviewers
            };
        }).ToList();

        var maxReviews = Math.Max(1, stats.Max(s => s.ReviewCount));
        var maxWants = Math.Max(1, stats.Max(s => s.WantCount));
        var maxReviewers = Math.Max(1, stats.Max(s => s.UniqueReviewers));

        var ranked = stats.Select(s =>
        {
            // TrendScore = 0.35 * NormalisedReviewCount + 0.25 * AverageRecentRating + 0.20 * NormalisedWantToTryAdds + 0.20 * NormalisedUniqueReviewers
            var normReviews = (double)s.ReviewCount / maxReviews;
            var normRating = s.AvgRating / 10.0;
            var normWants = (double)s.WantCount / maxWants;
            var normReviewers = (double)s.UniqueReviewers / maxReviewers;

            var score = (0.35 * normReviews) + (0.25 * normRating) + (0.20 * normWants) + (0.20 * normReviewers);

            return new
            {
                s.Restaurant,
                Score = score,
                s.AvgRating,
                s.ReviewCount
            };
        })
        .OrderByDescending(x => x.Score)
        .ThenByDescending(x => x.AvgRating)
        .Take(limit)
        .ToList();

        var result = new List<TrendingFeedItemDto>();
        for (int i = 0; i < ranked.Count; i++)
        {
            var item = ranked[i];
            result.Add(new TrendingFeedItemDto(
                Rank: i + 1,
                RestaurantId: item.Restaurant.Id,
                Name: item.Restaurant.Name,
                CuisineType: item.Restaurant.CuisineType,
                AverageRating: Math.Round((decimal)item.AvgRating, 1),
                ReviewCount: item.ReviewCount > 0 ? item.ReviewCount : item.Restaurant.TotalReviews
            ));
        }

        return result;
    }
}
