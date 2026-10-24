using FoodieFriends.Core.Enums;

namespace FoodieFriends.Core.Entities;

/// <summary>
/// Review written by a user for a restaurant visit.
/// </summary>
public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User? User { get; set; }

    public Guid RestaurantId { get; set; }

    public Restaurant? Restaurant { get; set; }

    /// <summary>
    /// Rating score from 1 to 10.
    /// </summary>
    public int Rating { get; set; }

    /// <summary>
    /// Review headline or title, including visit number suffix if visit > 1 (e.g. "Amazing pasta (#2)").
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detailed text body of the review.
    /// </summary>
    public string Body { get; set; } = string.Empty;

    /// <summary>
    /// Auto-calculated visit index for this specific user & restaurant.
    /// </summary>
    public int VisitNumber { get; set; } = 1;

    /// <summary>
    /// Public or FriendsOnly visibility.
    /// </summary>
    public ReviewVisibility Visibility { get; set; } = ReviewVisibility.Public;

    /// <summary>
    /// Price range indicator assessed during this specific visit (1-4).
    /// </summary>
    public int PriceRangeIndicator { get; set; } = 2;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<ReviewPhoto> Photos { get; set; } = new List<ReviewPhoto>();

    public ICollection<ReviewLike> Likes { get; set; } = new List<ReviewLike>();

    public ICollection<ReviewComment> Comments { get; set; } = new List<ReviewComment>();

    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
