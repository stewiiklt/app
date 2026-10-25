using FoodieFriends.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Infrastructure.Data;

/// <summary>
/// Adds a real, curated restaurant directory to every supported municipality.
/// These entries intentionally carry no photos, ratings, review counts, or precise
/// street addresses unless those values are collected from a trusted source.
/// </summary>
internal static class RestaurantDirectorySeedData
{
    private sealed record Entry(int MunicipalityId, string Name, string Cuisine);

    // Name and cuisine labels are a curated starter directory, not endorsements.
    // Keep the list at ten per supported municipality; source guides are documented in
    // Documentation/RESTAURANT_DIRECTORY_SOURCES.md.
    private static readonly Entry[] Entries = Parse("""
1|Maaemo|Nordic
1|Kontrast|Nordic
1|Statholdergaarden|Nordic
1|Sabi Omakase Oslo|Japanese
1|Arakataka|Nordic
1|Smalhans|Nordic
1|Lofoten Fiskerestaurant|Seafood
1|Eero|Nordic
1|Brasserie Hansken|French
1|Vaaghals|Nordic
2|Lysverket|Nordic
2|Gaptrast|Nordic
2|Omakase by Sergey Pak|Japanese
2|Allmuen Bistro|Nordic
2|Enhjørningen|Seafood
2|Bryggeloftet & Stuene|Norwegian
2|To Kokker|Norwegian
2|Colonialen Sann|Nordic
2|Marg & Bein|Norwegian
2|Pingvinen|Norwegian
3|RE-NAA|Nordic
3|Hermetikken|Nordic
3|Bellies|Plant-based
3|A. Idsøe Grill & Berkel|Grill
3|Gaffel & Karaffel|Nordic
3|Fisketorget Stavanger|Seafood
3|Spiseriet|Nordic
3|Matmagasinet|Nordic
3|Sirkus Renaa|Italian
3|Bravo|Nordic
4|Speilsalen|Nordic
4|Fagn|Nordic
4|Fagn Bistro|Nordic
4|Bakklandet Skydsstation|Norwegian
4|To Rom og Kjøkken|Nordic
4|Havfruen|Seafood
4|Troll Restaurant|Norwegian
4|Sellanraa|Nordic
4|Frati|Italian
4|Una Pizzeria e Bar|Italian
5|Skutebrygga|Seafood
5|Vertshuset Oscar & Stallen|Norwegian
5|Anchas Bodega|Spanish
5|Litt Kaos|Nordic
5|Alpenhaus Drammen|German
5|Mesa Libre|Mexican
5|Masalabar|Indian
5|Taj Mahal|Indian
5|That’s Amore|Italian
5|Mekong Kjøkken|Vietnamese
6|Frantzén|Nordic
6|AIRA|Nordic
6|Adam Albin|Nordic
6|Ekstedt|Nordic
6|Operakällaren|Nordic
6|Nour|Nordic
6|Dashi|Japanese
6|Sushi Sho|Japanese
6|Sturehof|Seafood
6|Pelikan|Swedish
7|Koka|Nordic
7|Project|Nordic
7|Restaurang 28+|French
7|Hoze|Japanese
7|SK Mat & Människor|Swedish
7|Bhoga|Nordic
7|Vrå|Japanese
7|Diket|Nordic
7|Bar La Lune|French
7|Familjen|Swedish
8|Vollmers|Nordic
8|Aster|Nordic
8|Ruths|Nordic
8|Lyran|Nordic
8|Västergatan|Nordic
8|Mutantur|Nordic
8|Namu|Korean
8|Bouchon|French
8|Atmosfär|Nordic
8|Saltimporten Canteen|Nordic
9|Hambergs Fisk|Seafood
9|Klostergatan 5|Nordic
9|Villa Anna|Nordic
9|Dryck & Mat|Nordic
9|Miss Voon|Asian
9|Jay Fu|Asian
9|Aaltos Italian Grill|Italian
9|Uppströms Fisk & Skaldjur|Seafood
9|Peppar Peppar|Nordic
9|Domtrappkällaren|Swedish
10|Frank|Nordic
10|Nya Hattfabriken|Swedish
10|Limone|Italian
10|Hermanas|Mexican
10|Djäknebergets Restaurang|Nordic
10|Bored Kitchen|Burgers
10|Naan Indisk Restaurang|Indian
10|Adam & Oliver|Nordic
10|Pärlan vedugnspizzeria & kolgrill|Italian
10|Stigen Västerås|Nordic
11|Geranium|Nordic
11|Kadeau|Nordic
11|Høst|Nordic
11|Alchemist|Nordic
11|Kong Hans Kælder|Nordic
11|AOC|Nordic
11|Koan|Asian
11|JATAK|Nordic
11|Schønnemann|Danish
11|Noma|Nordic
12|Frederikshøj|Nordic
12|Gastromé|Nordic
12|Domestic|Nordic
12|Substans|Nordic
12|Hærværk|Nordic
12|Restaurant ET|French
12|Klassisk 65|French
12|Mefisto|Seafood
12|Bardok|European
12|KöD Aarhus|Steakhouse
13|ARO|Nordic
13|HOS|Danish
13|Sortebro Kro|Danish
13|Det Glade Vanvid|Nordic
13|Oluf Bagers Gård|Danish
13|Kok & Vin|French
13|Goma|Japanese
13|I Pupi Siciliani|Italian
13|Den Gamle Kro|Danish
13|Restaurant Pasfall|Nordic
14|Alimentum|Nordic
14|Bühlmann|Nordic
14|Mortens Kro|Nordic
14|Restaurant Applaus|Nordic
14|Fusion|Asian
14|Struktur|Nordic
14|Textur|Nordic
14|Restaurant JØRN|Nordic
14|Fisk & Skaldyr|Seafood
14|Duus Vinkjælder|Danish
15|Restaurant Posten|Danish
15|Café Danmark|Danish
15|Restaurant Kunsten|Nordic
15|Appetiit|Nordic
15|Restaurant Strandpavillonen|Seafood
15|Esbjerg Bryghus|Brewpub
15|Spisestuen|Danish
15|Namaste Esbjerg|Indian
15|Taverna Famila|Italian
15|Bluesette Café|Cafe
16|Palace|Nordic
16|Grön|Nordic
16|Olo|Nordic
16|Demo|Nordic
16|Finnjävel Salon|Finnish
16|Nolla|Nordic
16|Natura|Nordic
16|Nokka|Finnish
16|Plein|Nordic
16|Kuurna|Nordic
17|Kajo|Nordic
17|Apaja|Seafood
17|Bertha|Nordic
17|LiV|Nordic
17|Saivo|Nordic
17|Näsinneula|Nordic
17|Huber|Steakhouse
17|4 Vuodenaikaa|Finnish
17|Tiiliholvi|Finnish
17|Pizzeria Napoli|Italian
18|Kaskis|Nordic
18|Mami|Nordic
18|Kakolanruusu|Nordic
18|Herkkunuotta|Seafood
18|Vinossa|Nordic
18|Brasserie Amelie|French
18|Roster|Nordic
18|Tintå|Nordic
18|Karu|Japanese
18|Smör|Nordic
19|Puistola|Nordic
19|Pannu|Finnish
19|Alfred Kitchen & Bar|Nordic
19|Cafe Rooster|Burgers
19|Oula Kitchen & Bar|Nordic
19|Nallikari|Seafood
19|VENN Oulu|Nordic
19|Kauppuri 5|Burgers
19|Ravintola Ule|Nordic
19|Grill Nordic|Grill
20|Figaro|Nordic
20|Cielo|Spanish
20|Harmooni|Nordic
20|Kuokkalan Kartanon Ravintola|Nordic
20|Bistro Kirkkopuisto|Nordic
20|La Brava Boqueria|Spanish
20|Kissanviikset|Finnish
20|Marani|Georgian
20|Sohwi|Finnish
20|Stefan’s Steakhouse Jyväskylä|Steakhouse
21|Dill|Nordic
21|Matur og Drykkur|Icelandic
21|Fiskfélagið|Seafood
21|Fish Market|Seafood
21|Grillmarkaðurinn|Icelandic
21|Apotek Kitchen + Bar|Nordic
21|Sumac|Middle Eastern
21|Tides|Nordic
21|Café Loki|Icelandic
21|Bæjarins Beztu Pylsur|Street Food
22|Krónikan|Icelandic
22|Brasserie Kársnes|French
22|Djúsí Sushi|Japanese
22|Serrano Smáralind|Mexican
22|Sbarro Smáralind|Italian
22|La Trattoria Smáralind|Italian
22|Funky Bhangra|Indian
22|Yuzu Smáralind|Japanese
22|Topwings Smáralind|Chicken
22|Hjá Höllu Smáralind|Cafe
23|Sól Restaurant|Nordic
23|Wok to Walk|Asian
23|Von Mathús & Bar|Nordic
23|Tilveran|Icelandic
23|KRYDD|Asian
23|A. Hansen|Icelandic
23|Loving Vegan|Plant-based
23|Fjörukráin|Icelandic
23|Rif Restaurant|Seafood
23|Ölhúsið Hafnarfjörður|Brewpub
24|Kaffi Duus|Seafood
24|Fernando’s|Italian
24|Ráin|Seafood
24|Kef Restaurant|Nordic
24|Fiskbarinn|Seafood
24|Langbest|Icelandic
24|Malai Thai|Thai
24|Antons Mamma Mia|Italian
24|Biryani|Indian
24|Hamborgarabúlla Tómasar|Burgers
25|Rub23|Japanese
25|LYST|Nordic
25|North Restaurant|Nordic
25|Greifinn|Icelandic
25|Bautinn|Icelandic
25|Akureyri Backpackers|European
25|Krua Siam|Thai
25|Indian Curry House|Indian
25|Strikið|Nordic
25|Mulaberg Bistro & Bar|Nordic
""");

    public static async Task EnsureAsync(FoodieFriendsDbContext context)
    {
        var existing = await context.Restaurants
            .AsNoTracking()
            .Select(restaurant => new { restaurant.MunicipalityId, restaurant.Name })
            .ToListAsync();
        var known = existing
            .Select(restaurant => (restaurant.MunicipalityId, restaurant.Name.Trim()))
            .ToHashSet(new MunicipalityNameComparer());

        var countryCodes = await context.Municipalities
            .AsNoTracking()
            .ToDictionaryAsync(municipality => municipality.Id, municipality => municipality.CountryCode);

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
