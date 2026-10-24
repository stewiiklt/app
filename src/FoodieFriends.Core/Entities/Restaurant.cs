namespace FoodieFriends.Core.Entities;

/// <summary>
/// Restaurant entity representing dining locations reviewed by foodies.
/// </summary>
public class Restaurant
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public int MunicipalityId { get; set; }

    public Municipality? Municipality { get; set; }

    /// <summary>
    /// Cuisine type such as "Italian", "Nordic", "Japanese", "Burgers".
    /// </summary>
    public string CuisineType { get; set; } = string.Empty;

    /// <summary>
    /// Price range from 1 (Budget $) to 4 (Luxury $$$$).
    /// </summary>
    public int PriceRange { get; set; } = 2;

    public string? WebsiteUrl { get; set; }

    public string? MenuUrl { get; set; }

    public string? CoverImageUrl { get; set; }

    /// <summary>
    /// Denormalized average rating score (1.0 to 10.0).
    /// </summary>
    public decimal AverageRating { get; set; } = 0m;

    /// <summary>
    /// Denormalized total review count.
    /// </summary>
    public int TotalReviews { get; set; } = 0;

    /// <summary>
    /// When the restaurant opened. Used for "New" badge (opened within 6 months).
    /// </summary>
    public DateOnly? OpenedDate { get; set; }

    /// <summary>
    /// Whether the restaurant is considered newly opened (opened within the last 6 months).
    /// </summary>
    public bool IsNew => OpenedDate.HasValue
        && OpenedDate.Value >= DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public ICollection<WantToTry> WantToTryEntries { get; set; } = new List<WantToTry>();

    public ICollection<TrendingRestaurant> TrendingRecords { get; set; } = new List<TrendingRestaurant>();
}
