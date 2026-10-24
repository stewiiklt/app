using FoodieFriends.Core.Enums;

namespace FoodieFriends.Core.Entities;

/// <summary>
/// Social notification sent to a user.
/// </summary>
public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Recipient user who receives the notification.
    /// </summary>
    public Guid UserId { get; set; }

    public User? User { get; set; }

    /// <summary>
    /// Actor user who performed the action triggering the notification.
    /// </summary>
    public Guid ActorId { get; set; }

    public User? Actor { get; set; }

    /// <summary>
    /// Type of social notification.
    /// </summary>
    public NotificationType Type { get; set; }

    public Guid? ReviewId { get; set; }

    public Review? Review { get; set; }

    public Guid? RestaurantId { get; set; }

    public Restaurant? Restaurant { get; set; }

    /// <summary>
    /// Notification summary text.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
