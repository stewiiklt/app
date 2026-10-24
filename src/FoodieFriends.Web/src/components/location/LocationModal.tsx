import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useLocationContext, SCANDINAVIAN_COUNTRIES } from '../../contexts/LocationContext';
import { Country, City } from '../../types';

export const LocationModal: React.FC = () => {
  const { currentCountry, currentCity, setCountry, setCity, isLocationModalOpen, closeLocationModal } =
    useLocationContext();

  const [selectedCountry, setSelectedCountry] = useState<Country>(currentCountry);

  if (!isLocationModalOpen) return null;

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
  };

  const handleCitySelect = (city: City) => {
    setCountry(selectedCountry);
    setCity(city);
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-coral-100 flex items-center justify-center text-coral-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal-900">Change Location</h3>
              <p className="text-xs text-gray-500">Discover friends & food in Scandinavia</p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Country tabs / cards */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Step 1: Select Country
          </label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {SCANDINAVIAN_COUNTRIES.map((c) => {
              const isSelected = selectedCountry.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-coral-500 bg-coral-50 text-coral-700 shadow-xs ring-2 ring-coral-500/20'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{c.flag}</span>
                  <span className="text-xs font-semibold truncate w-full text-center">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: City pills */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Step 2: Select City in {selectedCountry.name}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
            {selectedCountry.cities.map((city) => {
              const isCurrent = currentCity.id === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all ${
                    isCurrent
                      ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                      : 'bg-cream-100 border-gray-200 text-charcoal-900 hover:border-coral-400 hover:bg-white'
                  }`}
                >
                  <span>{city.name}</span>
                  {isCurrent && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current status footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Current: <strong className="text-charcoal-900">{currentCity.name}, {currentCountry.name}</strong>
          </span>
          <button
            type="button"
            onClick={closeLocationModal}
            className="text-coral-600 font-semibold hover:underline"
          >
            Keep current
          </button>
        </div>
      </div>
    </div>
  );
};
