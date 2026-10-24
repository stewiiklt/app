import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Bell,
  Search,
  Bookmark,
  Trophy,
  Compass,
  UtensilsCrossed,
  UserCheck,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';
import { useLocationContext } from '../../contexts/LocationContext';
import { useUserContext } from '../../contexts/UserContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentCity, currentCountry, openLocationModal } = useLocationContext();
  const { currentUser, switchUser, allDemoUsers } = useUserContext();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Feed', path: '/feed', icon: UtensilsCrossed },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Rankings', path: '/rankings', icon: Trophy },
    { label: 'Want to Try', path: '/want-to-try', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand logo */}
          <div className="flex items-center gap-6">
            <Link to="/feed" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-500 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl font-black">FF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-charcoal-900 group-hover:text-coral-600 transition-colors">
                  Foodie<span className="text-coral-500">Friends</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium -mt-1 tracking-wider uppercase">
                  Nordic Social Dining
                </span>
              </div>
            </Link>

            {/* Location selector badge */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-200 hover:bg-coral-50 border border-coral-200 text-xs font-semibold text-charcoal-800 hover:text-coral-700 transition-all shadow-xs"
              title="Click to switch Scandinavian city"
            >
              <span className="text-sm">{currentCountry.flag}</span>
              <span>{currentCity.name}</span>
              <MapPin className="w-3.5 h-3.5 text-coral-500" />
            </button>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-coral-50 text-coral-600 shadow-xs'
                      : 'text-gray-600 hover:text-coral-600 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Notifications, User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/search"
              className="p-2 rounded-full text-gray-500 hover:text-coral-600 hover:bg-coral-50 transition-colors"
              title="Search users & foodies"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              to="/notifications"
              className="relative p-2 rounded-full text-gray-500 hover:text-coral-600 hover:bg-coral-50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-coral-500 rounded-full ring-2 ring-white"></span>
            </Link>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2 rounded-full hover:bg-cream-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <img
                  src={currentUser.profilePhotoUrl}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-400"
                />
                <span className="hidden lg:inline text-xs font-bold text-charcoal-800">
                  {currentUser.displayName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Active User (Demo Identity)
                    </p>
                    <p className="text-sm font-bold text-charcoal-900 mt-0.5">
                      {currentUser.displayName}
                    </p>
                    <p className="text-xs text-coral-600">@{currentUser.username}</p>
                  </div>

                  <div className="py-2">
                    <p className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Persona
                    </p>
                    {allDemoUsers.map((u) => {
                      const isCurrent = u.username === currentUser.username;
                      return (
                        <button
                          key={u.username}
                          type="button"
                          onClick={() => switchUser(u.username)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                            isCurrent
                              ? 'bg-coral-50 text-coral-700 font-bold'
                              : 'hover:bg-cream-100 text-gray-700'
                          }`}
                        >
                          <img
                            src={u.profilePhotoUrl}
                            alt={u.displayName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 truncate">
                            <div className="truncate font-semibold">{u.displayName}</div>
                            <div className="text-[11px] text-gray-500">@{u.username} • {u.cityName}</div>
                          </div>
                          {isCurrent && <UserCheck className="w-4 h-4 text-coral-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-coral-600 hover:bg-cream-100 rounded-xl"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Edit My Profile & Settings</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
