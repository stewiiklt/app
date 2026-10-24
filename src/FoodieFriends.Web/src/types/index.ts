export interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  cities: City[];
}

export interface City {
  id: number;
  name: string;
  countryCode: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  profilePhotoUrl: string;
  bio: string;
  cityId: number;
  cityName?: string;
  reviewCount: number;
  followingCount: number;
  followersCount: number;
  isFollowing?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  municipalityId: number;
  cityName?: string;
  cuisineType: string;
  priceRange: number; // 1-4
  websiteUrl?: string;
  menuUrl?: string;
  averageRating: number; // 1-10
  friendsRating?: number; // 1-10
  totalReviews: number;
  friendReviewsCount?: number;
  openedDate?: string;
  isNew?: boolean;
  coverImage?: string;
  description?: string;
  tags?: string[];
  isWantToTry?: boolean;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine?: string;
  restaurantCity?: string;
  isRestaurantNew?: boolean;
  user: {
    id: string;
    username: string;
    displayName: string;
    profilePhotoUrl: string;
  };
  rating: number; // 1-10
  title: string;
  body: string;
  visitNumber: number;
  priceRange: number;
  visibility: 'Public' | 'FriendsOnly';
  photos: ReviewPhoto[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  comments?: ReviewComment[];
}

export interface WantToTryItem {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
  user: {
    username: string;
    displayName: string;
    profilePhotoUrl: string;
  };
  createdAt: string;
}

export type FeedItem =
  | {
      type: 'review';
      id: string;
      createdAt: string;
      user: {
        id: string;
        username: string;
        displayName: string;
        profilePhotoUrl: string;
      };
      restaurant: {
        id: string;
        name: string;
        cuisineType: string;
        isNew?: boolean;
      };
      review: {
        id: string;
        rating: number;
        title: string;
        bodyPreview: string;
        body: string;
        visitNumber: number;
        priceRange: number;
        visibility: 'Public' | 'FriendsOnly';
        photos: ReviewPhoto[];
        tags: string[];
        likeCount: number;
        commentCount: number;
        isLikedByMe: boolean;
        comments?: ReviewComment[];
      };
    }
  | {
      type: 'wantToTry';
      id: string;
      createdAt: string;
      user: {
        username: string;
        displayName: string;
        profilePhotoUrl: string;
      };
      restaurant: {
        id: string;
        name: string;
        cuisineType: string;
        averageRating: number;
      };
    }
  | {
      type: 'trending';
      id: string;
      createdAt: string;
      city: string;
      restaurants: {
        id: string;
        name: string;
        cuisineType: string;
        averageRating: number;
        reviewCount: number;
        rank: number;
      }[];
    };

export interface NotificationItem {
  id: string;
  type: 'NewReview' | 'Comment' | 'Like' | 'WantToTry';
  actor: {
    id: string;
    username: string;
    displayName: string;
    profilePhotoUrl: string;
  };
  restaurant?: {
    id: string;
    name: string;
  };
  reviewId?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}
