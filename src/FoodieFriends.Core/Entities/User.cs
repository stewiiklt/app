namespace FoodieFriends.Core.Entities;

/// <summary>
/// Application user account and social profile.
/// </summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Unique username handle without spaces (e.g. "anna_oslo").
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Full display name (e.g. "Anna Johansen").
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? ProfilePhotoUrl { get; set; }

    public string? Bio { get; set; }

    /// <summary>
    /// Home city / municipality ID.
    /// </summary>
    public int CityId { get; set; }

    public Municipality? City { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public ICollection<Follow> Following { get; set; } = new List<Follow>();

    public ICollection<Follow> Followers { get; set; } = new List<Follow>();

    public ICollection<WantToTry> WantToTryList { get; set; } = new List<WantToTry>();

    public ICollection<ReviewLike> Likes { get; set; } = new List<ReviewLike>();

    public ICollection<ReviewComment> Comments { get; set; } = new List<ReviewComment>();

    public ICollection<Notification> ReceivedNotifications { get; set; } = new List<Notification>();

    public ICollection<Notification> TriggeredNotifications { get; set; } = new List<Notification>();
}
