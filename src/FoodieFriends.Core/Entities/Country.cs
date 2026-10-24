namespace FoodieFriends.Core.Entities;

/// <summary>
/// Represents a country in the Scandinavian region.
/// </summary>
public class Country
{
    /// <summary>
    /// Two-letter ISO country code (e.g. NO, SE, DK, FI, IS).
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Country name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Flag emoji representation (e.g. "🇳🇴").
    /// </summary>
    public string FlagEmoji { get; set; } = string.Empty;

    /// <summary>
    /// Municipalities belonging to this country.
    /// </summary>
    public ICollection<Municipality> Municipalities { get; set; } = new List<Municipality>();
}
