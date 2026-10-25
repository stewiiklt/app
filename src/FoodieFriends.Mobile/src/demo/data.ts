import { demoPersonas } from './DemoContext';

export type DemoRestaurant = {
  id: string;
  name: string;
  cityId: number;
  cityName: string;
  countryCode: string;
  cuisine: string;
  neighborhood: string;
  price: string;
  rating: string;
  reviewCount: number;
  image: string;
  dish: string;
  accent: string;
};

export type DemoPost = {
  id: string;
  authorPersonaId: string;
  kind: 'review' | 'wantToTry';
  createdAt: string;
  visibility: 'Public' | 'FriendsOnly';
  name: string;
  initials: string;
  time: string;
  text: string;
  rating: string;
  restaurant: DemoRestaurant;
};

export const demoRestaurants: DemoRestaurant[] = [
  {
    id: '1', name: 'Moss & Marrow', cityId: 1, cityName: 'Oslo', countryCode: 'NO', cuisine: 'Nordic plates', neighborhood: 'Grünerløkka', price: '$$', rating: '9.2', reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85', dish: 'Roasted carrots, whipped feta & herbs', accent: '#DCE8CD',
  },
  {
    id: '2', name: 'Saffron Comet', cityId: 1, cityName: 'Oslo', countryCode: 'NO', cuisine: 'Wood-fired pizza', neighborhood: 'Tøyen', price: '$$', rating: '8.8', reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85', dish: 'Sourdough pizza with garden greens', accent: '#F5D4B8',
  },
  {
    id: '3', name: 'Cloudberry Night Market', cityId: 1, cityName: 'Oslo', countryCode: 'NO', cuisine: 'Japanese comfort', neighborhood: 'Sentrum', price: '$$$', rating: '9.5', reviewCount: 109,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=85', dish: 'Market-fresh nigiri set', accent: '#F4D8CF',
  },
];

export const demoPosts: DemoPost[] = [
  { id: 'p1', authorPersonaId: 'mira', kind: 'review', createdAt: '2026-10-24T15:42:00Z', visibility: 'Public', name: 'Mira Solberg', initials: 'MS', time: '18 min ago', text: 'The crispy potatoes with that lemony dip. I am already planning a second visit. 🌿', rating: '9.5', restaurant: demoRestaurants[0] },
  { id: 'p2', authorPersonaId: 'elias', kind: 'review', createdAt: '2026-10-24T14:00:00Z', visibility: 'Public', name: 'Elias Berg', initials: 'EB', time: '2 hours ago', text: 'A lovely little spot for a slow Friday dinner. Get the charred cabbage.', rating: '8.8', restaurant: demoRestaurants[1] },
  { id: 'w1', authorPersonaId: 'ida', kind: 'wantToTry', createdAt: '2026-10-24T13:15:00Z', visibility: 'Public', name: 'Ida Kristensen', initials: 'IK', time: '3 hours ago', text: 'Added this to the places I want to try.', rating: '', restaurant: { ...demoRestaurants[2], id: '4', name: 'Juniper & Rye', cityId: 11, cityName: 'Copenhagen', countryCode: 'DK', neighborhood: 'Nørrebro', cuisine: 'Seasonal Nordic', price: '$$', rating: '9.1', reviewCount: 42 } },
  { id: 'w2', authorPersonaId: 'jonas', kind: 'wantToTry', createdAt: '2026-10-24T11:30:00Z', visibility: 'Public', name: 'Jonas Lind', initials: 'JL', time: '5 hours ago', text: 'Added this to the places I want to try.', rating: '', restaurant: { ...demoRestaurants[0], id: '5', name: 'Fika Table', cityId: 6, cityName: 'Stockholm', countryCode: 'SE', neighborhood: 'Södermalm', cuisine: 'Modern Swedish', price: '$$', rating: '8.9', reviewCount: 31 } },
  { id: 'p3', authorPersonaId: 'noor', kind: 'review', createdAt: '2026-10-23T16:00:00Z', visibility: 'FriendsOnly', name: 'Noor Aasen', initials: 'NA', time: 'Yesterday', text: 'Tiny counter, huge flavors. The seasonal nigiri was a standout.', rating: '9.7', restaurant: demoRestaurants[2] },
];

/** FriendsOnly activity is visible to its author and to viewers who follow that author. */
export function canViewPost(post: DemoPost, viewerPersonaId: string): boolean {
  if (post.visibility === 'Public') return true;
  if (post.authorPersonaId === viewerPersonaId) return true;
  const viewer = demoPersonas.find((persona) => persona.id === viewerPersonaId);
  return viewer?.follows.includes(post.authorPersonaId) ?? false;
}

/** Social feed includes the viewer's own activity and activity from accounts they follow. */
export function getFeedPostsForPersona(viewerPersonaId: string): DemoPost[] {
  const viewer = demoPersonas.find((persona) => persona.id === viewerPersonaId);
  const followedIds = new Set([viewerPersonaId, ...(viewer?.follows ?? [])]);
  return demoPosts
    .filter((post) => followedIds.has(post.authorPersonaId) && canViewPost(post, viewerPersonaId))
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export const demoStories = [
  { initials: 'MS', name: 'Mira', color: '#D98B68' },
  { initials: 'EB', name: 'Elias', color: '#809879' },
  { initials: 'NA', name: 'Noor', color: '#D6A74D' },
  { initials: 'IK', name: 'Ida', color: '#9D8090' },
  { initials: 'JL', name: 'Jonas', color: '#728B9D' },
];
