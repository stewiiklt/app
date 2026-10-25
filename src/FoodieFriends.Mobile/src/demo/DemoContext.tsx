import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api/client';
import { FoodieFriendsApi } from '../api/foodieFriendsApi';
import type { City } from '../api/types';

export const supportedCities: City[] = [
  { id: 1, name: 'Oslo', countryCode: 'NO', countryName: 'Norway' },
  { id: 2, name: 'Bergen', countryCode: 'NO', countryName: 'Norway' },
  { id: 3, name: 'Stavanger', countryCode: 'NO', countryName: 'Norway' },
  { id: 4, name: 'Trondheim', countryCode: 'NO', countryName: 'Norway' },
  { id: 5, name: 'Drammen', countryCode: 'NO', countryName: 'Norway' },
  { id: 6, name: 'Stockholm', countryCode: 'SE', countryName: 'Sweden' },
  { id: 7, name: 'Gothenburg', countryCode: 'SE', countryName: 'Sweden' },
  { id: 8, name: 'Malmö', countryCode: 'SE', countryName: 'Sweden' },
  { id: 9, name: 'Uppsala', countryCode: 'SE', countryName: 'Sweden' },
  { id: 10, name: 'Västerås', countryCode: 'SE', countryName: 'Sweden' },
  { id: 11, name: 'Copenhagen', countryCode: 'DK', countryName: 'Denmark' },
  { id: 12, name: 'Aarhus', countryCode: 'DK', countryName: 'Denmark' },
  { id: 13, name: 'Odense', countryCode: 'DK', countryName: 'Denmark' },
  { id: 14, name: 'Aalborg', countryCode: 'DK', countryName: 'Denmark' },
  { id: 15, name: 'Esbjerg', countryCode: 'DK', countryName: 'Denmark' },
  { id: 16, name: 'Helsinki', countryCode: 'FI', countryName: 'Finland' },
  { id: 17, name: 'Tampere', countryCode: 'FI', countryName: 'Finland' },
  { id: 18, name: 'Turku', countryCode: 'FI', countryName: 'Finland' },
  { id: 19, name: 'Oulu', countryCode: 'FI', countryName: 'Finland' },
  { id: 20, name: 'Jyväskylä', countryCode: 'FI', countryName: 'Finland' },
  { id: 21, name: 'Reykjavík', countryCode: 'IS', countryName: 'Iceland' },
  { id: 22, name: 'Kópavogur', countryCode: 'IS', countryName: 'Iceland' },
  { id: 23, name: 'Hafnarfjörður', countryCode: 'IS', countryName: 'Iceland' },
  { id: 24, name: 'Reykjanesbær', countryCode: 'IS', countryName: 'Iceland' },
  { id: 25, name: 'Akureyri', countryCode: 'IS', countryName: 'Iceland' },
];

export type DemoPersona = { id: string; name: string; initials: string; cityId: number; follows: string[] };

export const demoPersonas: DemoPersona[] = [
  { id: 'mira', name: 'Mira Solberg', initials: 'MS', cityId: 1, follows: ['elias', 'noor', 'ida', 'jonas'] },
  { id: 'elias', name: 'Elias Berg', initials: 'EB', cityId: 1, follows: ['mira', 'noor'] },
  { id: 'noor', name: 'Noor Aasen', initials: 'NA', cityId: 1, follows: ['mira'] },
  { id: 'ida', name: 'Ida Kristensen', initials: 'IK', cityId: 11, follows: ['mira', 'jonas'] },
  { id: 'jonas', name: 'Jonas Lind', initials: 'JL', cityId: 6, follows: ['ida'] },
];

export type DataMode = 'fixtures' | 'api';

type DemoContextValue = {
  savedIds: string[];
  likedIds: string[];
  toggleSaved: (id: string) => void;
  toggleLiked: (id: string) => void;
  city: City;
  cities: City[];
  setCity: (cityId: number) => void;
  persona: DemoPersona;
  personas: DemoPersona[];
  setPersona: (personaId: string) => void;
  mode: DataMode;
  api: FoodieFriendsApi | null;
};

const DemoContext = createContext<DemoContextValue | null>(null);
const configuredMode: DataMode = process.env.EXPO_PUBLIC_DATA_MODE === 'api' && process.env.EXPO_PUBLIC_API_URL ? 'api' : 'fixtures';

export function DemoProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [cityId, setCityId] = useState(1);
  const [personaId, setPersonaId] = useState('mira');
  const [savedIds, setSavedIds] = useState<string[]>(['3']);
  const [likedIds, setLikedIds] = useState<string[]>(['p2']);
  const city = supportedCities.find((item) => item.id === cityId) ?? supportedCities[0];
  const persona = demoPersonas.find((item) => item.id === personaId) ?? demoPersonas[0];
  const mode = configuredMode;
  const api = useMemo(() => {
    if (mode !== 'api') return null;
    const http = new ApiClient({
      baseUrl: process.env.EXPO_PUBLIC_API_URL!,
      demoUserId: process.env.EXPO_PUBLIC_DEMO_USER_ID,
      allowDemoIdentity: Boolean(process.env.EXPO_PUBLIC_DEMO_USER_ID),
    });
    return new FoodieFriendsApi(http);
  }, [mode]);

  const clearScopedState = useCallback(() => {
    queryClient.clear();
    setSavedIds([]);
    setLikedIds([]);
  }, [queryClient]);
  const setCity = useCallback((nextCityId: number) => {
    if (supportedCities.some((item) => item.id === nextCityId)) {
      if (cityId !== nextCityId) {
        clearScopedState();
        setCityId(nextCityId);
      }
    }
  }, [cityId, clearScopedState]);
  const setPersona = useCallback((nextPersonaId: string) => {
    if (demoPersonas.some((item) => item.id === nextPersonaId)) {
      if (personaId !== nextPersonaId) {
        clearScopedState();
        setPersonaId(nextPersonaId);
      }
    }
  }, [personaId, clearScopedState]);
  const value = useMemo(() => ({
    savedIds,
    likedIds,
    toggleSaved: (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    toggleLiked: (id: string) => setLikedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    city,
    cities: supportedCities,
    setCity,
    persona,
    personas: demoPersonas,
    setPersona,
    mode,
    api,
  }), [savedIds, likedIds, city, setCity, persona, setPersona, mode, api]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}
