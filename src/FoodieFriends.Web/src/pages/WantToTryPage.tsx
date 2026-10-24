import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Compass } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { useUserContext } from '../contexts/UserContext';
import { StarRating } from '../components/common/StarRating';
import { PriceRange } from '../components/common/PriceRange';

export const WantToTryPage: React.FC = () => {
  const { currentUser, wantToTryIds, toggleWantToTry } = useUserContext();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getWantToTry(wantToTryIds);
      setRestaurants(data);
      setLoading(false);
    }
    load();
  }, [wantToTryIds]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-coral-500 fill-coral-500" />
            <span>Want to Try List</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your personal bucket list of restaurants to visit next across Scandinavia.
          </p>
        </div>

        <span className="text-xs font-bold bg-coral-100 text-coral-700 px-3 py-1.5 rounded-full">
          {restaurants.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-36 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-coral-500 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-charcoal-900">Your bookmark list is empty</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Whenever you spot an appetizing dish or friend recommendation, tap the bookmark icon to save it here!
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 text-white font-bold text-xs shadow-sm hover:bg-coral-600 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Spots to Save</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100 hover:border-coral-200 transition-all flex gap-4 group"
            >
              <img
                src={rest.coverImage}
                alt={rest.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      to={`/restaurant/${rest.id}`}
                      className="font-bold text-sm sm:text-base text-charcoal-900 group-hover:text-coral-600 transition-colors line-clamp-1"
                    >
                      {rest.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleWantToTry(rest.id)}
                      className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {rest.cuisineType} • {rest.cityName}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                  <StarRating rating={rest.averageRating} size="sm" />
                  <PriceRange price={rest.priceRange} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
