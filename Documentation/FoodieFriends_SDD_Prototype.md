# FoodieFriends — Prototype Software Design Document

> **Version:** 1.0 · **Date:** 2026-10-24 · **Status:** First Draft — OsloMet Introduction to AI Assignment  
> **Course:** Introduction to AI · **Institution:** OsloMet — Oslo Metropolitan University  
> **Full Production SDD:** See [FoodieFriends_SDD_Full.md](./FoodieFriends_SDD_Full.md)

---

## 1. Project Overview

### 1.1 What is FoodieFriends?

**FoodieFriends** is a social restaurant-review web application for casual foodies in Scandinavia. It combines the social feed experience of Instagram with the review utility of TripAdvisor and Google Reviews. The core idea: **see what your friends are eating, discover where to go next.**

### 1.2 Problem Statement

Existing restaurant review platforms (Google Reviews, TripAdvisor, Yelp) treat reviews as anonymous, crowd-sourced data. They answer *"Is this restaurant good?"* but not *"What have my friends been eating lately?"* or *"Which restaurants does my friend group love?"*

FoodieFriends puts **social connections first** — your home feed shows your friends' recent restaurant visits, complete with ratings, text reviews, and food photos. It's the restaurant equivalent of seeing your friend's Instagram story, but structured and searchable.

### 1.3 Prototype Scope

This prototype is a **vertical slice** demonstrating all core features with seeded demo data. It proves the concept is technically viable and the UX works. The prototype includes:

| ✅ In Prototype | ❌ Deferred to Production |
|---|---|
| Social feed with friend reviews | Real authentication (email/password) |
| Review creation (rating, text, photos) | Google Places API integration |
| Follow/unfollow system | Image CDN (Cloudinary) |
| Restaurant profiles with ratings | Redis caching |
| Rankings (all users + friends) | Push notifications |
| Want to Try bookmarking | GDPR compliance |
| Entry page (country/city selector) | Multi-language support |
| User profiles | Content moderation |
| Like & comment on reviews | Real-time WebSocket updates |
| Trending restaurants | |
| Notifications page | |

### 1.4 AI-Assisted Development

This project was designed and built using **AI-assisted pair programming** with Google Antigravity (powered by Claude). The AI assisted with:

- **Requirements elicitation** — structured interview to scope features
- **Architecture design** — tech stack selection, data modelling, API design
- **SDD authorship** — both the full production SDD and this prototype SDD
- **Code generation** — scaffolding, entity models, controllers, React components
- **Agentic coding** — multiple AI subagents working in parallel on backend and frontend

This demonstrates how AI tools can accelerate the software design and development process from idea → specification → working code.

---

## 2. Technical Architecture

### 2.1 Prototype Stack

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │         React 18 + Vite + Tailwind CSS              │ │
│  │         (Single Page Application)                    │ │
│  └──────────────────────┬──────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────┘
                          │ REST API (JSON)
┌─────────────────────────┼───────────────────────────────┐
│  ASP.NET Core 8 Web API │                                │
│  ┌──────────────────────┴──────────────────────────────┐ │
│  │  Controllers → Services → Repositories              │ │
│  │  Entity Framework Core 8 (Code-First)               │ │
│  └──────────────────────┬──────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────┐
│              PostgreSQL 16 Database                      │
│  ┌──────────────────────┴──────────────────────────────┐ │
│  │  Users, Restaurants, Reviews, Follows, etc.         │ │
│  │  Seeded with 25 cities + demo data                  │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Why This Stack?

| Decision | Rationale |
|---|---|
| **React + Vite** over MVC | Social feeds require dynamic, interactive UIs. React's component model handles infinite scroll, real-time likes, and photo carousels natively. MVC's server-rendered pages would require full reloads and AJAX workarounds. |
| **ASP.NET Core Web API** | Industry-standard C# backend. Separating the API from the frontend means the same API can serve a future mobile app. |
| **PostgreSQL** over SQL Server | Free, open-source, excellent performance. Superior full-text search for restaurant/user lookup. Native JSON support for flexible data. |
| **Entity Framework Core** | Code-first approach lets us define the data model in C# and auto-generate the database schema via migrations. |
| **Tailwind CSS** | Utility-first CSS framework for rapid, consistent, responsive design without writing custom CSS files. |

### 2.3 Prototype Simplifications

For the prototype, we simplify certain production concerns:

| Production Approach | Prototype Approach |
|---|---|
| Google Places API for restaurant data | Pre-seeded restaurant data in database |
| Cloudinary CDN for image storage | Local file storage (`/uploads` directory) or placeholder image URLs |
| Redis for caching | No caching layer — direct DB queries |
| JWT authentication | Simple session via `localStorage` — user selects identity at startup |
| Background job for trending | Trending calculated on-demand per API request |
| Email notifications | In-app notification list only |

---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Country  │◄────┤Municipality│◄────┤  Restaurant  │
│ (5)      │     │ (25)      │     │              │
└──────────┘     └──────────┘     └──────┬───────┘
                                         │ 1:N
┌──────────┐     ┌──────────┐     ┌──────┴───────┐
│   User   │────►│  Follow  │     │   Review     │
│          │     │(follower/│     │ (1-10 rating)│
│          │     │ followee)│     │              │
│          ├────►┤          │     └──────┬───────┘
└────┬─────┘     └──────────┘            │
     │                              ┌────┴────┐
     │    ┌────────────┐            │         │
     ├───►│ WantToTry  │      ┌─────┴──┐  ┌──┴──────┐
     │    └────────────┘      │ReviewLike│ │ReviewComment│
     │    ┌────────────┐      └────────┘  └─────────┘
     └───►│Notification│      ┌────────┐
          └────────────┘      │ReviewPhoto│
                              └────────┘
```

### 3.2 Entity Details

#### Core Entities and Their Fields

**User**
- `Id` (UUID) — Primary key
- `Username` (string, 30 chars) — Unique, used for search and @mentions
- `DisplayName` (string, 100 chars) — Shown on profile and feed
- `Email` (string) — For future authentication
- `ProfilePhotoUrl` (string) — Avatar image
- `Bio` (string, 500 chars) — Short self-description
- `CityId` (int) — Home municipality
- `CreatedAt` / `UpdatedAt` (timestamp)

**Restaurant**
- `Id` (UUID) — Primary key
- `Name` (string) — Restaurant name
- `Address` (string) — Full street address
- `Latitude` / `Longitude` (decimal) — For future map features
- `MunicipalityId` (int) — Which city it's in
- `CuisineType` (string) — "Italian", "Japanese", "Norwegian", etc.
- `PriceRange` (1-4) — Budget to luxury scale
- `WebsiteUrl` / `MenuUrl` (string) — External links
- `AverageRating` (decimal) — Denormalised for fast ranking queries
- `TotalReviews` (int) — Denormalised count
- `OpenedDate` (date) — For "New" badge (≤ 6 months old)

**Review**
- `Id` (UUID) — Primary key
- `UserId` → User — Who wrote it
- `RestaurantId` → Restaurant — Which restaurant
- `Rating` (1-10) — Star score
- `Title` (string) — Includes visit number, e.g. "Great pasta (#2)"
- `Body` (text) — Minimum 1 word required
- `VisitNumber` (int) — Auto-calculated: how many times this user reviewed this restaurant
- `Visibility` — `Public` or `FriendsOnly`
- `PriceRangeIndicator` (1-4) — Per-visit price assessment
- `CreatedAt` (timestamp)

**Follow** (join table)
- `FollowerId` → User (who follows)
- `FolloweeId` → User (who is followed)
- Instagram-style: one-directional, no approval needed

**ReviewPhoto** — Up to 5 photos per review  
**ReviewLike** — One like per user per review  
**ReviewComment** — Visible only to mutual friends (see Business Logic)  
**WantToTry** — Bookmark a restaurant; appears on friends' feeds  
**Notification** — Types: NewReview, Comment, Like, WantToTry  
**Tag** — Predefined labels: "Great for dates", "Family friendly", "Best pizza", etc.

### 3.3 Seed Data Plan

The prototype ships with pre-seeded data so it's immediately usable:

**Locations:** 5 countries × 5 cities = 25 municipalities

| 🇳🇴 Norway | 🇸🇪 Sweden | 🇩🇰 Denmark | 🇫🇮 Finland | 🇮🇸 Iceland |
|---|---|---|---|---|
| Oslo | Stockholm | Copenhagen | Helsinki | Reykjavík |
| Bergen | Gothenburg | Aarhus | Tampere | Kópavogur |
| Stavanger | Malmö | Odense | Turku | Hafnarfjörður |
| Trondheim | Uppsala | Aalborg | Oulu | Reykjanesbær |
| Drammen | Västerås | Esbjerg | Jyväskylä | Akureyri |

**Demo Users:** 8–10 users with profiles, bios, and avatars  
**Demo Restaurants:** 5–8 restaurants per major city (Oslo, Stockholm, Copenhagen) with varied cuisines  
**Demo Reviews:** 30–50 reviews with ratings, text, and placeholder photos  
**Demo Follows:** A social graph so every demo user has 2–5 friends  
**Demo Want-to-Try:** Several bookmarks per user  

This creates a realistic-feeling prototype on first load.

---

## 4. Application Pages

### 4.1 User Flow

```
First Visit                    Returning User
    │                               │
    ▼                               ▼
┌─────────────┐              ┌─────────────┐
│ Entry Page  │              │ Entry Page  │
│ Pick Country│              │ (or direct  │
│ Pick City   │              │  to /feed)  │
└──────┬──────┘              └──────┬──────┘
       │                            │
       ▼                            ▼
┌─────────────┐              ┌─────────────┐
│ Get Started │              │  Home Feed  │◄─── Main experience
│ Pick/Create │              │  (friends'  │
│ User        │              │   reviews)  │
└──────┬──────┘              └──────┬──────┘
       │                            │
       ▼                            ├──► Discover Restaurants
┌─────────────┐                     ├──► Rankings
│  Home Feed  │                     ├──► Want to Try
└─────────────┘                     ├──► My Profile
                                    └──► Notifications
```

### 4.2 Page Breakdown

#### Page 1: Entry / Location Selector (`/`)
**Purpose:** Set the user's geographic context before entering the app.

**Implementation:**
- Full-screen overlay with FoodieFriends logo
- Step 1: Five country cards with flag emojis (🇳🇴 🇸🇪 🇩🇰 🇫🇮 🇮🇸)
- Step 2: Five city buttons for the selected country
- Selection saved to `localStorage` (session-based)
- "Change location" link always visible in navbar

**React Components:**
- `<LocationSelector />` — full-screen entry page
- `<CountryCard />` — clickable country option
- `<CityButton />` — clickable city option

---

#### Page 2: Home Feed (`/feed`) ⭐ Core Page
**Purpose:** Show a chronological newsfeed of friends' restaurant activity.

**Feed items (in chronological order):**

1. **Review Card** — Friend reviewed a restaurant
   ```
   ┌─────────────────────────────────────────┐
   │ 🖼️ avatar  @username · 2 hours ago      │
   │                                          │
   │ Restaurant Name [NEW]         ⭐ 8/10   │
   │ "Amazing sushi, best I've had (#2)"      │
   │                                          │
   │ The fish was incredibly fresh and the    │
   │ chef clearly knows what he's doing...    │
   │                                          │
   │ 📸 [photo1] [photo2] [photo3]           │
   │                                          │
   │ 💰 $$ · 🏷️ Great for dates              │
   │ ❤️ 5 likes  💬 2 comments               │
   └─────────────────────────────────────────┘
   ```

2. **Want to Try Card** — Friend bookmarked a restaurant
   ```
   ┌─────────────────────────────────────────┐
   │ 📌 @username wants to try               │
   │    Restaurant Name · Italian · ⭐ 7.8   │
   └─────────────────────────────────────────┘
   ```

3. **Trending Card** — Injected twice daily
   ```
   ┌─────────────────────────────────────────┐
   │ 🔥 Trending in Oslo This Month          │
   │ 1. Restaurant A — ⭐ 9.2 (12 reviews)  │
   │ 2. Restaurant B — ⭐ 8.7 (8 reviews)   │
   │ 3. Restaurant C — ⭐ 8.5 (15 reviews)  │
   └─────────────────────────────────────────┘
   ```

**Implementation:**
- Infinite scroll with cursor-based pagination
- `GET /api/feed?cursor=&limit=20`
- Floating action button: "✍️ Write a Review"

**React Components:**
- `<FeedPage />` — container with infinite scroll
- `<ReviewCard />` — full review with photos, likes, comments
- `<WantToTryCard />` — compact bookmark notification
- `<TrendingCard />` — trending restaurants summary
- `<PhotoCarousel />` — swipeable photo gallery (max 5)

---

#### Page 3: Discover Restaurants (`/discover`)
**Purpose:** Search and browse restaurants by category, cuisine, and filters.

**Implementation:**
- Search bar with autocomplete (searches local DB)
- Category grid: Italian, Japanese, Norwegian, Burgers, Fine Dining, Seafood, Vegetarian, Street Food, **New** (special)
- Filter pills: cuisine, price range (1-4), "New" only, tags
- Results show: name, cuisine, rating, price, "New" badge, friend count ("3 friends reviewed")

**React Components:**
- `<DiscoverPage />` — search + category grid
- `<SearchBar />` — autocomplete search
- `<CategoryGrid />` — clickable cuisine categories
- `<RestaurantCard />` — compact restaurant preview
- `<FilterPills />` — active filter chips

---

#### Page 4: Restaurant Profile (`/restaurant/:id`)
**Purpose:** Detailed restaurant page with all reviews and info.

**Sections:**
- **Header:** Name, cuisine, average rating (all + friends), price range, "New" badge, website/menu links
- **Tab: Friends' Reviews** (default) — reviews from people you follow, sorted newest first
- **Tab: All Reviews** — all public reviews
- **Tab: Photos** — gallery of all review photos
- **Tab: Info** — address, cuisine, price, links

**Key feature:** Friends' reviews are shown first by default, surfacing trusted opinions.

**React Components:**
- `<RestaurantProfilePage />` — tabbed layout
- `<RestaurantHeader />` — hero with key info
- `<ReviewList />` — paginated review cards
- `<PhotoGallery />` — masonry grid of all review photos
- `<RestaurantInfo />` — address, links, details

---

#### Page 5: Write Review (`/restaurant/:id/review`)
**Purpose:** Create a new restaurant review.

**Form fields:**
- ⭐ Rating (1–10) — required, interactive star/number picker
- 📝 Title — auto-prefilled with visit number (e.g. "My Review (#2)")
- 📄 Body — text area, min 1 word
- 📸 Photos — drag & drop, max 5, with optional captions
- 💰 Price Range — 1-4 scale selector
- 🏷️ Tags — multi-select checkboxes
- 🔒 Visibility — toggle: Public / Friends Only

**Business logic:**
- Visit number auto-calculated: `COUNT(user's reviews for this restaurant) + 1`
- If visit number > 1, title gets auto-suffix: "(#2)", "(#3)", etc.
- On submit: review created, followers notified, restaurant average rating recalculated

---

#### Page 6: Rankings (`/rankings`)
**Purpose:** Leaderboard of top-rated restaurants by municipality.

**Three tabs:**

| Tab | Data Source | Qualification |
|---|---|---|
| **All Users** | Average of all public reviews | Min 3 reviews |
| **Friends** | Average of reviews from people you follow | Min 2 friend reviews |
| **By Category** | Sub-rankings per cuisine type | Min 2 reviews in category |

**Scope:** Municipality dropdown (defaults to session city)

**React Components:**
- `<RankingsPage />` — tab container
- `<RankingList />` — numbered ranking table
- `<MunicipalitySelector />` — city dropdown

---

#### Page 7: Want to Try (`/want-to-try`)
**Purpose:** User's personal bookmark list of restaurants to visit.

- Grid of bookmarked restaurants
- Each card: name, cuisine, rating, link to profile
- Remove bookmark button (✕)
- Sorted by date added (newest first)

---

#### Page 8: User Profile (`/user/:username`)
**Purpose:** View a user's profile, reviews, and activity.

**Content:**
- Avatar, display name, @username, bio, city
- Stats bar: Reviews · Following · Followers
- Follow / Unfollow button
- Tabs: Reviews, Want to Try, Photos

---

#### Page 9: Notifications (`/notifications`)
**Purpose:** Activity feed of social interactions directed at you.

**Notification types:**
- 📝 "[friend] reviewed [restaurant]"
- 💬 "[friend] commented on your review"
- ❤️ "[friend] liked your review"
- 📌 "[friend] wants to try [restaurant]"

---

#### Page 10: User Search (`/search`)
**Purpose:** Find and follow other users.

- Username search with autocomplete
- Results: avatar, display name, @username, city, mutual followers count
- "Suggested for you" section: people followed by your friends

---

#### Page 11: My Profile / Settings (`/profile`)
**Purpose:** Edit your own profile.

- Edit: display name, bio, avatar, home city
- Change session city
- View your own reviews and stats

---

## 5. API Endpoints (Prototype)

### 5.1 Complete Endpoint List

```
LOCATIONS
  GET    /api/locations/countries          → List 5 Scandinavian countries
  GET    /api/locations/cities?country=NO  → List 5 cities for country

USERS
  GET    /api/users/me                     → Current user profile
  PUT    /api/users/me                     → Update my profile
  GET    /api/users/:username              → View user profile
  GET    /api/users/search?q=anna          → Search by username
  GET    /api/users/:username/reviews      → User's reviews (paginated)
  GET    /api/users/suggestions            → Suggested follows (mutual)

FOLLOWS
  POST   /api/follows/:userId             → Follow user
  DELETE /api/follows/:userId             → Unfollow user
  GET    /api/follows/following            → Who I follow
  GET    /api/follows/followers            → My followers

RESTAURANTS
  GET    /api/restaurants/search?q=&city=  → Search restaurants
  GET    /api/restaurants/:id              → Restaurant profile
  GET    /api/restaurants/:id/reviews      → All reviews (paginated)
  GET    /api/restaurants/:id/friends-reviews → Friends' reviews only
  GET    /api/restaurants/categories       → List cuisine categories
  GET    /api/restaurants/by-category/:slug → By cuisine type
  GET    /api/restaurants/new?city=1       → New restaurants (≤6 months)

REVIEWS
  POST   /api/reviews                     → Create review
  PUT    /api/reviews/:id                 → Edit review
  DELETE /api/reviews/:id                 → Delete review
  GET    /api/reviews/:id                 → Get review detail
  POST   /api/reviews/:id/like            → Like review
  DELETE /api/reviews/:id/like            → Unlike review
  GET    /api/reviews/:id/comments        → Get comments (visibility filtered)
  POST   /api/reviews/:id/comments        → Add comment

FEED
  GET    /api/feed?cursor=&limit=20       → Home feed
  GET    /api/feed/trending?city=1        → Trending restaurants

RANKINGS
  GET    /api/rankings/all?city=&limit=   → All-users ranking
  GET    /api/rankings/friends?city=      → Friends ranking
  GET    /api/rankings/category/:slug?city= → Category ranking

WANT TO TRY
  POST   /api/want-to-try/:restaurantId   → Bookmark
  DELETE /api/want-to-try/:restaurantId   → Remove bookmark
  GET    /api/want-to-try                 → My bookmarks

NOTIFICATIONS
  GET    /api/notifications               → My notifications
  PUT    /api/notifications/:id/read      → Mark as read
  PUT    /api/notifications/read-all      → Mark all as read
```

### 5.2 Example API Response — Feed Item

```json
{
  "items": [
    {
      "type": "review",
      "id": "a1b2c3d4-...",
      "createdAt": "2026-10-24T12:30:00Z",
      "user": {
        "username": "anna_oslo",
        "displayName": "Anna Johansen",
        "profilePhotoUrl": "/avatars/anna.jpg"
      },
      "restaurant": {
        "id": "r1r2r3r4-...",
        "name": "Maaemo",
        "cuisineType": "Nordic Fine Dining",
        "isNew": false
      },
      "review": {
        "rating": 9,
        "title": "Absolutely extraordinary (#2)",
        "bodyPreview": "Second visit and somehow even better than the first...",
        "visitNumber": 2,
        "priceRange": 4,
        "visibility": "Public",
        "photos": [
          { "url": "/photos/review1_1.jpg", "caption": "Tasting menu course 3" },
          { "url": "/photos/review1_2.jpg", "caption": "Wine pairing" }
        ],
        "tags": ["Fine Dining", "Special Occasion"],
        "likeCount": 5,
        "commentCount": 2,
        "isLikedByMe": true
      }
    },
    {
      "type": "wantToTry",
      "id": "w1w2w3w4-...",
      "createdAt": "2026-10-24T11:00:00Z",
      "user": {
        "username": "erik_bergen",
        "displayName": "Erik Pedersen",
        "profilePhotoUrl": "/avatars/erik.jpg"
      },
      "restaurant": {
        "id": "r5r6r7r8-...",
        "name": "Lysverket",
        "cuisineType": "Modern Norwegian",
        "averageRating": 8.3
      }
    }
  ],
  "nextCursor": "2026-10-24T10:00:00Z",
  "hasMore": true
}
```

---

## 6. Key Business Logic

### 6.1 Comment Visibility Rule

Comments on a review are visible to you only if:
- You are the review author, **OR**
- You wrote the comment, **OR**
- You follow **both** the review author and the commenter

**Implementation:** SQL query joins the `Follow` table to filter comments at the database level. This is not UI-level filtering — the API never returns comments you shouldn't see.

```sql
-- Pseudocode for comment visibility
SELECT c.* FROM ReviewComment c
WHERE c.ReviewId = @reviewId
AND (
    c.UserId = @currentUserId                    -- I wrote it
    OR r.UserId = @currentUserId                 -- I'm the review author
    OR (
        EXISTS (SELECT 1 FROM Follow WHERE FollowerId = @currentUserId AND FolloweeId = r.UserId)
        AND EXISTS (SELECT 1 FROM Follow WHERE FollowerId = @currentUserId AND FolloweeId = c.UserId)
    )
)
```

### 6.2 Visit Number Auto-Calculation

```csharp
// When creating a review
var visitNumber = await _context.Reviews
    .CountAsync(r => r.UserId == userId && r.RestaurantId == restaurantId) + 1;

review.VisitNumber = visitNumber;

if (visitNumber > 1)
    review.Title = $"{userTitle} (#{visitNumber})";
```

### 6.3 Trending Algorithm

Monthly trend score per restaurant per municipality:

```
TrendScore = 0.35 × NormalisedReviewCount
           + 0.25 × AverageRecentRating  
           + 0.20 × NormalisedWantToTryAdds
           + 0.20 × NormalisedUniqueReviewers
```

All values normalised to 0–1 range within the municipality. Recalculated on-demand for the prototype (scheduled job in production).

### 6.4 "New" Restaurant Badge

```csharp
public bool IsNew => OpenedDate.HasValue 
    && OpenedDate.Value >= DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));
```

### 6.5 Rankings Qualification

- **All Users ranking:** minimum 3 public reviews
- **Friends ranking:** minimum 2 reviews from people you follow
- Rankings are scoped to municipality

### 6.6 Feed Composition

Strictly chronological — no algorithm. The feed merges three streams by `CreatedAt`:
1. Reviews from people you follow (public + FriendsOnly)
2. "Want to Try" bookmarks from people you follow
3. Trending cards injected at morning/evening time slots

---

## 7. Implementation Code Structure

### 7.1 Solution Layout

```
FoodieFriends/
├── src/
│   ├── FoodieFriends.Api/               ← ASP.NET Core Web API
│   │   ├── Controllers/
│   │   │   ├── LocationsController.cs
│   │   │   ├── UsersController.cs
│   │   │   ├── FollowsController.cs
│   │   │   ├── RestaurantsController.cs
│   │   │   ├── ReviewsController.cs
│   │   │   ├── FeedController.cs
│   │   │   ├── RankingsController.cs
│   │   │   ├── WantToTryController.cs
│   │   │   └── NotificationsController.cs
│   │   ├── DTOs/                         ← Request/Response models
│   │   │   ├── ReviewDto.cs
│   │   │   ├── FeedItemDto.cs
│   │   │   ├── RestaurantDto.cs
│   │   │   └── ...
│   │   ├── Services/
│   │   │   ├── FeedService.cs            ← Feed composition logic
│   │   │   ├── RankingService.cs         ← Ranking calculations
│   │   │   ├── TrendingService.cs        ← Trending algorithm
│   │   │   └── NotificationService.cs
│   │   ├── Middleware/
│   │   │   └── CurrentUserMiddleware.cs  ← Simulates auth
│   │   └── Program.cs
│   │
│   ├── FoodieFriends.Core/              ← Domain models (no dependencies)
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Restaurant.cs
│   │   │   ├── Review.cs
│   │   │   ├── ReviewPhoto.cs
│   │   │   ├── Follow.cs
│   │   │   ├── WantToTry.cs
│   │   │   ├── ReviewLike.cs
│   │   │   ├── ReviewComment.cs
│   │   │   ├── Municipality.cs
│   │   │   ├── Country.cs
│   │   │   ├── Tag.cs
│   │   │   ├── Notification.cs
│   │   │   └── TrendingRestaurant.cs
│   │   ├── Enums/
│   │   │   ├── ReviewVisibility.cs
│   │   │   └── NotificationType.cs
│   │   └── Interfaces/
│   │       ├── IReviewRepository.cs
│   │       ├── IRestaurantRepository.cs
│   │       └── ...
│   │
│   ├── FoodieFriends.Infrastructure/    ← Data access, external services
│   │   ├── Data/
│   │   │   ├── FoodieFriendsDbContext.cs
│   │   │   └── SeedData.cs              ← Demo data seeder
│   │   ├── Repositories/
│   │   │   ├── ReviewRepository.cs
│   │   │   ├── RestaurantRepository.cs
│   │   │   └── ...
│   │   └── Migrations/
│   │
│   └── FoodieFriends.Web/              ← React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Navbar.tsx
│       │   │   │   ├── BottomNav.tsx
│       │   │   │   └── Layout.tsx
│       │   │   ├── feed/
│       │   │   │   ├── ReviewCard.tsx
│       │   │   │   ├── WantToTryCard.tsx
│       │   │   │   ├── TrendingCard.tsx
│       │   │   │   └── PhotoCarousel.tsx
│       │   │   ├── restaurant/
│       │   │   │   ├── RestaurantCard.tsx
│       │   │   │   ├── RestaurantHeader.tsx
│       │   │   │   └── ReviewForm.tsx
│       │   │   ├── user/
│       │   │   │   ├── UserCard.tsx
│       │   │   │   ├── ProfileHeader.tsx
│       │   │   │   └── FollowButton.tsx
│       │   │   └── common/
│       │   │       ├── StarRating.tsx
│       │   │       ├── PriceRange.tsx
│       │   │       ├── NewBadge.tsx
│       │   │       └── InfiniteScroll.tsx
│       │   ├── pages/
│       │   │   ├── EntryPage.tsx
│       │   │   ├── FeedPage.tsx
│       │   │   ├── DiscoverPage.tsx
│       │   │   ├── RestaurantPage.tsx
│       │   │   ├── WriteReviewPage.tsx
│       │   │   ├── RankingsPage.tsx
│       │   │   ├── WantToTryPage.tsx
│       │   │   ├── UserProfilePage.tsx
│       │   │   ├── MyProfilePage.tsx
│       │   │   ├── NotificationsPage.tsx
│       │   │   └── SearchPage.tsx
│       │   ├── hooks/
│       │   │   ├── useFeed.ts
│       │   │   ├── useRestaurant.ts
│       │   │   └── useCurrentUser.ts
│       │   ├── services/
│       │   │   └── api.ts                ← Axios/fetch API client
│       │   ├── contexts/
│       │   │   ├── UserContext.tsx
│       │   │   └── LocationContext.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── index.html
│       ├── tailwind.config.js
│       └── vite.config.ts
│
├── tests/
│   ├── FoodieFriends.Api.Tests/
│   └── FoodieFriends.Infrastructure.Tests/
├── docker-compose.yml                    ← PostgreSQL container
└── FoodieFriends.sln
```

### 7.2 Key Implementation Patterns

#### Repository Pattern
```csharp
// Interface in Core
public interface IReviewRepository
{
    Task<Review> GetByIdAsync(Guid id);
    Task<IEnumerable<Review>> GetByRestaurantAsync(Guid restaurantId, int page, int pageSize);
    Task<IEnumerable<Review>> GetFriendReviewsForRestaurantAsync(Guid restaurantId, Guid userId);
    Task<Review> CreateAsync(Review review);
    Task<int> GetVisitNumberAsync(Guid userId, Guid restaurantId);
}

// Implementation in Infrastructure
public class ReviewRepository : IReviewRepository
{
    private readonly FoodieFriendsDbContext _context;
    // ... EF Core queries
}
```

#### Service Layer
```csharp
// Feed composition in Api/Services
public class FeedService
{
    public async Task<FeedResponse> GetFeedAsync(Guid userId, string? cursor, int limit)
    {
        // 1. Get friend reviews
        // 2. Get friend want-to-try events  
        // 3. Merge chronologically
        // 4. Inject trending card if time slot matches
        // 5. Apply cursor-based pagination
    }
}
```

#### Simulated Auth (Prototype)
```csharp
// Middleware that reads X-User-Id header or localStorage-based user ID
public class CurrentUserMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        var userId = context.Request.Headers["X-User-Id"].FirstOrDefault();
        if (userId != null)
            context.Items["CurrentUserId"] = Guid.Parse(userId);
        await _next(context);
    }
}
```

---

## 8. UI Design Direction

### 8.1 Visual Language

- **Primary colour:** Coral/orange (#FF6B35) — warm, appetising
- **Secondary:** Cream (#FFF8F0) — background
- **Accent:** Deep teal (#1A535C) — buttons, links
- **Text:** Charcoal (#2D3436) — high contrast
- **Cards:** White with subtle shadow, rounded corners (12px)
- **Font:** Inter (UI) + optional display font for headings

### 8.2 Responsive Approach

| Viewport | Layout |
|---|---|
| **Mobile** (< 640px) | Single column, bottom navigation bar, cards full-width |
| **Tablet** (640–1024px) | Two-column discover grid, side navigation |
| **Desktop** (> 1024px) | Three-column layout (nav · feed · sidebar), wider cards |

### 8.3 Component Library

Using **Tailwind CSS** with custom design tokens. No external component library (Shadcn, MUI) — keeping it lightweight. Key reusable components:

- `<StarRating />` — interactive 1-10 star display/picker
- `<PriceRange />` — dollar sign indicators (💰–💰💰💰💰)
- `<NewBadge />` — green "NEW" pill badge
- `<PhotoCarousel />` — swipeable image gallery
- `<InfiniteScroll />` — scroll-triggered pagination wrapper
- `<FollowButton />` — follow/unfollow toggle with optimistic update

---

## 9. How to Run the Prototype

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Docker (for PostgreSQL) or a local PostgreSQL 16 installation

### Quick Start

```bash
# 1. Start PostgreSQL via Docker
docker-compose up -d

# 2. Run database migrations + seed data
cd src/FoodieFriends.Api
dotnet ef database update

# 3. Start the API backend
dotnet run

# 4. Start the React frontend (in a separate terminal)
cd src/FoodieFriends.Web
npm install
npm run dev
```

The app will be available at `http://localhost:5173` with the API at `http://localhost:5000`.

---

## 10. AI-Assisted Development Process

### 10.1 Methodology

This project follows an **AI-assisted pair programming** methodology:

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   Human      │     │  AI Assistant  │     │   Codebase   │
│  (Designer/  │◄───►│  (Antigravity/ │◄───►│  (Git repo)  │
│   Director)  │     │   Claude)      │     │              │
└──────────────┘     └───────────────┘     └──────────────┘
       │                     │
       │  Requirements       │  Architecture
       │  Decisions          │  Code generation
       │  Feedback           │  Bug fixes
       │  Approval           │  Testing
```

### 10.2 Multi-Agent Architecture

For the build phase, we use a **multi-agent pattern** where:

- **Orchestrator Agent** — plans work, reviews output, makes architecture decisions
- **Backend Worker Agent** — writes C# code: entities, controllers, services, migrations
- **Frontend Worker Agent** — writes TypeScript/React code: components, pages, hooks

This parallelises development: the backend and frontend agents work simultaneously on independent tasks, with the orchestrator coordinating and resolving conflicts.

### 10.3 Human-AI Collaboration Points

| Stage | Human Role | AI Role |
|---|---|---|
| **Requirements** | Describes vision, makes decisions | Asks structured questions, identifies gaps |
| **Design** | Approves architecture, picks trade-offs | Proposes tech stack, writes SDD |
| **Implementation** | Reviews code, tests features | Generates code, fixes bugs |
| **Testing** | Validates UX, acceptance criteria | Writes unit tests, catches edge cases |

---

## 11. Testing Strategy (Prototype)

### Unit Tests
- Repository query tests with in-memory database
- Service layer logic tests (feed composition, ranking calculation, trending algorithm)
- Visit number calculation tests

### Integration Tests
- API endpoint tests with `WebApplicationFactory`
- Full request/response validation
- Seed data verification

### Manual Testing
- Walk through each page with demo data
- Test all user flows (review creation, follow, like, comment)
- Responsive design at mobile/tablet/desktop breakpoints

---

## 12. Known Limitations (Prototype)

1. **No real authentication** — anyone can impersonate any user by changing the X-User-Id header
2. **No external API** — restaurants are seeded, not pulled from Google Places
3. **Local image storage** — photos stored on disk, not CDN; won't scale
4. **No caching** — every request hits the database directly
5. **No rate limiting** — API is unprotected
6. **No input sanitisation** — XSS prevention not implemented
7. **No GDPR** — no data export or deletion flows
8. **Single timezone** — trending time slots don't account for per-user timezone

These are all addressed in the [Full Production SDD](./FoodieFriends_SDD_Full.md).

---

## 13. References

- [ASP.NET Core 8 Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [React 18 Documentation](https://react.dev/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Hudd (Norwegian Social Media)](https://joinhudd.com/) — friend discovery inspiration
