namespace FoodieFriends.Core.Entities;

/// <summary>
/// Precomputed or cached trending restaurant record per municipality.
/// </summary>
public class TrendingRestaurant
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid RestaurantId { get; set; }

    public Restaurant? Restaurant { get; set; }

    public int MunicipalityId { get; set; }

    public Municipality? Municipality { get; set; }

    public double Score { get; set; }

    public int Rank { get; set; }

    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}
