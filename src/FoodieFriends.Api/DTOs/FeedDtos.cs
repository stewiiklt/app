namespace FoodieFriends.Api.DTOs;

public record FeedItemDto(
    string Type, // "review", "wantToTry", "trending"
    Guid Id,
    DateTime CreatedAt,
    ReviewUserSummaryDto? User,
    FeedRestaurantSummaryDto? Restaurant,
    FeedReviewDetailsDto? Review,
    TrendingFeedDetailsDto? Trending
);

public record FeedRestaurantSummaryDto(
    Guid Id,
    string Name,
    string CuisineType,
    string? CityName,
    decimal? AverageRating,
    bool IsNew
);

public record FeedReviewDetailsDto(
    int Rating,
    string Title,
    string Body,
    string BodyPreview,
    int VisitNumber,
    int PriceRange,
    string Visibility,
    List<ReviewPhotoDto> Photos,
    List<string> Tags,
    int LikeCount,
    int CommentCount,
    bool IsLikedByMe
);

public record TrendingFeedItemDto(
    int Rank,
    Guid RestaurantId,
    string Name,
    string CuisineType,
    decimal AverageRating,
    int ReviewCount
);

public record TrendingFeedDetailsDto(
    string CityName,
    List<TrendingFeedItemDto> Restaurants
);

public record FeedResponseDto(
    List<FeedItemDto> Items,
    string? NextCursor,
    bool HasMore
);
