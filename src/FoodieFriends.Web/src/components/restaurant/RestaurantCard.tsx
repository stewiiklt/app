import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Users, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';
import { StarRating } from '../common/StarRating';
import { PriceRange } from '../common/PriceRange';
import { NewBadge } from '../common/NewBadge';
import { useUserContext } from '../../contexts/UserContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isWantToTry, toggleWantToTry } = useUserContext();
  const bookmarked = isWantToTry(restaurant.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 hover:border-coral-200 transition-all group flex flex-col justify-between">
      <div>
        {/* Cover image & bookmark button */}
        <div className="relative aspect-16/9 overflow-hidden bg-gray-100">
          <img
            src={restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWantToTry(restaurant.id);
              }}
              className={`p-2 rounded-full shadow-md backdrop-blur-xs transition-all ${
                bookmarked
                  ? 'bg-coral-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-coral-600'
              }`}
              title="Bookmark to Want to Try"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>

          {restaurant.isNew && (
            <div className="absolute top-3 left-3">
              <NewBadge size="sm" />
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={`/restaurant/${restaurant.id}`} className="block">
              <h3 className="font-bold text-base text-charcoal-900 group-hover:text-coral-600 transition-colors">
                {restaurant.name}
              </h3>
            </Link>
            <StarRating rating={restaurant.averageRating} size="sm" />
          </div>

          <p className="text-xs text-gray-500 font-medium">
            {restaurant.cuisineType} • {restaurant.cityName || 'City'}
          </p>

          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {restaurant.description || restaurant.address}
          </p>
        </div>
      </div>

      {/* Footer bar */}
      <div className="p-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <PriceRange price={restaurant.priceRange} size="sm" />

        {restaurant.friendReviewsCount && restaurant.friendReviewsCount > 0 ? (
          <div className="flex items-center gap-1 text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3" />
            <span>{restaurant.friendReviewsCount} friend reviews</span>
          </div>
        ) : (
          <span className="text-gray-400">{restaurant.totalReviews} reviews</span>
        )}
      </div>
    </div>
  );
};
