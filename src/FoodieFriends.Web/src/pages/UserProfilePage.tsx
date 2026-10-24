import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, UtensilsCrossed, Bookmark, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { User, Review, Restaurant } from '../types';
import { api } from '../services/api';
import { useUserContext } from '../contexts/UserContext';
import { FollowButton } from '../components/common/FollowButton';
import { ReviewCard } from '../components/feed/ReviewCard';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

export const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser } = useUserContext();

  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'wantToTry' | 'photos'>('reviews');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!username) return;
      setLoading(true);
      const targetUser = await api.getUser(username);
      if (targetUser) {
        setUser(targetUser);
        // Load reviews written by this user
        const allRevs = await api.getRestaurantReviews('all'); // fallback will get all
        const userRevs = allRevs.filter((r) => r.userId === targetUser.id);
        setReviews(userRevs);

        // Load some sample want-to-try
        const wants = await api.getRestaurants();
        setBookmarkedRestaurants(wants.slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading && !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl h-64 animate-pulse shadow-soft" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-charcoal-900">User not found</h2>
        <Link to="/feed" className="mt-4 inline-block text-sm text-coral-600 font-bold hover:underline">
          Return to Feed
        </Link>
      </div>
    );
  }

  const userPhotos = reviews.flatMap((r) => r.photos || []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Back button */}
      <Link
        to="/feed"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-coral-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Feed</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user.profilePhotoUrl}
            alt={user.displayName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-coral-300 shadow-md shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="text-2xl font-black text-charcoal-900">{user.displayName}</h1>
                <p className="text-xs text-coral-600 font-bold">@{user.username}</p>
              </div>

              <div>
                <FollowButton userId={user.id} />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-4">
              {user.bio}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-500 mb-4">
              <MapPin className="w-3.5 h-3.5 text-coral-500" />
              <span>{user.cityName || 'Scandinavia'}</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-4 border-t border-gray-100 text-xs">
              <div>
                <span className="font-black text-charcoal-900 text-base">{reviews.length || user.reviewCount}</span>{' '}
                <span className="text-gray-500">Reviews</span>
              </div>
              <div>
                <span className="font-black text-charcoal-900 text-base">{user.followingCount}</span>{' '}
                <span className="text-gray-500">Following</span>
              </div>
              <div>
                <span className="font-black text-charcoal-900 text-base">{user.followersCount}</span>{' '}
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200/80 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reviews'
              ? 'border-coral-500 text-coral-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Reviews ({reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wantToTry')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'wantToTry'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Want to Try ({bookmarkedRestaurants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'photos'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos ({userPhotos.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-gray-400">
              No reviews written yet.
            </div>
          ) : (
            reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
          )}
        </div>
      )}

      {activeTab === 'wantToTry' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookmarkedRestaurants.map((rest) => (
            <RestaurantCard key={rest.id} restaurant={rest} />
          ))}
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userPhotos.map((photo, i) => (
            <div key={photo.id || i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img src={photo.url} alt="Review" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
