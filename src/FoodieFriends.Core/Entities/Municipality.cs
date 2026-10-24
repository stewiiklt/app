namespace FoodieFriends.Core.Entities;

/// <summary>
/// Represents a city or municipality within a country.
/// </summary>
public class Municipality
{
    public int Id { get; set; }

    /// <summary>
    /// Name of the municipality or city (e.g. Oslo, Stockholm).
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Foreign key to Country.
    /// </summary>
    public string CountryCode { get; set; } = string.Empty;

    public Country Country { get; set; } = null!;

    public ICollection<User> Users { get; set; } = new List<User>();

    public ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
}
