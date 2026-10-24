import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Sparkles, Filter, RefreshCw, Compass } from 'lucide-react';
import { FeedItem } from '../types';
import { api } from '../services/api';
import { useLocationContext } from '../contexts/LocationContext';
import { useUserContext } from '../contexts/UserContext';
import { ReviewCard } from '../components/feed/ReviewCard';
import { WantToTryCard } from '../components/feed/WantToTryCard';
import { TrendingCard } from '../components/feed/TrendingCard';

export const FeedPage: React.FC = () => {
  const { currentCity, currentCountry } = useLocationContext();
  const { currentUser } = useUserContext();

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reviews' | 'wantToTry'>('all');

  const loadFeed = async () => {
    setLoading(true);
    const items = await api.getFeed(currentCity.id);
    setFeedItems(items);
    setLoading(false);
  };

  useEffect(() => {
    loadFeed();
  }, [currentCity.id]);

  const filteredItems = feedItems.filter((item) => {
    if (activeFilter === 'reviews') return item.type === 'review';
    if (activeFilter === 'wantToTry') return item.type === 'wantToTry';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Banner / Feed Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
            <span>Foodie Feed</span>
            <span className="text-sm font-bold text-coral-600 bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
              {currentCountry.flag} {currentCity.name}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real restaurant experiences from friends in your circle
          </p>
        </div>

        <Link
          to="/restaurant/r3/review"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <PenLine className="w-4 h-4" />
          <span>Write Review</span>
        </Link>
      </div>

      {/* Feed Filters */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-charcoal-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'
            }`}
          >
            All Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('reviews')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'reviews'
                ? 'bg-coral-500 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'
            }`}
          >
            Reviews
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('wantToTry')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'wantToTry'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-cream-100 border border-gray-200'
            }`}
          >
            Want to Try
          </button>
        </div>

        <button
          type="button"
          onClick={loadFeed}
          className="p-1.5 rounded-full text-gray-400 hover:text-charcoal-900 transition-colors"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Feed Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
              <div className="h-48 bg-gray-100 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-soft">
          <div className="w-14 h-14 rounded-full bg-cream-100 text-coral-500 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-charcoal-900">Your feed is quiet in {currentCity.name}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            Follow more foodies or write the first review for a restaurant you recently visited!
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs"
          >
            <span>Discover Restaurants</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredItems.map((item) => {
            if (item.type === 'review') {
              // Cast into Review shape
              const reviewObj = {
                id: item.review.id,
                userId: item.user.id,
                restaurantId: item.restaurant.id,
                restaurantName: item.restaurant.name,
                restaurantCuisine: item.restaurant.cuisineType,
                restaurantCity: currentCity.name,
                isRestaurantNew: item.restaurant.isNew,
                user: item.user,
                rating: item.review.rating,
                title: item.review.title,
                body: item.review.body,
                visitNumber: item.review.visitNumber,
                priceRange: item.review.priceRange,
                visibility: item.review.visibility,
                photos: item.review.photos,
                tags: item.review.tags,
                likeCount: item.review.likeCount,
                commentCount: item.review.commentCount,
                isLikedByMe: item.review.isLikedByMe,
                createdAt: item.createdAt,
                comments: item.review.comments,
              };
              return <ReviewCard key={item.id} review={reviewObj} onLikeToggle={loadFeed} />;
            }

            if (item.type === 'wantToTry') {
              return <WantToTryCard key={item.id} item={item} />;
            }

            if (item.type === 'trending') {
              return <TrendingCard key={item.id} item={item} />;
            }

            return null;
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) for mobile */}
      <div className="sm:hidden fixed bottom-18 right-4 z-30">
        <Link
          to="/restaurant/r3/review"
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-coral-500 to-amber-500 text-white flex items-center justify-center shadow-hover hover:scale-105 active:scale-95 transition-all"
          title="Write a Review"
        >
          <PenLine className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};
