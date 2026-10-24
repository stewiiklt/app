using FoodieFriends.Core.Enums;

namespace FoodieFriends.Api.DTOs;

public record NotificationDto(
    Guid Id,
    Guid UserId,
    Guid ActorId,
    string ActorUsername,
    string ActorDisplayName,
    string? ActorProfilePhotoUrl,
    NotificationType Type,
    string TypeName,
    Guid? ReviewId,
    Guid? RestaurantId,
    string? RestaurantName,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);
