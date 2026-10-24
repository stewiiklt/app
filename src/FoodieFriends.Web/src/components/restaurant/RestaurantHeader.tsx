import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ExternalLink,
  BookOpen,
  Bookmark,
  PenLine,
  Users,
  Star,
} from 'lucide-react';
import { Restaurant } from '../../types';
import { NewBadge } from '../common/NewBadge';
import { PriceRange } from '../common/PriceRange';
import { useUserContext } from '../../contexts/UserContext';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  const { isWantToTry, toggleWantToTry } = useUserContext();
  const bookmarked = isWantToTry(restaurant.id);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 mb-6">
      {/* Cover banner */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden bg-gray-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges in top right / left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {restaurant.isNew && <NewBadge />}
          <span className="bg-black/50 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {restaurant.cuisineType}
          </span>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
            {restaurant.name}
          </h1>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-200 mt-1">
            <MapPin className="w-4 h-4 text-coral-400 shrink-0" />
            <span>{restaurant.address}</span>
          </p>
        </div>
      </div>

      {/* Stats bar & Quick Actions */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          {/* Dual Score Badges: All-Users vs Friends-Only */}
          <div className="flex items-center gap-4">
            {/* Friends score */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black text-teal-900">
                    {restaurant.friendsRating ? restaurant.friendsRating.toFixed(1) : '—'}
                  </span>
                  <span className="text-xs text-teal-700 font-bold">/10</span>
                </div>
                <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Friends' Score
                </p>
              </div>
            </div>

            {/* All users score */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream-100 border border-amber-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shadow-sm">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black text-charcoal-900">
                    {restaurant.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">/10</span>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  All Users ({restaurant.totalReviews})
                </p>
              </div>
            </div>

            <div className="hidden lg:block pl-2">
              <PriceRange price={restaurant.priceRange} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleWantToTry(restaurant.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                bookmarked
                  ? 'bg-coral-50 border-coral-500 text-coral-600 shadow-xs'
                  : 'bg-white border-gray-300 text-charcoal-900 hover:border-coral-400 hover:text-coral-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-coral-600' : ''}`} />
              <span>{bookmarked ? 'Saved to Want to Try' : 'Want to Try'}</span>
            </button>

            <Link
              to={`/restaurant/${restaurant.id}/review`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
            >
              <PenLine className="w-4 h-4" />
              <span>Write Review</span>
            </Link>
          </div>
        </div>

        {/* Links row */}
        <div className="pt-4 flex items-center gap-4 flex-wrap text-xs text-gray-600">
          {restaurant.websiteUrl && (
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-coral-600 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Website</span>
            </a>
          )}
          {restaurant.menuUrl && (
            <a
              href={restaurant.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-coral-600 transition-colors font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Menu</span>
            </a>
          )}
          {restaurant.tags?.map((t) => (
            <span
              key={t}
              className="bg-cream-100 text-charcoal-800 px-2 py-0.5 rounded-md font-medium border border-amber-100"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
