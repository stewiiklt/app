import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Star, Medal, ChevronDown } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { useLocationContext } from '../contexts/LocationContext';
import { StarRating } from '../components/common/StarRating';
import { PriceRange } from '../components/common/PriceRange';

export const RankingsPage: React.FC = () => {
  const { currentCity, currentCountry, allCities, setCity } = useLocationContext();

  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState('Nordic');
  const [rankedList, setRankedList] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Nordic', 'Fine Dining', 'Italian', 'Seafood', 'Burgers'];

  const loadRankings = async () => {
    setLoading(true);
    const data = await api.getRankings(
      activeTab,
      currentCity.id,
      activeTab === 'category' ? selectedCategory : undefined
    );
    setRankedList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRankings();
  }, [activeTab, currentCity.id, selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header & Municipality Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" />
            <span>Leaderboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Top-rated culinary establishments in {currentCity.name}
          </p>
        </div>

        {/* Municipality Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City:</label>
          <div className="relative">
            <select
              value={currentCity.id}
              onChange={(e) => {
                const found = allCities.find((c) => c.id === Number(e.target.value));
                if (found) setCity(found);
              }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-charcoal-900 appearance-none shadow-xs focus:outline-none focus:ring-1 focus:ring-coral-500 cursor-pointer"
            >
              {allCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.countryCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-soft border border-gray-100 flex items-center gap-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-coral-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal-900 hover:bg-cream-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>All Users (Min 3 reviews)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'friends'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal-900 hover:bg-cream-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Friends' Circle (Min 2 reviews)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('category')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'category'
              ? 'bg-charcoal-900 text-white shadow-sm'
              : 'text-gray-600 hover:text-charcoal-900 hover:bg-cream-100'
          }`}
        >
          <Medal className="w-4 h-4" />
          <span>By Category</span>
        </button>
      </div>

      {/* Category Pills if By Category tab is active */}
      {activeTab === 'category' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-20 animate-pulse shadow-soft" />
          ))}
        </div>
      ) : rankedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-soft">
          <p className="font-extrabold text-charcoal-900">No restaurants meet the qualification criteria</p>
          <p className="text-xs text-gray-500 mt-1">
            {activeTab === 'friends'
              ? 'Requires at least 2 reviews from your friends circle.'
              : 'Requires at least 3 reviews from verified users.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100">
          <div className="divide-y divide-gray-100">
            {rankedList.map((rest, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const medalColors = ['text-amber-500', 'text-slate-400', 'text-amber-700'];

              return (
                <Link
                  key={rest.id}
                  to={`/restaurant/${rest.id}`}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-cream-100/70 transition-colors group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isTop3
                          ? 'bg-cream-100 border border-amber-200 ' + medalColors[rank - 1]
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>

                    {/* Restaurant thumbnail */}
                    <img
                      src={rest.coverImage}
                      alt={rest.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-charcoal-900 group-hover:text-coral-600 transition-colors">
                        {rest.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {rest.cuisineType} • <PriceRange price={rest.priceRange} size="sm" />
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-black text-sm sm:text-base text-charcoal-900">
                        {activeTab === 'friends' && rest.friendsRating
                          ? rest.friendsRating.toFixed(1)
                          : rest.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {activeTab === 'friends'
                        ? `${rest.friendReviewsCount} friend reviews`
                        : `${rest.totalReviews} reviews`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
