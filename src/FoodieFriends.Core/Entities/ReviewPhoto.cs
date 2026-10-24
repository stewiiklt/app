namespace FoodieFriends.Core.Entities;

/// <summary>
/// Photograph attached to a restaurant review.
/// </summary>
public class ReviewPhoto
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ReviewId { get; set; }

    public Review? Review { get; set; }

    /// <summary>
    /// Path or URL to the photo.
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// Optional caption describing the photo or dish.
    /// </summary>
    public string? Caption { get; set; }

    /// <summary>
    /// Display sort order among photos for the review.
    /// </summary>
    public int Order { get; set; } = 0;
}
