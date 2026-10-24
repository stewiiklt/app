namespace FoodieFriends.Api.DTOs;

public record WantToTryRestaurantDto(
    Guid Id,
    string Name,
    string Address,
    string CuisineType,
    int PriceRange,
    string? CoverImageUrl,
    decimal AverageRating,
    int TotalReviews,
    bool IsNew,
    string CityName
);

public record WantToTryDto(
    Guid Id,
    Guid UserId,
    string Username,
    string DisplayName,
    Guid RestaurantId,
    WantToTryRestaurantDto Restaurant,
    DateTime CreatedAt
);
