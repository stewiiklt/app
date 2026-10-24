import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, UserPlus, Users, X } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { useUserContext } from '../contexts/UserContext';
import { FollowButton } from '../components/common/FollowButton';

export const SearchPage: React.FC = () => {
  const { currentUser } = useUserContext();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSuggestions() {
      const suggestions = await api.getSuggestedUsers(currentUser.id);
      setSuggestedUsers(suggestions);
    }
    loadSuggestions();
  }, [currentUser.id]);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      const results = await api.searchUsers(query.trim());
      setSearchResults(results);
      setLoading(false);
    }
    search();
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
          Find Foodies & Friends
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Connect with food lovers, home cooks, and restaurant critics across Scandinavia
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or @username..."
          className="w-full bg-white border border-gray-200 focus:border-coral-500 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-charcoal-900 shadow-soft focus:outline-none transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Search Results ({searchResults.length})
          </h2>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-xs text-gray-500 border border-gray-100 shadow-soft">
              No users found matching "{query}".
            </div>
          ) : (
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 divide-y divide-gray-100">
              {searchResults.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between gap-3 hover:bg-cream-50 transition-colors">
                  <Link to={`/user/${user.username}`} className="flex items-center gap-3 group flex-1">
                    <img
                      src={user.profilePhotoUrl}
                      alt={user.displayName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-coral-300 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-sm font-bold text-charcoal-900 group-hover:text-coral-600 transition-colors">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-400">@{user.username} • {user.cityName}</p>
                    </div>
                  </Link>

                  <FollowButton userId={user.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggested Foodies Section */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-coral-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
            Suggested Foodies For You
          </h2>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 divide-y divide-gray-100">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between gap-3 hover:bg-cream-50 transition-colors">
              <Link to={`/user/${user.username}`} className="flex items-center gap-3 group flex-1">
                <img
                  src={user.profilePhotoUrl}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-coral-300 group-hover:scale-105 transition-transform shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-charcoal-900 group-hover:text-coral-600 transition-colors">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-coral-600 font-semibold">@{user.username}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{user.bio}</p>
                </div>
              </Link>

              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
