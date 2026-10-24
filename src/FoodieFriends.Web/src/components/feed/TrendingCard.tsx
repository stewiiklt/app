import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, ChevronRight } from 'lucide-react';
import { useLocationContext } from '../../contexts/LocationContext';

interface TrendingCardProps {
  item: {
    id: string;
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
}

export const TrendingCard: React.FC<TrendingCardProps> = ({ item }) => {
  const { currentCity } = useLocationContext();

  return (
    <div className="bg-gradient-to-br from-charcoal-900 to-teal-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-coral-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-coral-500/30 flex items-center justify-center text-coral-400">
            <Flame className="w-5 h-5 fill-coral-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">
              Trending in {currentCity.name} This Month
            </h3>
            <p className="text-[11px] text-gray-300">Based on recent foodie reviews & bookmarks</p>
          </div>
        </div>
        <Link
          to="/rankings"
          className="text-xs font-semibold text-coral-300 hover:text-coral-200 flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Ranked list */}
      <div className="space-y-2.5">
        {item.restaurants.map((r, idx) => (
          <Link
            key={r.id}
            to={`/restaurant/${r.id}`}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/5 group"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-coral-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white group-hover:text-coral-300 transition-colors">
                  {r.name}
                </p>
                <p className="text-[11px] text-gray-400">{r.cuisineType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {r.averageRating}
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                ({r.reviewCount} reviews)
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
