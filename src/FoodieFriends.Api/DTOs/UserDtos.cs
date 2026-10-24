namespace FoodieFriends.Api.DTOs;

public record UserProfileDto(
    Guid Id,
    string Username,
    string DisplayName,
    string Email,
    string? ProfilePhotoUrl,
    string? Bio,
    int CityId,
    string? CityName,
    string? CountryCode,
    int ReviewCount,
    int FollowingCount,
    int FollowersCount,
    bool IsFollowing,
    bool IsMe
);

public record UpdateProfileDto(
    string? DisplayName,
    string? Bio,
    string? ProfilePhotoUrl,
    int? CityId
);

public record UserSummaryDto(
    Guid Id,
    string Username,
    string DisplayName,
    string? ProfilePhotoUrl,
    string? CityName,
    bool IsFollowing,
    int MutualFollowersCount
);
