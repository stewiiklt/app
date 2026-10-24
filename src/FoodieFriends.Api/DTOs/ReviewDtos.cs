using FoodieFriends.Core.Enums;

namespace FoodieFriends.Api.DTOs;

public record CreateReviewPhotoDto(
    string Url,
    string? Caption,
    int Order
);

public record CreateReviewDto(
    Guid RestaurantId,
    int Rating,
    string Title,
    string Body,
    int PriceRangeIndicator,
    ReviewVisibility Visibility,
    List<int>? TagIds,
    List<CreateReviewPhotoDto>? Photos
);

public record ReviewPhotoDto(
    Guid Id,
    string Url,
    string? Caption,
    int Order
);

public record ReviewUserSummaryDto(
    Guid Id,
    string Username,
    string DisplayName,
    string? ProfilePhotoUrl
);

public record ReviewRestaurantSummaryDto(
    Guid Id,
    string Name,
    string CuisineType,
    string CityName,
    bool IsNew
);

public record ReviewDto(
    Guid Id,
    DateTime CreatedAt,
    ReviewUserSummaryDto User,
    ReviewRestaurantSummaryDto Restaurant,
    int Rating,
    string Title,
    string Body,
    int VisitNumber,
    int PriceRange,
    string Visibility,
    List<ReviewPhotoDto> Photos,
    List<string> Tags,
    int LikeCount,
    int CommentCount,
    bool IsLikedByMe
);

public record CommentDto(
    Guid Id,
    Guid ReviewId,
    Guid UserId,
    string Username,
    string DisplayName,
    string? ProfilePhotoUrl,
    string Content,
    DateTime CreatedAt
);

public record CreateCommentDto(
    string Content
);
