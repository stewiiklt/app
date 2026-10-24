namespace FoodieFriends.Core.Entities;

/// <summary>
/// Directional follow relationship between two users (Instagram style).
/// </summary>
public class Follow
{
    public Guid FollowerId { get; set; }

    public User? Follower { get; set; }

    public Guid FolloweeId { get; set; }

    public User? Followee { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
