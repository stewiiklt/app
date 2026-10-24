import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Star, Image as ImageIcon, Info as InfoIcon, PenLine, ArrowLeft } from 'lucide-react';
import { Restaurant, Review } from '../types';
import { api } from '../services/api';
import { RestaurantHeader } from '../components/restaurant/RestaurantHeader';
import { ReviewCard } from '../components/feed/ReviewCard';

export const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'all' | 'photos' | 'info'>('friends');

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    const restData = await api.getRestaurantById(id);
    const revData = await api.getRestaurantReviews(id, activeTab === 'friends');
    setRestaurant(restData);
    setReviews(revData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id, activeTab]);

  if (loading && !restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-64 bg-white rounded-3xl animate-pulse shadow-soft mb-6" />
        <div className="h-32 bg-white rounded-2xl animate-pulse shadow-soft" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">Restaurant not found</h2>
        <Link to="/discover" className="mt-4 inline-block text-sm text-coral-600 font-bold hover:underline">
          Return to Discover
        </Link>
      </div>
    );
  }

  // Gather all photos across all reviews for the Photos tab
  const allPhotos = reviews.flatMap((r) => r.photos || []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Back button */}
      <Link
        to="/discover"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-coral-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover</span>
      </Link>

      {/* Hero Header */}
      <RestaurantHeader restaurant={restaurant} />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-gray-200/80 mb-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('friends')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'friends'
              ? 'border-teal-700 text-teal-800 bg-teal-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4 text-teal-600" />
          <span>Friends' Reviews ({restaurant.friendReviewsCount || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-coral-500 text-coral-600 bg-coral-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>All Reviews ({restaurant.totalReviews})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos ({allPhotos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'info'
              ? 'border-charcoal-900 text-charcoal-900 bg-cream-100 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <InfoIcon className="w-4 h-4" />
          <span>Info & Details</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-xs text-teal-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-teal-600" />
              Surfacing reviews from people you follow first.
            </span>
            <Link
              to={`/restaurant/${restaurant.id}/review`}
              className="text-xs font-bold text-teal-900 underline hover:no-underline"
            >
              Add yours
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-soft">
              <p className="text-sm font-bold text-charcoal-800">No friend reviews yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Be the first among your friends to review {restaurant.name}!
              </p>
              <Link
                to={`/restaurant/${restaurant.id}/review`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral-500 text-white font-bold text-xs"
              >
                <PenLine className="w-4 h-4" />
                <span>Write a Review</span>
              </Link>
            </div>
          ) : (
            reviews.map((rev) => <ReviewCard key={rev.id} review={rev} onLikeToggle={loadData} />)
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} onLikeToggle={loadData} />
          ))}
        </div>
      )}

      {activeTab === 'photos' && (
        <div>
          {allPhotos.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xs">
              No review photos uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allPhotos.map((photo, i) => (
                <div key={photo.id || i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Dish photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white truncate">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">About</h4>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              {restaurant.description || 'No description provided.'}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Location</h4>
            <p className="text-sm font-semibold text-charcoal-900">{restaurant.address}</p>
            <p className="text-xs text-gray-500 mt-0.5">{restaurant.cityName}, Scandinavia</p>
          </div>

          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tags</h4>
              <div className="flex items-center gap-2 flex-wrap">
                {restaurant.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-cream-100 text-charcoal-800 px-3 py-1 rounded-xl text-xs font-medium border border-amber-200"
                  >
                    🏷️ {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
