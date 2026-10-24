namespace FoodieFriends.Api.DTOs;

public record RestaurantDto(
    Guid Id,
    string Name,
    string Address,
    decimal? Latitude,
    decimal? Longitude,
    int MunicipalityId,
    string CityName,
    string CuisineType,
    int PriceRange,
    string? WebsiteUrl,
    string? MenuUrl,
    string? CoverImageUrl,
    decimal AverageRating,
    int TotalReviews,
    DateOnly? OpenedDate,
    bool IsNew,
    int FriendsReviewCount,
    decimal? FriendAverageRating,
    bool IsWantToTry
);

public record CategoryDto(
    string Name,
    string Slug,
    int Count
);
