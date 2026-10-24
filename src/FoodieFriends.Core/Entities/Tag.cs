namespace FoodieFriends.Core.Entities;

/// <summary>
/// Predefined tag/label for restaurant reviews (e.g., "Great for dates", "Outdoor seating").
/// </summary>
public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
