namespace FoodieFriends.Core.Entities;

/// <summary>
/// Bookmark entry representing a restaurant a user wants to try.
/// </summary>
public class WantToTry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User? User { get; set; }

    public Guid RestaurantId { get; set; }

    public Restaurant? Restaurant { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
