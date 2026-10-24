import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { useUserContext } from '../../contexts/UserContext';

interface WantToTryCardProps {
  item: {
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
  };
}

export const WantToTryCard: React.FC<WantToTryCardProps> = ({ item }) => {
  const { isWantToTry, toggleWantToTry } = useUserContext();
  const bookmarked = isWantToTry(item.restaurant.id);

  return (
    <div className="bg-gradient-to-r from-cream-100 to-amber-50/50 rounded-2xl p-4 border border-amber-200/60 shadow-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={item.user.profilePhotoUrl}
            alt={item.user.displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-300"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-coral-500 text-white flex items-center justify-center text-[10px] shadow-xs">
            📌
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">
            <Link to={`/user/${item.user.username}`} className="font-bold text-charcoal-900 hover:text-coral-600">
              {item.user.displayName}
            </Link>{' '}
            wants to try
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <Link
              to={`/restaurant/${item.restaurant.id}`}
              className="text-sm font-bold text-charcoal-900 hover:text-coral-600 transition-colors"
            >
              {item.restaurant.name}
            </Link>
            <span className="text-xs text-gray-400">• {item.restaurant.cuisineType}</span>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {item.restaurant.averageRating}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => toggleWantToTry(item.restaurant.id)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
          bookmarked
            ? 'bg-coral-500 text-white shadow-xs'
            : 'bg-white border border-gray-300 text-gray-700 hover:border-coral-400 hover:text-coral-600'
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-white' : ''}`} />
        <span>{bookmarked ? 'Saved' : 'Save Too'}</span>
      </button>
    </div>
  );
};
