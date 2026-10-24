import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, Check } from 'lucide-react';
import { useLocationContext, SCANDINAVIAN_COUNTRIES } from '../contexts/LocationContext';
import { useUserContext } from '../contexts/UserContext';
import { Country, City } from '../types';

export const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCountry, currentCity, setCountry, setCity } = useLocationContext();
  const { currentUser, switchUser, allDemoUsers } = useUserContext();

  const [selectedCountry, setSelectedCountry] = useState<Country>(currentCountry);
  const [selectedCity, setSelectedCity] = useState<City>(currentCity);

  const handleCountryPick = (c: Country) => {
    setSelectedCountry(c);
    setSelectedCity(c.cities[0]);
  };

  const handleEnterApp = () => {
    setCountry(selectedCountry);
    setCity(selectedCity);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-200 via-white to-cream-300 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top bar with branding */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <span className="text-xl font-black">FF</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-charcoal-900">
              Foodie<span className="text-coral-500">Friends</span>
            </span>
            <span className="text-[11px] block text-gray-500 font-medium">
              Scandinavian Social Food Discovery
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Sparkles className="w-4 h-4 text-coral-500" />
          <span>25 Scandinavian Cities • 5 Countries</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto w-full my-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-soft border border-coral-100">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-coral-100 text-coral-700 text-xs font-bold uppercase tracking-wider mb-2">
            Welcome to Scandinavia's Food Community
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
            See what your friends are eating, discover where to go next.
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Choose your home city in Scandinavia to customize your restaurant feed and friend recommendations.
          </p>
        </div>

        {/* Step 1: Country Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-coral-500 text-white flex items-center justify-center text-[11px]">1</span>
              Select Scandinavian Country
            </span>
            <span className="text-xs text-gray-400">5 Countries</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SCANDINAVIAN_COUNTRIES.map((c) => {
              const isSelected = selectedCountry.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountryPick(c)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'border-coral-500 bg-coral-50 shadow-sm ring-2 ring-coral-500/30'
                      : 'border-gray-200 bg-white hover:border-coral-300 hover:bg-cream-100'
                  }`}
                >
                  <div className="text-3xl mb-1">{c.flag}</div>
                  <div className="text-xs font-bold text-charcoal-900">{c.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{c.cities.length} top cities</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: City Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[11px]">2</span>
              Choose City in {selectedCountry.name}
            </span>
            <span className="text-xs text-gray-400">Top 5 Municipalities</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {selectedCountry.cities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                      : 'bg-cream-100 border-gray-200 text-charcoal-800 hover:border-teal-400 hover:bg-white'
                  }`}
                >
                  <span>{city.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Persona Selection (Prototype feature) */}
        <div className="p-4 rounded-2xl bg-cream-100 border border-amber-200/60 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              Prototype Persona: Browse As
            </span>
            <span className="text-[11px] text-coral-600 font-semibold">Changeable anytime</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {allDemoUsers.slice(0, 3).map((u) => {
              const isCurrent = currentUser.username === u.username;
              return (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => switchUser(u.username)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-white border-coral-500 shadow-xs ring-1 ring-coral-500'
                      : 'bg-transparent border-gray-200 hover:bg-white text-gray-700'
                  }`}
                >
                  <img
                    src={u.profilePhotoUrl}
                    alt={u.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="truncate text-xs">
                    <p className="font-bold truncate text-charcoal-900">{u.displayName}</p>
                    <p className="text-[10px] text-gray-500">@{u.username}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enter Button */}
        <button
          type="button"
          onClick={handleEnterApp}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-coral-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 text-white font-black text-base flex items-center justify-center gap-3 shadow-hover transition-all transform active:scale-98"
        >
          <span>Explore FoodieFriends in {selectedCity.name}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-gray-400 py-2">
        <p>OsloMet Introduction to AI Assignment Prototype • Built with AI-assisted pair programming</p>
      </div>
    </div>
  );
};
