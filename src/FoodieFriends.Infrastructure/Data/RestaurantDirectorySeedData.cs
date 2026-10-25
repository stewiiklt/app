using FoodieFriends.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Infrastructure.Data;

/// <summary>
/// Adds a synthetic restaurant directory to every supported municipality.
/// These entries intentionally carry no photos, ratings, review counts, or precise
/// street addresses because they are fictional prototype data.
/// </summary>
internal static class RestaurantDirectorySeedData
{
    private sealed record Entry(int MunicipalityId, string Name, string Cuisine);

    // Names are fictional seed data; cuisine labels provide variety in the prototype.
    // Keep the list at ten per supported municipality. Seed-data notes are documented in
    // Documentation/RESTAURANT_DIRECTORY_SOURCES.md.
    private static readonly Entry[] Entries = Parse("""
1|Willowwhisk|Nordic
1|Willowbowl|Nordic
1|Willowtable|Nordic
1|Willowpantry|Japanese
1|Willowhearth|Nordic
1|Willowgarden|Nordic
1|Willowspoon|Seafood
1|Willowkitchen|Nordic
1|Willowplate|French
1|Willowfold|Nordic
2|Copperwhisk|Nordic
2|Copperbowl|Nordic
2|Coppertable|Japanese
2|Copperpantry|Nordic
2|Copperhearth|Seafood
2|Coppergarden|Norwegian
2|Copperspoon|Norwegian
2|Copperkitchen|Nordic
2|Copperplate|Norwegian
2|Copperfold|Norwegian
3|Lanternwhisk|Nordic
3|Lanternbowl|Nordic
3|Lanterntable|Plant-based
3|Lanternpantry|Grill
3|Lanternhearth|Nordic
3|Lanterngarden|Seafood
3|Lanternspoon|Nordic
3|Lanternkitchen|Nordic
3|Lanternplate|Italian
3|Lanternfold|Nordic
4|Meadowwhisk|Nordic
4|Meadowbowl|Nordic
4|Meadowtable|Nordic
4|Meadowpantry|Norwegian
4|Meadowhearth|Nordic
4|Meadowgarden|Seafood
4|Meadowspoon|Norwegian
4|Meadowkitchen|Nordic
4|Meadowplate|Italian
4|Meadowfold|Italian
5|Juniperwhisk|Seafood
5|Juniperbowl|Norwegian
5|Junipertable|Spanish
5|Juniperpantry|Nordic
5|Juniperhearth|German
5|Junipergarden|Mexican
5|Juniperspoon|Indian
5|Juniperkitchen|Indian
5|Juniperplate|Italian
5|Juniperfold|Vietnamese
6|Amberwhisk|Nordic
6|Amberbowl|Nordic
6|Ambertable|Nordic
6|Amberpantry|Nordic
6|Amberhearth|Nordic
6|Ambergarden|Nordic
6|Amberspoon|Japanese
6|Amberkitchen|Japanese
6|Amberplate|Seafood
6|Amberfold|Swedish
7|Silverwhisk|Nordic
7|Silverbowl|Nordic
7|Silvertable|French
7|Silverpantry|Japanese
7|Silverhearth|Swedish
7|Silvergarden|Nordic
7|Silverspoon|Japanese
7|Silverkitchen|Nordic
7|Silverplate|French
7|Silverfold|Swedish
8|Cloudwhisk|Nordic
8|Cloudbowl|Nordic
8|Cloudtable|Nordic
8|Cloudpantry|Nordic
8|Cloudhearth|Nordic
8|Cloudgarden|Nordic
8|Cloudspoon|Korean
8|Cloudkitchen|French
8|Cloudplate|Nordic
8|Cloudfold|Nordic
9|Velvetwhisk|Seafood
9|Velvetbowl|Nordic
9|Velvettable|Nordic
9|Velvetpantry|Nordic
9|Velvethearth|Asian
9|Velvetgarden|Asian
9|Velvetspoon|Italian
9|Velvetkitchen|Seafood
9|Velvetplate|Nordic
9|Velvetfold|Swedish
10|Pebblewhisk|Nordic
10|Pebblebowl|Swedish
10|Pebbletable|Italian
10|Pebblepantry|Mexican
10|Pebblehearth|Nordic
10|Pebblegarden|Burgers
10|Pebblespoon|Indian
10|Pebblekitchen|Nordic
10|Pebbleplate|Italian
10|Pebblefold|Nordic
11|Hearthwhisk|Nordic
11|Hearthbowl|Nordic
11|Hearthtable|Nordic
11|Hearthpantry|Nordic
11|Hearthhearth|Nordic
11|Hearthgarden|Nordic
11|Hearthspoon|Asian
11|Hearthkitchen|Nordic
11|Hearthplate|Danish
11|Hearthfold|Nordic
12|Fablewhisk|Nordic
12|Fablebowl|Nordic
12|Fabletable|Nordic
12|Fablepantry|Nordic
12|Fablehearth|Nordic
12|Fablegarden|French
12|Fablespoon|French
12|Fablekitchen|Seafood
12|Fableplate|European
12|Fablefold|Steakhouse
13|Apricotwhisk|Nordic
13|Apricotbowl|Danish
13|Apricottable|Danish
13|Apricotpantry|Nordic
13|Apricothearth|Danish
13|Apricotgarden|French
13|Apricotspoon|Japanese
13|Apricotkitchen|Italian
13|Apricotplate|Danish
13|Apricotfold|Nordic
14|Mosswhisk|Nordic
14|Mossbowl|Nordic
14|Mosstable|Nordic
14|Mosspantry|Nordic
14|Mosshearth|Asian
14|Mossgarden|Nordic
14|Mossspoon|Nordic
14|Mosskitchen|Nordic
14|Mossplate|Seafood
14|Mossfold|Danish
15|Honeywhisk|Danish
15|Honeybowl|Danish
15|Honeytable|Nordic
15|Honeypantry|Nordic
15|Honeyhearth|Seafood
15|Honeygarden|Brewpub
15|Honeyspoon|Danish
15|Honeykitchen|Indian
15|Honeyplate|Italian
15|Honeyfold|Cafe
16|Wildwhisk|Nordic
16|Wildbowl|Nordic
16|Wildtable|Nordic
16|Wildpantry|Nordic
16|Wildhearth|Finnish
16|Wildgarden|Nordic
16|Wildspoon|Nordic
16|Wildkitchen|Finnish
16|Wildplate|Nordic
16|Wildfold|Nordic
17|Kindredwhisk|Nordic
17|Kindredbowl|Seafood
17|Kindredtable|Nordic
17|Kindredpantry|Nordic
17|Kindredhearth|Nordic
17|Kindredgarden|Nordic
17|Kindredspoon|Steakhouse
17|Kindredkitchen|Finnish
17|Kindredplate|Finnish
17|Kindredfold|Italian
18|Mellowwhisk|Nordic
18|Mellowbowl|Nordic
18|Mellowtable|Nordic
18|Mellowpantry|Seafood
18|Mellowhearth|Nordic
18|Mellowgarden|French
18|Mellowspoon|Nordic
18|Mellowkitchen|Nordic
18|Mellowplate|Japanese
18|Mellowfold|Nordic
19|Fernwhisk|Nordic
19|Fernbowl|Finnish
19|Ferntable|Nordic
19|Fernpantry|Burgers
19|Fernhearth|Nordic
19|Ferngarden|Seafood
19|Fernspoon|Nordic
19|Fernkitchen|Burgers
19|Fernplate|Nordic
19|Fernfold|Grill
20|Orchardwhisk|Nordic
20|Orchardbowl|Spanish
20|Orchardtable|Nordic
20|Orchardpantry|Nordic
20|Orchardhearth|Nordic
20|Orchardgarden|Spanish
20|Orchardspoon|Finnish
20|Orchardkitchen|Georgian
20|Orchardplate|Finnish
20|Orchardfold|Steakhouse
21|Bluewhisk|Nordic
21|Bluebowl|Icelandic
21|Bluetable|Seafood
21|Bluepantry|Seafood
21|Bluehearth|Icelandic
21|Bluegarden|Nordic
21|Bluespoon|Middle Eastern
21|Bluekitchen|Nordic
21|Blueplate|Icelandic
21|Bluefold|Street Food
22|Paperwhisk|Icelandic
22|Paperbowl|French
22|Papertable|Japanese
22|Paperpantry|Mexican
22|Paperhearth|Italian
22|Papergarden|Italian
22|Paperspoon|Indian
22|Paperkitchen|Japanese
22|Paperplate|Chicken
22|Paperfold|Cafe
23|Sunlitwhisk|Nordic
23|Sunlitbowl|Asian
23|Sunlittable|Nordic
23|Sunlitpantry|Icelandic
23|Sunlithearth|Asian
23|Sunlitgarden|Icelandic
23|Sunlitspoon|Plant-based
23|Sunlitkitchen|Icelandic
23|Sunlitplate|Seafood
23|Sunlitfold|Brewpub
24|Winterwhisk|Seafood
24|Winterbowl|Italian
24|Wintertable|Seafood
24|Winterpantry|Nordic
24|Winterhearth|Seafood
24|Wintergarden|Icelandic
24|Winterspoon|Thai
24|Winterkitchen|Italian
24|Winterplate|Indian
24|Winterfold|Burgers
25|Littlewhisk|Japanese
25|Littlebowl|Nordic
25|Littletable|Nordic
25|Littlepantry|Icelandic
25|Littlehearth|Icelandic
25|Littlegarden|European
25|Littlespoon|Thai
25|Littlekitchen|Indian
25|Littleplate|Nordic
25|Littlefold|Nordic
""");

    public static async Task EnsureAsync(FoodieFriendsDbContext context)
    {
        var existing = await context.Restaurants.ToListAsync();

        var countryCodes = await context.Municipalities
            .AsNoTracking()
            .ToDictionaryAsync(municipality => municipality.Id, municipality => municipality.CountryCode);

        // Rename the previous ten-per-city directory in place so an existing local
        // database does not retain real venue names or duplicate the new fixtures.
        foreach (var group in Entries.GroupBy(entry => entry.MunicipalityId))
        {
            if (!countryCodes.TryGetValue(group.Key, out var countryCode))
            {
                continue;
            }

            var expectedAddress = $"{CityName(group.Key)}, {countryCode}";
            var previousSeedRows = existing
                .Where(restaurant => restaurant.MunicipalityId == group.Key
                    && restaurant.Address == expectedAddress
                    && restaurant.WebsiteUrl == null
                    && restaurant.CoverImageUrl == null
                    && restaurant.AverageRating == 0m
                    && restaurant.TotalReviews == 0
                    && restaurant.PriceRange == 2)
                .OrderBy(restaurant => restaurant.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray();
            var replacements = group
                .OrderBy(entry => entry.Name, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            if (previousSeedRows.Length != replacements.Length)
            {
                continue;
            }

            for (var index = 0; index < replacements.Length; index++)
            {
                previousSeedRows[index].Name = replacements[index].Name;
                previousSeedRows[index].CuisineType = replacements[index].Cuisine;
            }
        }

        var known = existing
            .Select(restaurant => (restaurant.MunicipalityId, restaurant.Name.Trim()))
            .ToHashSet(new MunicipalityNameComparer());

        var additions = Entries
            .Where(entry => countryCodes.ContainsKey(entry.MunicipalityId))
            .Where(entry => known.Add((entry.MunicipalityId, entry.Name)))
            .Select(entry => new Restaurant
            {
                Name = entry.Name,
                Address = $"{context.Municipalities.Local.FirstOrDefault(m => m.Id == entry.MunicipalityId)?.Name ?? CityName(entry.MunicipalityId)}, {countryCodes[entry.MunicipalityId]}",
                MunicipalityId = entry.MunicipalityId,
                CuisineType = entry.Cuisine,
                PriceRange = 2,
                AverageRating = 0m,
                TotalReviews = 0
            })
            .ToList();

        if (additions.Count == 0)
        {
            return;
        }

        await context.Restaurants.AddRangeAsync(additions);
        await context.SaveChangesAsync();
    }

    private static Entry[] Parse(string source) => source
        .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        .Select(line => line.Split('|', 3))
        .Select(parts => new Entry(int.Parse(parts[0]), parts[1], parts[2]))
        .ToArray();

    private static string CityName(int id) => id switch
    {
        1 => "Oslo", 2 => "Bergen", 3 => "Stavanger", 4 => "Trondheim", 5 => "Drammen",
        6 => "Stockholm", 7 => "Gothenburg", 8 => "Malmö", 9 => "Uppsala", 10 => "Västerås",
        11 => "Copenhagen", 12 => "Aarhus", 13 => "Odense", 14 => "Aalborg", 15 => "Esbjerg",
        16 => "Helsinki", 17 => "Tampere", 18 => "Turku", 19 => "Oulu", 20 => "Jyväskylä",
        21 => "Reykjavík", 22 => "Kópavogur", 23 => "Hafnarfjörður", 24 => "Reykjanesbær", 25 => "Akureyri",
        _ => throw new ArgumentOutOfRangeException(nameof(id), id, "Unknown municipality")
    };

    private sealed class MunicipalityNameComparer : IEqualityComparer<(int MunicipalityId, string Name)>
    {
        public bool Equals((int MunicipalityId, string Name) x, (int MunicipalityId, string Name) y) =>
            x.MunicipalityId == y.MunicipalityId && StringComparer.OrdinalIgnoreCase.Equals(x.Name, y.Name);

        public int GetHashCode((int MunicipalityId, string Name) value) =>
            HashCode.Combine(value.MunicipalityId, StringComparer.OrdinalIgnoreCase.GetHashCode(value.Name));
    }
}
