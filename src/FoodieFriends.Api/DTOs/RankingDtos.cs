namespace FoodieFriends.Api.DTOs;

public record RankingRestaurantDto(
    int Rank,
    Guid Id,
    string Name,
    string Address,
    string CuisineType,
    int PriceRange,
    string? CoverImageUrl,
    decimal AverageRating,
    int TotalReviews,
    bool IsNew,
    int FriendReviewCount,
    decimal? FriendAverageRating
);
