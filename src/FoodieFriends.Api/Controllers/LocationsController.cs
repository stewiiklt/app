using FoodieFriends.Api.DTOs;
using FoodieFriends.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly FoodieFriendsDbContext _context;

    public LocationsController(FoodieFriendsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/locations/countries - List Scandinavian countries.
    /// </summary>
    [HttpGet("countries")]
    public async Task<ActionResult<List<CountryDto>>> GetCountries()
    {
        var countries = await _context.Countries
            .Include(c => c.Municipalities)
            .OrderBy(c => c.Name)
            .Select(c => new CountryDto(
                c.Code,
                c.Name,
                c.FlagEmoji,
                c.Municipalities.Count
            ))
            .ToListAsync();

        return Ok(countries);
    }

    /// <summary>
    /// GET /api/locations/cities?country=NO - List cities/municipalities for a country.
    /// </summary>
    [HttpGet("cities")]
    public async Task<ActionResult<List<CityDto>>> GetCities([FromQuery] string? country)
    {
        var query = _context.Municipalities
            .Include(m => m.Country)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(country))
        {
            var code = country.Trim().ToUpperInvariant();
            query = query.Where(m => m.CountryCode == code);
        }

        var cities = await query
            .OrderBy(m => m.Name)
            .Select(m => new CityDto(
                m.Id,
                m.Name,
                m.CountryCode,
                m.Country.Name
            ))
            .ToListAsync();

        return Ok(cities);
    }
}
