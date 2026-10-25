using FoodieFriends.Core.Entities;
using FoodieFriends.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace FoodieFriends.Infrastructure.Data;

public static class SeedData
{
    public static readonly Guid DemoUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    public static async Task InitializeAsync(FoodieFriendsDbContext context)
    {
        // Check if database has already been seeded
        if (await context.Countries.AnyAsync())
        {
            // Keep the restaurant directory current for databases created by older versions.
            await RestaurantDirectorySeedData.EnsureAsync(context);
            return;
        }

        // 1. Countries (5 Scandinavian countries)
        var countries = new List<Country>
        {
            new Country { Code = "NO", Name = "Norway", FlagEmoji = "🇳🇴" },
            new Country { Code = "SE", Name = "Sweden", FlagEmoji = "🇸🇪" },
            new Country { Code = "DK", Name = "Denmark", FlagEmoji = "🇩🇰" },
            new Country { Code = "FI", Name = "Finland", FlagEmoji = "🇫🇮" },
            new Country { Code = "IS", Name = "Iceland", FlagEmoji = "🇮🇸" }
        };
        await context.Countries.AddRangeAsync(countries);
        await context.SaveChangesAsync();

        // 2. Municipalities (5 per country = 25)
        var municipalities = new List<Municipality>
        {
            // Norway
            new Municipality { Id = 1, Name = "Oslo", CountryCode = "NO" },
            new Municipality { Id = 2, Name = "Bergen", CountryCode = "NO" },
            new Municipality { Id = 3, Name = "Stavanger", CountryCode = "NO" },
            new Municipality { Id = 4, Name = "Trondheim", CountryCode = "NO" },
            new Municipality { Id = 5, Name = "Drammen", CountryCode = "NO" },

            // Sweden
            new Municipality { Id = 6, Name = "Stockholm", CountryCode = "SE" },
            new Municipality { Id = 7, Name = "Gothenburg", CountryCode = "SE" },
            new Municipality { Id = 8, Name = "Malmö", CountryCode = "SE" },
            new Municipality { Id = 9, Name = "Uppsala", CountryCode = "SE" },
            new Municipality { Id = 10, Name = "Västerås", CountryCode = "SE" },

            // Denmark
            new Municipality { Id = 11, Name = "Copenhagen", CountryCode = "DK" },
            new Municipality { Id = 12, Name = "Aarhus", CountryCode = "DK" },
            new Municipality { Id = 13, Name = "Odense", CountryCode = "DK" },
            new Municipality { Id = 14, Name = "Aalborg", CountryCode = "DK" },
            new Municipality { Id = 15, Name = "Esbjerg", CountryCode = "DK" },

            // Finland
            new Municipality { Id = 16, Name = "Helsinki", CountryCode = "FI" },
            new Municipality { Id = 17, Name = "Tampere", CountryCode = "FI" },
            new Municipality { Id = 18, Name = "Turku", CountryCode = "FI" },
            new Municipality { Id = 19, Name = "Oulu", CountryCode = "FI" },
            new Municipality { Id = 20, Name = "Jyväskylä", CountryCode = "FI" },

            // Iceland
            new Municipality { Id = 21, Name = "Reykjavík", CountryCode = "IS" },
            new Municipality { Id = 22, Name = "Kópavogur", CountryCode = "IS" },
            new Municipality { Id = 23, Name = "Hafnarfjörður", CountryCode = "IS" },
            new Municipality { Id = 24, Name = "Reykjanesbær", CountryCode = "IS" },
            new Municipality { Id = 25, Name = "Akureyri", CountryCode = "IS" }
        };
        await context.Municipalities.AddRangeAsync(municipalities);
        await context.SaveChangesAsync();

        // 3. Tags
        var tags = new List<Tag>
        {
            new Tag { Id = 1, Name = "Great for dates", Slug = "great-for-dates" },
            new Tag { Id = 2, Name = "Family friendly", Slug = "family-friendly" },
            new Tag { Id = 3, Name = "Best pizza", Slug = "best-pizza" },
            new Tag { Id = 4, Name = "Outdoor seating", Slug = "outdoor-seating" },
            new Tag { Id = 5, Name = "Great cocktails", Slug = "great-cocktails" },
            new Tag { Id = 6, Name = "Cozy vibe", Slug = "cozy-vibe" },
            new Tag { Id = 7, Name = "Vegan options", Slug = "vegan-options" },
            new Tag { Id = 8, Name = "Fine Dining", Slug = "fine-dining" },
            new Tag { Id = 9, Name = "Casual bite", Slug = "casual-bite" },
            new Tag { Id = 10, Name = "Late night", Slug = "late-night" }
        };
        await context.Tags.AddRangeAsync(tags);
        await context.SaveChangesAsync();

        // 4. Realistic Demo Users
        var u1Id = DemoUserId; // anna_oslo
        var u2Id = Guid.Parse("22222222-2222-2222-2222-222222222222"); // erik_bergen
        var u3Id = Guid.Parse("33333333-3333-3333-3333-333333333333"); // sofia_sthlm
        var u4Id = Guid.Parse("44444444-4444-4444-4444-444444444444"); // lukas_cph
        var u5Id = Guid.Parse("55555555-5555-5555-5555-555555555555"); // mikael_hki
        var u6Id = Guid.Parse("66666666-6666-6666-6666-666666666666"); // ingrid_oslo
        var u7Id = Guid.Parse("77777777-7777-7777-7777-777777777777"); // jonas_sthlm
        var u8Id = Guid.Parse("88888888-8888-8888-8888-888888888888"); // freja_cph
        var u9Id = Guid.Parse("99999999-9999-9999-9999-999999999999"); // katrin_rkv

        var users = new List<User>
        {
            new User
            {
                Id = u1Id,
                Username = "anna_oslo",
                DisplayName = "Anna Johansen",
                Email = "anna@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
                Bio = "Oslo coffee enthusiast & sourdough seeker. Always hunting the best natural wine and pasta.",
                CityId = 1, // Oslo
                CreatedAt = DateTime.UtcNow.AddMonths(-12)
            },
            new User
            {
                Id = u2Id,
                Username = "erik_bergen",
                DisplayName = "Erik Pedersen",
                Email = "erik@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                Bio = "Seafood fan and amateur chef based in Bergen. Rain or shine, I eat well.",
                CityId = 2, // Bergen
                CreatedAt = DateTime.UtcNow.AddMonths(-10)
            },
            new User
            {
                Id = u3Id,
                Username = "sofia_sthlm",
                DisplayName = "Sofia Lindqvist",
                Email = "sofia@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                Bio = "Stockholm foodie exploring cardamom buns, modern gastronomy, and hidden gems in Södermalm.",
                CityId = 6, // Stockholm
                CreatedAt = DateTime.UtcNow.AddMonths(-9)
            },
            new User
            {
                Id = u4Id,
                Username = "lukas_cph",
                DisplayName = "Lukas Møller",
                Email = "lukas@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                Bio = "Copenhagen cyclist, natural wine lover, and taco critic. Living in Vesterbro.",
                CityId = 11, // Copenhagen
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new User
            {
                Id = u5Id,
                Username = "mikael_hki",
                DisplayName = "Mikael Virtanen",
                Email = "mikael@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
                Bio = "Helsinki sauna aficionado and ramen lover. Nordic-Asian fusion is my jam.",
                CityId = 16, // Helsinki
                CreatedAt = DateTime.UtcNow.AddMonths(-7)
            },
            new User
            {
                Id = u6Id,
                Username = "ingrid_oslo",
                DisplayName = "Ingrid Haugen",
                Email = "ingrid@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
                Bio = "Architect by day, restaurant hopper by night in Grünerløkka and Frogner.",
                CityId = 1, // Oslo
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new User
            {
                Id = u7Id,
                Username = "jonas_sthlm",
                DisplayName = "Jonas Berg",
                Email = "jonas@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
                Bio = "Craft beer nerd & Neapolitan pizza obsessive in Vasastan.",
                CityId = 6, // Stockholm
                CreatedAt = DateTime.UtcNow.AddMonths(-5)
            },
            new User
            {
                Id = u8Id,
                Username = "freja_cph",
                DisplayName = "Freja Nielsen",
                Email = "freja@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
                Bio = "Plant-based dining explorer in Nørrebro. Pastries and specialty matcha.",
                CityId = 11, // Copenhagen
                CreatedAt = DateTime.UtcNow.AddMonths(-4)
            },
            new User
            {
                Id = u9Id,
                Username = "katrin_rkv",
                DisplayName = "Katrín Jónsdóttir",
                Email = "katrin@foodiefriends.io",
                ProfilePhotoUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
                Bio = "Reykjavík local passionate about arctic char, rye bread ice cream, and cozy bistro spots.",
                CityId = 21, // Reykjavík
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            }
        };
        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        // 5. Follows (Social Graph)
        // Anna follows: Erik, Sofia, Lukas, Ingrid
        // Erik follows: Anna, Sofia
        // Sofia follows: Anna, Jonas, Lukas
        // Lukas follows: Anna, Freja, Sofia
        // Ingrid follows: Anna, Jonas
        // Jonas follows: Sofia, Anna
        // Freja follows: Lukas, Anna
        // Katrin follows: Anna, Erik
        var follows = new List<Follow>
        {
            new Follow { FollowerId = u1Id, FolloweeId = u2Id, CreatedAt = DateTime.UtcNow.AddMonths(-6) },
            new Follow { FollowerId = u1Id, FolloweeId = u3Id, CreatedAt = DateTime.UtcNow.AddMonths(-6) },
            new Follow { FollowerId = u1Id, FolloweeId = u4Id, CreatedAt = DateTime.UtcNow.AddMonths(-5) },
            new Follow { FollowerId = u1Id, FolloweeId = u6Id, CreatedAt = DateTime.UtcNow.AddMonths(-4) },

            new Follow { FollowerId = u2Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-6) },
            new Follow { FollowerId = u2Id, FolloweeId = u3Id, CreatedAt = DateTime.UtcNow.AddMonths(-5) },

            new Follow { FollowerId = u3Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-6) },
            new Follow { FollowerId = u3Id, FolloweeId = u7Id, CreatedAt = DateTime.UtcNow.AddMonths(-5) },
            new Follow { FollowerId = u3Id, FolloweeId = u4Id, CreatedAt = DateTime.UtcNow.AddMonths(-4) },

            new Follow { FollowerId = u4Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-5) },
            new Follow { FollowerId = u4Id, FolloweeId = u8Id, CreatedAt = DateTime.UtcNow.AddMonths(-4) },
            new Follow { FollowerId = u4Id, FolloweeId = u3Id, CreatedAt = DateTime.UtcNow.AddMonths(-3) },

            new Follow { FollowerId = u6Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-4) },
            new Follow { FollowerId = u6Id, FolloweeId = u7Id, CreatedAt = DateTime.UtcNow.AddMonths(-3) },

            new Follow { FollowerId = u7Id, FolloweeId = u3Id, CreatedAt = DateTime.UtcNow.AddMonths(-5) },
            new Follow { FollowerId = u7Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-3) },

            new Follow { FollowerId = u8Id, FolloweeId = u4Id, CreatedAt = DateTime.UtcNow.AddMonths(-4) },
            new Follow { FollowerId = u8Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-2) },

            new Follow { FollowerId = u9Id, FolloweeId = u1Id, CreatedAt = DateTime.UtcNow.AddMonths(-2) },
            new Follow { FollowerId = u9Id, FolloweeId = u2Id, CreatedAt = DateTime.UtcNow.AddMonths(-2) }
        };
        await context.Follows.AddRangeAsync(follows);
        await context.SaveChangesAsync();

        // 6. Restaurants (20 across Oslo, Stockholm, Copenhagen, Bergen, Helsinki, Reykjavik)
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var r1 = new Restaurant
        {
            Id = Guid.Parse("a0000001-0000-0000-0000-000000000001"),
            Name = "Maaemo",
            Address = "Dronning Eufemias gate 23, 0194 Oslo",
            MunicipalityId = 1,
            CuisineType = "Nordic Fine Dining",
            PriceRange = 4,
            WebsiteUrl = "https://maaemo.no",
            CoverImageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
            OpenedDate = new DateOnly(2021, 3, 1),
            AverageRating = 9.4m,
            TotalReviews = 4
        };

        var r2 = new Restaurant
        {
            Id = Guid.Parse("a0000002-0000-0000-0000-000000000002"),
            Name = "Mamma Pizza",
            Address = "Dronningens gate 22, 0154 Oslo",
            MunicipalityId = 1,
            CuisineType = "Italian",
            PriceRange = 2,
            WebsiteUrl = "https://mammapizza.no",
            CoverImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
            OpenedDate = new DateOnly(2022, 5, 10),
            AverageRating = 8.6m,
            TotalReviews = 3
        };

        var r3 = new Restaurant
        {
            Id = Guid.Parse("a0000003-0000-0000-0000-000000000003"),
            Name = "Sabi Omakase Oslo",
            Address = "Vika Atrium, Munkedamsveien 45, 0250 Oslo",
            MunicipalityId = 1,
            CuisineType = "Japanese",
            PriceRange = 4,
            CoverImageUrl = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
            OpenedDate = today.AddMonths(-2), // NEW restaurant!
            AverageRating = 9.0m,
            TotalReviews = 2
        };

        var r4 = new Restaurant
        {
            Id = Guid.Parse("a0000004-0000-0000-0000-000000000004"),
            Name = "Way Down South",
            Address = "Østre Elvebakke 8, 0182 Oslo",
            MunicipalityId = 1,
            CuisineType = "Street Food",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
            OpenedDate = today.AddMonths(-1), // NEW restaurant!
            AverageRating = 8.2m,
            TotalReviews = 2
        };

        var r5 = new Restaurant
        {
            Id = Guid.Parse("a0000005-0000-0000-0000-000000000005"),
            Name = "Fiskeriet Youngstorget",
            Address = "Youngstorget 2b, 0181 Oslo",
            MunicipalityId = 1,
            CuisineType = "Seafood",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800",
            OpenedDate = new DateOnly(2020, 6, 15),
            AverageRating = 8.7m,
            TotalReviews = 3
        };

        var r6 = new Restaurant
        {
            Id = Guid.Parse("a0000006-0000-0000-0000-000000000006"),
            Name = "Bass Oslo",
            Address = "Thorvald Meyers gate 26C, 0555 Oslo",
            MunicipalityId = 1,
            CuisineType = "Norwegian",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            OpenedDate = new DateOnly(2019, 8, 20),
            AverageRating = 8.5m,
            TotalReviews = 2
        };

        // Stockholm Restaurants (Municipality 6)
        var r7 = new Restaurant
        {
            Id = Guid.Parse("a0000007-0000-0000-0000-000000000007"),
            Name = "Frantzén",
            Address = "Klara Norra kyrkogata 26, 111 22 Stockholm",
            MunicipalityId = 6,
            CuisineType = "Fine Dining",
            PriceRange = 4,
            CoverImageUrl = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
            OpenedDate = new DateOnly(2018, 2, 1),
            AverageRating = 9.8m,
            TotalReviews = 3
        };

        var r8 = new Restaurant
        {
            Id = Guid.Parse("a0000008-0000-0000-0000-000000000008"),
            Name = "Omnipollos Hatt",
            Address = "Hökens gata 1A, 116 46 Stockholm",
            MunicipalityId = 6,
            CuisineType = "Italian",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
            OpenedDate = new DateOnly(2020, 9, 1),
            AverageRating = 8.8m,
            TotalReviews = 3
        };

        var r9 = new Restaurant
        {
            Id = Guid.Parse("a0000009-0000-0000-0000-000000000009"),
            Name = "Sushi Oi",
            Address = "Karlavägen 36, 114 49 Stockholm",
            MunicipalityId = 6,
            CuisineType = "Japanese",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800",
            OpenedDate = today.AddMonths(-3), // NEW restaurant!
            AverageRating = 9.1m,
            TotalReviews = 2
        };

        var r10 = new Restaurant
        {
            Id = Guid.Parse("a0000010-0000-0000-0000-000000000010"),
            Name = "Lilla Ego",
            Address = "Västmannagatan 69, 113 26 Stockholm",
            MunicipalityId = 6,
            CuisineType = "Modern Scandinavian",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
            OpenedDate = new DateOnly(2021, 4, 1),
            AverageRating = 9.3m,
            TotalReviews = 2
        };

        var r11 = new Restaurant
        {
            Id = Guid.Parse("a0000011-0000-0000-0000-000000000011"),
            Name = "Meatballs for the People",
            Address = "Nytorgsgatan 30, 116 40 Stockholm",
            MunicipalityId = 6,
            CuisineType = "Swedish",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800",
            OpenedDate = new DateOnly(2022, 1, 15),
            AverageRating = 8.1m,
            TotalReviews = 2
        };

        // Copenhagen Restaurants (Municipality 11)
        var r12 = new Restaurant
        {
            Id = Guid.Parse("a0000012-0000-0000-0000-000000000012"),
            Name = "Noma",
            Address = "Refshalevej 96, 1432 Copenhagen",
            MunicipalityId = 11,
            CuisineType = "Fine Dining",
            PriceRange = 4,
            CoverImageUrl = "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800",
            OpenedDate = new DateOnly(2018, 2, 1),
            AverageRating = 9.7m,
            TotalReviews = 3
        };

        var r13 = new Restaurant
        {
            Id = Guid.Parse("a0000013-0000-0000-0000-000000000013"),
            Name = "Bæst",
            Address = "Guldbergsgade 29, 2200 Copenhagen",
            MunicipalityId = 11,
            CuisineType = "Italian",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
            OpenedDate = new DateOnly(2020, 5, 20),
            AverageRating = 9.0m,
            TotalReviews = 3
        };

        var r14 = new Restaurant
        {
            Id = Guid.Parse("a0000014-0000-0000-0000-000000000014"),
            Name = "Popl Burger",
            Address = "Strandgade 108, 1401 Copenhagen",
            MunicipalityId = 11,
            CuisineType = "Burgers",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
            OpenedDate = today.AddMonths(-4), // NEW restaurant!
            AverageRating = 8.5m,
            TotalReviews = 2
        };

        var r15 = new Restaurant
        {
            Id = Guid.Parse("a0000015-0000-0000-0000-000000000015"),
            Name = "Slurp Ramen Joint",
            Address = "Nansensgade 90, 1366 Copenhagen",
            MunicipalityId = 11,
            CuisineType = "Japanese",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
            OpenedDate = new DateOnly(2021, 7, 1),
            AverageRating = 8.7m,
            TotalReviews = 2
        };

        var r16 = new Restaurant
        {
            Id = Guid.Parse("a0000016-0000-0000-0000-000000000016"),
            Name = "Sanchez",
            Address = "Istedgade 60, 1650 Copenhagen",
            MunicipalityId = 11,
            CuisineType = "Street Food",
            PriceRange = 2,
            CoverImageUrl = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
            OpenedDate = new DateOnly(2020, 10, 1),
            AverageRating = 8.4m,
            TotalReviews = 2
        };

        // Other Nordic Cities
        var r17 = new Restaurant
        {
            Id = Guid.Parse("a0000017-0000-0000-0000-000000000017"),
            Name = "Lysverket",
            Address = "Rasmus Meyers allé 9, 5015 Bergen",
            MunicipalityId = 2,
            CuisineType = "Modern Norwegian",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            OpenedDate = new DateOnly(2021, 6, 1),
            AverageRating = 8.9m,
            TotalReviews = 2
        };

        var r18 = new Restaurant
        {
            Id = Guid.Parse("a0000018-0000-0000-0000-000000000018"),
            Name = "Grön",
            Address = "Albertinkatu 36, 00180 Helsinki",
            MunicipalityId = 16,
            CuisineType = "Nordic",
            PriceRange = 3,
            CoverImageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            OpenedDate = new DateOnly(2020, 3, 1),
            AverageRating = 9.2m,
            TotalReviews = 2
        };

        var r19 = new Restaurant
        {
            Id = Guid.Parse("a0000019-0000-0000-0000-000000000019"),
            Name = "Dill",
            Address = "Laugavegur 59, 101 Reykjavík",
            MunicipalityId = 21,
            CuisineType = "Contemporary Icelandic",
            PriceRange = 4,
            CoverImageUrl = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
            OpenedDate = new DateOnly(2021, 8, 1),
            AverageRating = 9.4m,
            TotalReviews = 2
        };

        var restaurants = new List<Restaurant>
        {
            r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19
        };
        await context.Restaurants.AddRangeAsync(restaurants);
        await context.SaveChangesAsync();

        // 7. Seed Reviews
        var tagDict = tags.ToDictionary(t => t.Id);
        var rev1 = new Review
        {
            Id = Guid.Parse("b0000001-0000-0000-0000-000000000001"),
            UserId = u1Id, // Anna
            RestaurantId = r1.Id, // Maaemo
            Rating = 9,
            Title = "Absolutely extraordinary (#2)",
            Body = "Second visit and somehow even better than the first. The Norwegian langoustine dish paired with wild pine broth was unforgettable. Unmatched hospitality.",
            VisitNumber = 2,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 4,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            Tags = new List<Tag> { tagDict[8], tagDict[1] }, // Fine dining, Great for dates
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", Caption = "Tasting course signature langoustine", Order = 0 },
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800", Caption = "Exceptional wine pairing", Order = 1 }
            }
        };

        var rev2 = new Review
        {
            Id = Guid.Parse("b0000002-0000-0000-0000-000000000002"),
            UserId = u6Id, // Ingrid
            RestaurantId = r1.Id, // Maaemo
            Rating = 10,
            Title = "A culinary journey of a lifetime",
            Body = "Celebrated our anniversary here. Truly poetry on a plate. The attention to local Scandinavian terroir is sublime.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 4,
            CreatedAt = DateTime.UtcNow.AddDays(-5),
            Tags = new List<Tag> { tagDict[8], tagDict[1] },
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800", Caption = "Nordic amuse-bouche", Order = 0 }
            }
        };

        var rev3 = new Review
        {
            Id = Guid.Parse("b0000003-0000-0000-0000-000000000003"),
            UserId = u1Id, // Anna
            RestaurantId = r2.Id, // Mamma Pizza
            Rating = 8,
            Title = "Best crust in downtown Oslo",
            Body = "Real Roman style pizza with generous toppings and bubbly crust. The Diavola has just the right kick.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 2,
            CreatedAt = DateTime.UtcNow.AddDays(-7),
            Tags = new List<Tag> { tagDict[3], tagDict[6], tagDict[9] },
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", Caption = "Diavola straight from the wood oven", Order = 0 }
            }
        };

        var rev4 = new Review
        {
            Id = Guid.Parse("b0000004-0000-0000-0000-000000000004"),
            UserId = u6Id, // Ingrid
            RestaurantId = r2.Id, // Mamma Pizza
            Rating = 9,
            Title = "Authentic Italian hospitality",
            Body = "Staff treat you like family! Crispy crust, fresh buffalo mozzarella, and great Aperol spritz.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 2,
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            Tags = new List<Tag> { tagDict[3], tagDict[2] }
        };

        var rev5 = new Review
        {
            Id = Guid.Parse("b0000005-0000-0000-0000-000000000005"),
            UserId = u1Id, // Anna
            RestaurantId = r3.Id, // Sabi Omakase Oslo (NEW)
            Rating = 9,
            Title = "Next-level sushi craft in Vika",
            Body = "Just opened and already top tier. Only 10 seats around the chef counter. The grilled otoro was mind-blowing.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 4,
            CreatedAt = DateTime.UtcNow.AddHours(-18),
            Tags = new List<Tag> { tagDict[1], tagDict[8] },
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800", Caption = "Otoro nigiri with fresh wasabi", Order = 0 }
            }
        };

        var rev6 = new Review
        {
            Id = Guid.Parse("b0000006-0000-0000-0000-000000000006"),
            UserId = u6Id, // Ingrid
            RestaurantId = r4.Id, // Way Down South (NEW)
            Rating = 8,
            Title = "Smoked brisket perfection",
            Body = "Bark on the brisket was incredible. Melt-in-your-mouth tenderness and the mac and cheese was decadent.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 2,
            CreatedAt = DateTime.UtcNow.AddHours(-6),
            Tags = new List<Tag> { tagDict[9], tagDict[4] }
        };

        var rev7 = new Review
        {
            Id = Guid.Parse("b0000007-0000-0000-0000-000000000007"),
            UserId = u3Id, // Sofia
            RestaurantId = r7.Id, // Frantzén
            Rating = 10,
            Title = "3 Michelin star brilliance in Stockholm",
            Body = "From the rooftop greenhouse reception to the elevator ride and open kitchen, this is the pinnacle of modern gastronomy.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 4,
            CreatedAt = DateTime.UtcNow.AddDays(-3),
            Tags = new List<Tag> { tagDict[8], tagDict[1] },
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800", Caption = "The famous French toast course", Order = 0 }
            }
        };

        var rev8 = new Review
        {
            Id = Guid.Parse("b0000008-0000-0000-0000-000000000008"),
            UserId = u7Id, // Jonas
            RestaurantId = r8.Id, // Omnipollos Hatt
            Rating = 9,
            Title = "Best sourdough pizza and sours (#2)",
            Body = "Second time here this month! Sourdough crust with spicy salami and honey, paired with a mango sour slushie. Unbeatable vibes.",
            VisitNumber = 2,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 2,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            Tags = new List<Tag> { tagDict[3], tagDict[5], tagDict[6] },
            Photos = new List<ReviewPhoto>
            {
                new ReviewPhoto { Url = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", Caption = "Salami, honey & jalapeno sourdough pizza", Order = 0 }
            }
        };

        var rev9 = new Review
        {
            Id = Guid.Parse("b0000009-0000-0000-0000-000000000009"),
            UserId = u4Id, // Lukas
            RestaurantId = r12.Id, // Noma
            Rating = 10,
            Title = "Ocean season at Noma",
            Body = "René Redzepi's team continues to redefine what food can be. Sea urchin tart with frozen fermented broth blew my mind.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 4,
            CreatedAt = DateTime.UtcNow.AddDays(-4),
            Tags = new List<Tag> { tagDict[8] }
        };

        var rev10 = new Review
        {
            Id = Guid.Parse("b0000010-0000-0000-0000-000000000010"),
            UserId = u8Id, // Freja
            RestaurantId = r13.Id, // Bæst
            Rating = 9,
            Title = "House-made mozzarella & organic charcuterie",
            Body = "Christian Puglisi has created something so special in Nørrebro. Fresh burrata made an hour before serving!",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 3,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            Tags = new List<Tag> { tagDict[3], tagDict[6], tagDict[7] }
        };

        var rev11 = new Review
        {
            Id = Guid.Parse("b0000011-0000-0000-0000-000000000011"),
            UserId = u4Id, // Lukas
            RestaurantId = r14.Id, // Popl Burger (NEW)
            Rating = 9,
            Title = "Noma burger spinoff lives up to the hype",
            Body = "The organic beef patty is seared to perfection with garum glaze. Fermented quinoa vegan burger is also ridiculously good.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 2,
            CreatedAt = DateTime.UtcNow.AddHours(-12),
            Tags = new List<Tag> { tagDict[9], tagDict[4] }
        };

        var rev12 = new Review
        {
            Id = Guid.Parse("b0000012-0000-0000-0000-000000000012"),
            UserId = u2Id, // Erik
            RestaurantId = r17.Id, // Lysverket
            Rating = 9,
            Title = "West coast seafood magic",
            Body = "Raw marinated Norwegian scallops with apple and elderflower. Chef Christopher Haatuft showcases the very best of Bergen.",
            VisitNumber = 1,
            Visibility = ReviewVisibility.Public,
            PriceRangeIndicator = 3,
            CreatedAt = DateTime.UtcNow.AddDays(-4),
            Tags = new List<Tag> { tagDict[1], tagDict[8] }
        };

        var reviews = new List<Review>
        {
            rev1, rev2, rev3, rev4, rev5, rev6, rev7, rev8, rev9, rev10, rev11, rev12
        };
        await context.Reviews.AddRangeAsync(reviews);
        await context.SaveChangesAsync();

        // 8. Review Likes
        var likes = new List<ReviewLike>
        {
            new ReviewLike { UserId = u2Id, ReviewId = rev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new ReviewLike { UserId = u3Id, ReviewId = rev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new ReviewLike { UserId = u6Id, ReviewId = rev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new ReviewLike { UserId = u4Id, ReviewId = rev1.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) },

            new ReviewLike { UserId = u1Id, ReviewId = rev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-4) },
            new ReviewLike { UserId = u3Id, ReviewId = rev2.Id, CreatedAt = DateTime.UtcNow.AddDays(-4) },

            new ReviewLike { UserId = u6Id, ReviewId = rev3.Id, CreatedAt = DateTime.UtcNow.AddDays(-6) },
            new ReviewLike { UserId = u1Id, ReviewId = rev7.Id, CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new ReviewLike { UserId = u7Id, ReviewId = rev7.Id, CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new ReviewLike { UserId = u3Id, ReviewId = rev8.Id, CreatedAt = DateTime.UtcNow.AddHours(-10) },
            new ReviewLike { UserId = u1Id, ReviewId = rev8.Id, CreatedAt = DateTime.UtcNow.AddHours(-8) },
            new ReviewLike { UserId = u1Id, ReviewId = rev11.Id, CreatedAt = DateTime.UtcNow.AddHours(-4) },
            new ReviewLike { UserId = u8Id, ReviewId = rev11.Id, CreatedAt = DateTime.UtcNow.AddHours(-2) }
        };
        await context.ReviewLikes.AddRangeAsync(likes);
        await context.SaveChangesAsync();

        // 9. Review Comments
        var comments = new List<ReviewComment>
        {
            new ReviewComment
            {
                Id = Guid.NewGuid(),
                ReviewId = rev1.Id,
                UserId = u2Id, // Erik (mutual friend of Anna)
                Content = "That langoustine looks insane Anna! Putting this on my wishlist next time I'm in Oslo.",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new ReviewComment
            {
                Id = Guid.NewGuid(),
                ReviewId = rev1.Id,
                UserId = u6Id, // Ingrid (mutual friend of Anna)
                Content = "Totally agree, we were there last week and it was perfection!",
                CreatedAt = DateTime.UtcNow.AddHours(-20)
            },
            new ReviewComment
            {
                Id = Guid.NewGuid(),
                ReviewId = rev8.Id,
                UserId = u3Id, // Sofia
                Content = "That spicy salami pizza is iconic Jonas! Need to go together again soon.",
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            }
        };
        await context.ReviewComments.AddRangeAsync(comments);
        await context.SaveChangesAsync();

        // 10. WantToTry entries
        var wantToTry = new List<WantToTry>
        {
            new WantToTry { UserId = u1Id, RestaurantId = r7.Id, CreatedAt = DateTime.UtcNow.AddDays(-3) }, // Anna wants Frantzen
            new WantToTry { UserId = u1Id, RestaurantId = r12.Id, CreatedAt = DateTime.UtcNow.AddDays(-4) }, // Anna wants Noma
            new WantToTry { UserId = u2Id, RestaurantId = r1.Id, CreatedAt = DateTime.UtcNow.AddDays(-2) }, // Erik wants Maaemo
            new WantToTry { UserId = u3Id, RestaurantId = r3.Id, CreatedAt = DateTime.UtcNow.AddHours(-10) }, // Sofia wants Sabi Omakase
            new WantToTry { UserId = u4Id, RestaurantId = r8.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) }, // Lukas wants Omnipollo
            new WantToTry { UserId = u6Id, RestaurantId = r3.Id, CreatedAt = DateTime.UtcNow.AddHours(-8) } // Ingrid wants Sabi Omakase
        };
        await context.WantToTryEntries.AddRangeAsync(wantToTry);
        await context.SaveChangesAsync();

        // 11. Notifications
        var notifications = new List<Notification>
        {
            new Notification
            {
                Id = Guid.NewGuid(),
                UserId = u1Id, // Anna receives
                ActorId = u2Id, // Erik
                Type = NotificationType.Comment,
                ReviewId = rev1.Id,
                Message = "Erik Pedersen commented on your review of Maaemo",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Notification
            {
                Id = Guid.NewGuid(),
                UserId = u1Id,
                ActorId = u6Id, // Ingrid
                Type = NotificationType.Like,
                ReviewId = rev1.Id,
                Message = "Ingrid Haugen liked your review of Maaemo",
                IsRead = false,
                CreatedAt = DateTime.UtcNow.AddHours(-18)
            },
            new Notification
            {
                Id = Guid.NewGuid(),
                UserId = u1Id,
                ActorId = u4Id, // Lukas
                Type = NotificationType.NewReview,
                ReviewId = rev11.Id,
                RestaurantId = r14.Id,
                Message = "Lukas Møller reviewed Popl Burger",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-12)
            },
            new Notification
            {
                Id = Guid.NewGuid(),
                UserId = u1Id,
                ActorId = u3Id, // Sofia
                Type = NotificationType.WantToTry,
                RestaurantId = r3.Id,
                Message = "Sofia Lindqvist wants to try Sabi Omakase Oslo",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddHours(-10)
            }
        };
        await context.Notifications.AddRangeAsync(notifications);
        await context.SaveChangesAsync();

        // 12. Seed Trending Restaurants
        var trending = new List<TrendingRestaurant>
        {
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 1, // Oslo
                RestaurantId = r1.Id,
                Score = 0.95,
                Rank = 1,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 1,
                RestaurantId = r3.Id, // Sabi Omakase
                Score = 0.88,
                Rank = 2,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 1,
                RestaurantId = r2.Id,
                Score = 0.79,
                Rank = 3,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 6, // Stockholm
                RestaurantId = r7.Id,
                Score = 0.98,
                Rank = 1,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 6,
                RestaurantId = r8.Id,
                Score = 0.86,
                Rank = 2,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 11, // Copenhagen
                RestaurantId = r12.Id,
                Score = 0.99,
                Rank = 1,
                CalculatedAt = DateTime.UtcNow
            },
            new TrendingRestaurant
            {
                Id = Guid.NewGuid(),
                MunicipalityId = 11,
                RestaurantId = r14.Id,
                Score = 0.89,
                Rank = 2,
                CalculatedAt = DateTime.UtcNow
            }
        };
        await context.TrendingRestaurants.AddRangeAsync(trending);
        await context.SaveChangesAsync();

        await RestaurantDirectorySeedData.EnsureAsync(context);
    }
}
