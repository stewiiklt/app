namespace FoodieFriends.Core.Entities;

/// <summary>
/// Comment left on a review. Visibility restricted according to mutual friend logic.
/// </summary>
public class ReviewComment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ReviewId { get; set; }

    public Review? Review { get; set; }

    public Guid UserId { get; set; }

    public User? User { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
