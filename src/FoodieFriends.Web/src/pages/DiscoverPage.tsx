import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X, Utensils } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { useLocationContext } from '../contexts/LocationContext';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

const CATEGORIES = [
  { name: 'All', icon: '🍽️' },
  { name: 'Nordic', icon: '🫐' },
  { name: 'Fine Dining', icon: '✨' },
  { name: 'Italian', icon: '🍕' },
  { name: 'Seafood', icon: '🦞' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Bakery', icon: '🥐' },
  { name: 'Vegetarian', icon: '🥗' },
  { name: 'New Spots', icon: '🔥', isNewOnly: true },
];

export const DiscoverPage: React.FC = () => {
  const { currentCity, currentCountry } = useLocationContext();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [newOnly, setNewOnly] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    const results = await api.getRestaurants({
      query: searchQuery,
      cityId: currentCity.id,
      cuisine: selectedCategory === 'All' || selectedCategory === 'New Spots' ? undefined : selectedCategory,
      priceRange: selectedPrice || undefined,
      isNew: newOnly || selectedCategory === 'New Spots',
    });
    setRestaurants(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [currentCity.id, searchQuery, selectedCategory, selectedPrice, newOnly]);

  const handleCategoryClick = (catName: string, isNewOnly?: boolean) => {
    setSelectedCategory(catName);
    if (isNewOnly) {
      setNewOnly(true);
    } else if (newOnly && catName !== 'New Spots') {
      setNewOnly(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
          Discover Dining in {currentCity.name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore curated culinary hotspots, local favorites, and newly opened kitchens.
        </p>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-soft border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant name, cuisine, dish..."
              className="w-full bg-cream-100 border border-transparent focus:border-coral-400 focus:bg-white rounded-xl pl-11 pr-10 py-2.5 text-sm text-charcoal-900 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Range Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
            {[1, 2, 3, 4].map((p) => {
              const isSelected = selectedPrice === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPrice(isSelected ? null : p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-coral-500 text-white border-coral-500 shadow-xs'
                      : 'bg-cream-100 text-gray-600 border-gray-200 hover:border-coral-300'
                  }`}
                >
                  {'$'.repeat(p)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cuisine Categories Scroll */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name, cat.isNewOnly)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-700/20'
                    : 'bg-white text-charcoal-800 border-gray-200 hover:border-coral-300 hover:bg-cream-100'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {restaurants.length} {restaurants.length === 1 ? 'Restaurant Found' : 'Restaurants Found'}
          </p>
          {(selectedCategory !== 'All' || selectedPrice !== null || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPrice(null);
                setSearchQuery('');
                setNewOnly(false);
              }}
              className="text-xs font-semibold text-coral-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 animate-pulse shadow-soft" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-soft max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-charcoal-900">No restaurants match your search</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Try adjusting your cuisine filter or search keyword in {currentCity.name}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPrice(null);
                setSearchQuery('');
                setNewOnly(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-coral-500 text-white font-bold text-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
