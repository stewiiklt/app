/** JSON contracts mirrored from the ASP.NET API DTOs (camel-cased on the wire). */
export interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FeedItem {
  type: "review" | "wantToTry" | "trending" | string;
  id: string;
  createdAt: string;
  user: ReviewUserSummary | null;
  restaurant: FeedRestaurantSummary | null;
  review: FeedReviewDetails | null;
  trending: TrendingFeedDetails | null;
}

export interface FeedRestaurantSummary {
  id: string;
  name: string;
  cuisineType: string;
  cityName: string | null;
  averageRating: number | null;
  isNew: boolean;
}

export interface FeedReviewDetails {
  rating: number;
  title: string;
  body: string;
  bodyPreview: string;
  visitNumber: number;
  priceRange: number;
  visibility: string;
  photos: ReviewPhoto[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
}

export interface TrendingFeedDetails {
  cityName: string;
  restaurants: TrendingRestaurant[];
}

export interface TrendingRestaurant {
  rank: number;
  restaurantId: string;
  name: string;
  cuisineType: string;
  averageRating: number;
  reviewCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  municipalityId: number;
  cityName: string;
  cuisineType: string;
  priceRange: number;
  websiteUrl: string | null;
  menuUrl: string | null;
  coverImageUrl: string | null;
  averageRating: number;
  totalReviews: number;
  openedDate: string | null;
  isNew: boolean;
  friendsReviewCount: number;
  friendAverageRating: number | null;
  isWantToTry: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

export interface Review {
  id: string;
  createdAt: string;
  user: ReviewUserSummary;
  restaurant: ReviewRestaurantSummary;
  rating: number;
  title: string;
  body: string;
  visitNumber: number;
  priceRange: number;
  visibility: string;
  photos: ReviewPhoto[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
}

export interface ReviewUserSummary {
  id: string;
  username: string;
  displayName: string;
  profilePhotoUrl: string | null;
}

export interface ReviewRestaurantSummary {
  id: string;
  name: string;
  cuisineType: string;
  cityName: string;
  isNew: boolean;
}

export type ReviewVisibility = "Public" | "FriendsOnly";

export interface CreateReviewPhoto {
  url: string;
  caption?: string | null;
  order: number;
}

export interface CreateReview {
  restaurantId: string;
  rating: number;
  title: string;
  body: string;
  priceRangeIndicator: number;
  visibility: ReviewVisibility;
  tagIds?: number[] | null;
  photos?: CreateReviewPhoto[] | null;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  username: string;
  displayName: string;
  profilePhotoUrl: string | null;
  content: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  profilePhotoUrl: string | null;
  bio: string | null;
  cityId: number;
  cityName: string | null;
  countryCode: string | null;
  reviewCount: number;
  followingCount: number;
  followersCount: number;
  isFollowing: boolean;
  isMe: boolean;
}

export interface UserSummary {
  id: string;
  username: string;
  displayName: string;
  profilePhotoUrl: string | null;
  cityName: string | null;
  isFollowing: boolean;
  mutualFollowersCount: number;
}

export interface WantToTry {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  restaurantId: string;
  restaurant: WantToTryRestaurant;
  createdAt: string;
}

export interface WantToTryRestaurant {
  id: string;
  name: string;
  address: string;
  cuisineType: string;
  priceRange: number;
  coverImageUrl: string | null;
  averageRating: number;
  totalReviews: number;
  isNew: boolean;
  cityName: string;
}

export interface Country {
  code: string;
  name: string;
  flagEmoji: string;
  cityCount: number;
}

export interface City {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
}

export interface RankingRestaurant {
  rank: number;
  id: string;
  name: string;
  address: string;
  cuisineType: string;
  priceRange: number;
  coverImageUrl: string | null;
  averageRating: number;
  totalReviews: number;
  isNew: boolean;
  friendReviewCount: number;
  friendAverageRating: number | null;
}

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  actorUsername: string;
  actorDisplayName: string;
  actorProfilePhotoUrl: string | null;
  type: string;
  typeName: string;
  reviewId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
