import { Restaurant, Review, FeedItem, NotificationItem, User, WantToTryItem } from '../types';
import { MOCK_RESTAURANTS, MOCK_REVIEWS, MOCK_NOTIFICATIONS } from './mockData';
import { DEMO_USERS } from '../contexts/UserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// In-memory / session state so offline mode supports active mutations!
let localRestaurants = [...MOCK_RESTAURANTS];
let localReviews = [...MOCK_REVIEWS];
let localNotifications = [...MOCK_NOTIFICATIONS];

// Load local reviews from storage if any
const savedReviews = localStorage.getItem('foodiefriends_local_reviews');
if (savedReviews) {
  try {
    localReviews = JSON.parse(savedReviews);
  } catch (e) {
    console.error(e);
  }
}

// Helper to make API requests with timeout and fallback
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout for quick fallback

  try {
    const currentUserId = localStorage.getItem('foodiefriends_user')
      ? JSON.parse(localStorage.getItem('foodiefriends_user')!).id
      : DEMO_USERS[0].id;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': currentUserId,
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(timeoutId);
    return null; // Fallback to mock data
  }
}

export const api = {
  // Feed
  async getFeed(cityId?: number): Promise<FeedItem[]> {
    const apiResult = await apiFetch<FeedItem[]>(`/api/feed?city=${cityId || 1}`);
    if (apiResult && apiResult.length > 0) return apiResult;

    // Fallback: compose chronological feed
    const feedItems: FeedItem[] = [];

    // Add reviews as feed items
    for (const r of localReviews) {
      feedItems.push({
        type: 'review',
        id: `feed-${r.id}`,
        createdAt: r.createdAt,
        user: r.user,
        restaurant: {
          id: r.restaurantId,
          name: r.restaurantName,
          cuisineType: r.restaurantCuisine || 'Cuisine',
          isNew: r.isRestaurantNew,
        },
        review: {
          id: r.id,
          rating: r.rating,
          title: r.title,
          bodyPreview: r.body.length > 140 ? r.body.slice(0, 140) + '...' : r.body,
          body: r.body,
          visitNumber: r.visitNumber,
          priceRange: r.priceRange,
          visibility: r.visibility,
          photos: r.photos,
          tags: r.tags,
          likeCount: r.likeCount,
          commentCount: r.comments ? r.comments.length : r.commentCount,
          isLikedByMe: r.isLikedByMe,
          comments: r.comments,
        },
      });
    }

    // Add a WantToTry item
    feedItems.push({
      type: 'wantToTry',
      id: 'feed-want-1',
      createdAt: '2026-10-23T15:20:00Z',
      user: {
        username: 'sofia_sthlm',
        displayName: 'Sofia Lindqvist',
        profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
      },
      restaurant: {
        id: 'r3',
        name: 'Hot Shop',
        cuisineType: 'Modern Scandinavian',
        averageRating: 9.2,
      },
    });

    // Add a Trending Card
    feedItems.push({
      type: 'trending',
      id: 'feed-trending-1',
      createdAt: '2026-10-24T08:00:00Z',
      city: 'Oslo',
      restaurants: [
        { id: 'r1', name: 'Maaemo', cuisineType: 'Nordic Fine Dining', averageRating: 9.6, reviewCount: 24, rank: 1 },
        { id: 'r3', name: 'Hot Shop', cuisineType: 'Modern Scandinavian', averageRating: 9.2, reviewCount: 31, rank: 2 },
        { id: 'r4', name: 'Fiskeriet Youngstorget', cuisineType: 'Seafood', averageRating: 8.8, reviewCount: 62, rank: 3 },
      ],
    });

    // Sort by createdAt desc
    feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return feedItems;
  },

  // Restaurants
  async getRestaurants(params?: {
    query?: string;
    cityId?: number;
    cuisine?: string;
    priceRange?: number;
    isNew?: boolean;
  }): Promise<Restaurant[]> {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set('q', params.query);
    if (params?.cityId) queryParams.set('city', params.cityId.toString());

    const apiResult = await apiFetch<Restaurant[]>(`/api/restaurants?${queryParams.toString()}`);
    let results = apiResult || localRestaurants;

    if (params?.cityId) {
      results = results.filter((r) => r.municipalityId === params.cityId);
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisineType.toLowerCase().includes(q) ||
          (r.cityName && r.cityName.toLowerCase().includes(q))
      );
    }
    if (params?.cuisine && params.cuisine !== 'All') {
      results = results.filter((r) => r.cuisineType.toLowerCase().includes(params.cuisine!.toLowerCase()));
    }
    if (params?.priceRange) {
      results = results.filter((r) => r.priceRange === params.priceRange);
    }
    if (params?.isNew) {
      results = results.filter((r) => r.isNew);
    }

    return results;
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const apiResult = await apiFetch<Restaurant>(`/api/restaurants/${id}`);
    if (apiResult) return apiResult;
    return localRestaurants.find((r) => r.id === id) || null;
  },

  async getRestaurantReviews(restaurantId: string, friendsOnly = false): Promise<Review[]> {
    const endpoint = friendsOnly
      ? `/api/restaurants/${restaurantId}/friends-reviews`
      : `/api/restaurants/${restaurantId}/reviews`;
    const apiResult = await apiFetch<Review[]>(endpoint);
    if (apiResult) return apiResult;

    let reviews = localReviews.filter((r) => r.restaurantId === restaurantId);
    if (friendsOnly) {
      // Return reviews from other demo users
      reviews = reviews.filter((r) => r.visibility === 'Public' || r.visibility === 'FriendsOnly');
    }
    return reviews;
  },

  // Review Actions
  async createReview(data: {
    restaurantId: string;
    rating: number;
    title: string;
    body: string;
    priceRange: number;
    visibility: 'Public' | 'FriendsOnly';
    photos: { url: string; caption?: string }[];
    tags: string[];
    user: User;
  }): Promise<Review> {
    const apiResult = await apiFetch<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (apiResult) return apiResult;

    const targetRestaurant = localRestaurants.find((r) => r.id === data.restaurantId);
    const existingVisits = localReviews.filter(
      (r) => r.userId === data.user.id && r.restaurantId === data.restaurantId
    ).length;
    const visitNumber = existingVisits + 1;

    const fullTitle = visitNumber > 1 ? `${data.title} (#${visitNumber})` : data.title;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: data.user.id,
      restaurantId: data.restaurantId,
      restaurantName: targetRestaurant?.name || 'Restaurant',
      restaurantCuisine: targetRestaurant?.cuisineType,
      restaurantCity: targetRestaurant?.cityName,
      isRestaurantNew: targetRestaurant?.isNew,
      user: {
        id: data.user.id,
        username: data.user.username,
        displayName: data.user.displayName,
        profilePhotoUrl: data.user.profilePhotoUrl,
      },
      rating: data.rating,
      title: fullTitle,
      body: data.body,
      visitNumber,
      priceRange: data.priceRange,
      visibility: data.visibility,
      photos: data.photos.map((p, idx) => ({ id: `p-${Date.now()}-${idx}`, ...p })),
      tags: data.tags,
      likeCount: 0,
      commentCount: 0,
      isLikedByMe: false,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    localReviews = [newReview, ...localReviews];
    localStorage.setItem('foodiefriends_local_reviews', JSON.stringify(localReviews));

    // Update restaurant average
    if (targetRestaurant) {
      const restReviews = localReviews.filter((r) => r.restaurantId === targetRestaurant.id);
      const sum = restReviews.reduce((acc, curr) => acc + curr.rating, 0);
      targetRestaurant.totalReviews = restReviews.length;
      targetRestaurant.averageRating = Number((sum / restReviews.length).toFixed(1));
    }

    return newReview;
  },

  async toggleLikeReview(reviewId: string): Promise<{ liked: boolean; count: number }> {
    const rev = localReviews.find((r) => r.id === reviewId);
    if (!rev) return { liked: false, count: 0 };
    rev.isLikedByMe = !rev.isLikedByMe;
    rev.likeCount = rev.isLikedByMe ? rev.likeCount + 1 : Math.max(0, rev.likeCount - 1);
    localStorage.setItem('foodiefriends_local_reviews', JSON.stringify(localReviews));
    return { liked: rev.isLikedByMe, count: rev.likeCount };
  },

  async addComment(reviewId: string, text: string, user: User): Promise<any> {
    const rev = localReviews.find((r) => r.id === reviewId);
    if (!rev) return null;
    const newComment = {
      id: `c-${Date.now()}`,
      reviewId,
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      userAvatar: user.profilePhotoUrl,
      text,
      createdAt: new Date().toISOString(),
    };
    if (!rev.comments) rev.comments = [];
    rev.comments.push(newComment);
    rev.commentCount = rev.comments.length;
    localStorage.setItem('foodiefriends_local_reviews', JSON.stringify(localReviews));
    return newComment;
  },

  // Rankings
  async getRankings(tab: 'all' | 'friends' | 'category', cityId: number, category?: string) {
    const cityRestaurants = localRestaurants.filter((r) => r.municipalityId === cityId);

    if (tab === 'friends') {
      return cityRestaurants
        .filter((r) => (r.friendReviewsCount || 0) >= 2)
        .sort((a, b) => (b.friendsRating || 0) - (a.friendsRating || 0));
    }

    if (tab === 'category' && category) {
      return cityRestaurants
        .filter((r) => r.cuisineType.toLowerCase().includes(category.toLowerCase()))
        .sort((a, b) => b.averageRating - a.averageRating);
    }

    // All users tab (qualification: min 3 reviews)
    return cityRestaurants
      .filter((r) => r.totalReviews >= 3)
      .sort((a, b) => b.averageRating - a.averageRating);
  },

  // Want to Try
  async getWantToTry(restaurantIds: string[]): Promise<Restaurant[]> {
    return localRestaurants.filter((r) => restaurantIds.includes(r.id));
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const apiResult = await apiFetch<NotificationItem[]>('/api/notifications');
    return apiResult || localNotifications;
  },

  async markAllNotificationsRead(): Promise<void> {
    localNotifications = localNotifications.map((n) => ({ ...n, isRead: true }));
  },

  // Users
  async getUser(username: string): Promise<User | null> {
    return DEMO_USERS.find((u) => u.username === username) || null;
  },

  async searchUsers(query: string): Promise<User[]> {
    const q = query.toLowerCase();
    return DEMO_USERS.filter(
      (u) => u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)
    );
  },

  async getSuggestedUsers(currentUserId: string): Promise<User[]> {
    return DEMO_USERS.filter((u) => u.id !== currentUserId).slice(0, 3);
  },
};
