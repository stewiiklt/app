import { ApiClient, queryString } from "./client";
import type {
  Category,
  City,
  Comment,
  Country,
  CreateReview,
  FeedResponse,
  HealthResponse,
  Notification,
  RankingRestaurant,
  Restaurant,
  Review,
  UserProfile,
  UserSummary,
  WantToTry,
} from "./types";

/** Typed wrappers for the routes implemented by the current ASP.NET controllers. */
export class FoodieFriendsApi {
  constructor(private readonly http: ApiClient) {}

  health(): Promise<HealthResponse> {
    return this.http.request("/health");
  }

  countries(): Promise<Country[]> {
    return this.http.request("/api/locations/countries");
  }

  cities(country?: string): Promise<City[]> {
    return this.http.request(`/api/locations/cities${queryString({ country })}`);
  }

  /** The server feed is follow-based and has no city filter; use selected city for local discovery/trending. */
  feed(options: { cursor?: string | null; limit?: number } = {}): Promise<FeedResponse> {
    return this.http.request(`/api/feed${queryString(options)}`);
  }

  trending(city?: number): Promise<Array<{ rank: number; restaurantId: string; name: string; cuisineType: string; averageRating: number; reviewCount: number }>> {
    return this.http.request(`/api/feed/trending${queryString({ city })}`);
  }

  searchRestaurants(filters: { q?: string; city?: number; cuisine?: string; price?: number; isNew?: boolean } = {}): Promise<Restaurant[]> {
    return this.http.request(`/api/restaurants/search${queryString(filters)}`);
  }

  restaurant(id: string): Promise<Restaurant> {
    return this.http.request(`/api/restaurants/${encodeURIComponent(id)}`);
  }

  restaurantReviews(id: string, page = 1, pageSize = 20): Promise<Review[]> {
    return this.http.request(`/api/restaurants/${encodeURIComponent(id)}/reviews${queryString({ page, pageSize })}`);
  }

  friendsRestaurantReviews(id: string): Promise<Review[]> {
    return this.http.request(`/api/restaurants/${encodeURIComponent(id)}/friends-reviews`);
  }

  categories(): Promise<Category[]> {
    return this.http.request("/api/restaurants/categories");
  }

  restaurantsByCategory(slug: string, city?: number): Promise<Restaurant[]> {
    return this.http.request(`/api/restaurants/by-category/${encodeURIComponent(slug)}${queryString({ city })}`);
  }

  newRestaurants(city?: number): Promise<Restaurant[]> {
    return this.http.request(`/api/restaurants/new${queryString({ city })}`);
  }

  review(id: string): Promise<Review> {
    return this.http.request(`/api/reviews/${encodeURIComponent(id)}`);
  }

  createReview(review: CreateReview): Promise<Review> {
    return this.http.request("/api/reviews", { method: "POST", body: JSON.stringify(review) });
  }

  likeReview(id: string): Promise<LikeResult> {
    return this.http.request(`/api/reviews/${encodeURIComponent(id)}/like`, { method: "POST" });
  }

  unlikeReview(id: string): Promise<LikeResult> {
    return this.http.request(`/api/reviews/${encodeURIComponent(id)}/like`, { method: "DELETE" });
  }

  comments(reviewId: string): Promise<Comment[]> {
    return this.http.request(`/api/reviews/${encodeURIComponent(reviewId)}/comments`);
  }

  addComment(reviewId: string, content: string): Promise<Comment> {
    return this.http.request(`/api/reviews/${encodeURIComponent(reviewId)}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  follow(userId: string): Promise<void> {
    return this.http.request(`/api/follows/${encodeURIComponent(userId)}`, { method: "POST" });
  }

  unfollow(userId: string): Promise<void> {
    return this.http.request(`/api/follows/${encodeURIComponent(userId)}`, { method: "DELETE" });
  }

  following(): Promise<UserSummary[]> {
    return this.http.request("/api/follows/following");
  }

  followers(): Promise<UserSummary[]> {
    return this.http.request("/api/follows/followers");
  }

  savedPlaces(): Promise<WantToTry[]> {
    return this.http.request("/api/want-to-try");
  }

  savePlace(restaurantId: string): Promise<void> {
    return this.http.request(`/api/want-to-try/${encodeURIComponent(restaurantId)}`, { method: "POST" });
  }

  removeSavedPlace(restaurantId: string): Promise<void> {
    return this.http.request(`/api/want-to-try/${encodeURIComponent(restaurantId)}`, { method: "DELETE" });
  }

  me(): Promise<UserProfile> {
    return this.http.request("/api/users/me");
  }

  updateMe(update: { displayName?: string | null; bio?: string | null; profilePhotoUrl?: string | null; cityId?: number | null }): Promise<UserProfile> {
    return this.http.request("/api/users/me", { method: "PUT", body: JSON.stringify(update) });
  }

  user(username: string): Promise<UserProfile> {
    return this.http.request(`/api/users/${encodeURIComponent(username)}`);
  }

  searchUsers(q?: string): Promise<UserSummary[]> {
    return this.http.request(`/api/users/search${queryString({ q })}`);
  }

  userReviews(username: string, page = 1, pageSize = 20): Promise<Review[]> {
    return this.http.request(`/api/users/${encodeURIComponent(username)}/reviews${queryString({ page, pageSize })}`);
  }

  userSavedPlaces(username: string): Promise<WantToTry[]> {
    return this.http.request(`/api/users/${encodeURIComponent(username)}/want-to-try`);
  }

  followSuggestions(): Promise<UserSummary[]> {
    return this.http.request("/api/users/suggestions");
  }

  rankingsAll(city?: number, limit?: number): Promise<RankingRestaurant[]> {
    return this.http.request(`/api/rankings/all${queryString({ city, limit })}`);
  }

  rankingsFriends(city?: number, limit?: number): Promise<RankingRestaurant[]> {
    return this.http.request(`/api/rankings/friends${queryString({ city, limit })}`);
  }

  rankingsCategory(slug: string, city?: number, limit?: number): Promise<RankingRestaurant[]> {
    return this.http.request(`/api/rankings/category/${encodeURIComponent(slug)}${queryString({ city, limit })}`);
  }

  notifications(): Promise<Notification[]> {
    return this.http.request("/api/notifications");
  }

  markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.http.request(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PUT" });
  }

  markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.http.request("/api/notifications/read-all", { method: "PUT" });
  }
}

export interface LikeResult {
  success: boolean;
  isLiked: boolean;
  likeCount: number;
}
