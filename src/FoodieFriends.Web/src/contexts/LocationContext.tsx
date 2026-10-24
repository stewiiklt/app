import React, { createContext, useContext, useState, useEffect } from 'react';
import { Country, City } from '../types';

export const SCANDINAVIAN_COUNTRIES: Country[] = [
  {
    id: 'norway',
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    cities: [
      { id: 1, name: 'Oslo', countryCode: 'NO' },
      { id: 2, name: 'Bergen', countryCode: 'NO' },
      { id: 3, name: 'Stavanger', countryCode: 'NO' },
      { id: 4, name: 'Trondheim', countryCode: 'NO' },
      { id: 5, name: 'Drammen', countryCode: 'NO' },
    ],
  },
  {
    id: 'sweden',
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    cities: [
      { id: 6, name: 'Stockholm', countryCode: 'SE' },
      { id: 7, name: 'Gothenburg', countryCode: 'SE' },
      { id: 8, name: 'Malmö', countryCode: 'SE' },
      { id: 9, name: 'Uppsala', countryCode: 'SE' },
      { id: 10, name: 'Västerås', countryCode: 'SE' },
    ],
  },
  {
    id: 'denmark',
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    cities: [
      { id: 11, name: 'Copenhagen', countryCode: 'DK' },
      { id: 12, name: 'Aarhus', countryCode: 'DK' },
      { id: 13, name: 'Odense', countryCode: 'DK' },
      { id: 14, name: 'Aalborg', countryCode: 'DK' },
      { id: 15, name: 'Esbjerg', countryCode: 'DK' },
    ],
  },
  {
    id: 'finland',
    code: 'FI',
    name: 'Finland',
    flag: '🇫🇮',
    cities: [
      { id: 16, name: 'Helsinki', countryCode: 'FI' },
      { id: 17, name: 'Tampere', countryCode: 'FI' },
      { id: 18, name: 'Turku', countryCode: 'FI' },
      { id: 19, name: 'Oulu', countryCode: 'FI' },
      { id: 20, name: 'Jyväskylä', countryCode: 'FI' },
    ],
  },
  {
    id: 'iceland',
    code: 'IS',
    name: 'Iceland',
    flag: '🇮🇸',
    cities: [
      { id: 21, name: 'Reykjavík', countryCode: 'IS' },
      { id: 22, name: 'Kópavogur', countryCode: 'IS' },
      { id: 23, name: 'Hafnarfjörður', countryCode: 'IS' },
      { id: 24, name: 'Reykjanesbær', countryCode: 'IS' },
      { id: 25, name: 'Akureyri', countryCode: 'IS' },
    ],
  },
];

interface LocationContextType {
  currentCountry: Country;
  currentCity: City;
  setCountry: (country: Country) => void;
  setCity: (city: City) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  allCities: City[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCountry, setCurrentCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem('foodiefriends_country');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = SCANDINAVIAN_COUNTRIES.find((c) => c.code === parsed.code);
        if (match) return match;
      } catch (e) {
        console.error(e);
      }
    }
    return SCANDINAVIAN_COUNTRIES[0]; // Norway default
  });

  const [currentCity, setCurrentCityState] = useState<City>(() => {
    const saved = localStorage.getItem('foodiefriends_city');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return SCANDINAVIAN_COUNTRIES[0].cities[0]; // Oslo default
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const setCountry = (country: Country) => {
    setCurrentCountryState(country);
    localStorage.setItem('foodiefriends_country', JSON.stringify(country));
    // Default to the first city of the selected country
    const firstCity = country.cities[0];
    setCurrentCityState(firstCity);
    localStorage.setItem('foodiefriends_city', JSON.stringify(firstCity));
  };

  const setCity = (city: City) => {
    setCurrentCityState(city);
    localStorage.setItem('foodiefriends_city', JSON.stringify(city));
  };

  const allCities = SCANDINAVIAN_COUNTRIES.flatMap((c) => c.cities);

  return (
    <LocationContext.Provider
      value={{
        currentCountry,
        currentCity,
        setCountry,
        setCity,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        allCities,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
