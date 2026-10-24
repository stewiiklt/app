namespace FoodieFriends.Api.DTOs;

public record CountryDto(
    string Code,
    string Name,
    string FlagEmoji,
    int CityCount
);

public record CityDto(
    int Id,
    string Name,
    string CountryCode,
    string CountryName
);
