import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    username: 'anna_oslo',
    displayName: 'Anna Johansen',
    email: 'anna@foodiefriends.io',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
    bio: 'Coffee snob & sourdough enthusiast. Chasing the best tasting menus and hidden natural wine bars in Scandinavia. ☕🥐✨',
    cityId: 1,
    cityName: 'Oslo',
    reviewCount: 14,
    followingCount: 5,
    followersCount: 18,
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    username: 'erik_bergen',
    displayName: 'Erik Pedersen',
    email: 'erik@foodiefriends.io',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    bio: 'Bergen native, seafood fanatic, craft beer explorer. Rain survivor 🌧️🦀. Always looking for the freshest halibut and cider.',
    cityId: 2,
    cityName: 'Bergen',
    reviewCount: 9,
    followingCount: 6,
    followersCount: 12,
  },
  {
    id: 'u3333333-3333-3333-3333-333333333333',
    username: 'sofia_sthlm',
    displayName: 'Sofia Lindqvist',
    email: 'sofia@foodiefriends.io',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    bio: 'Pastry chef by day, natural wine lover by night 🍷. Cardamom bun connoisseur in Södermalm.',
    cityId: 6,
    cityName: 'Stockholm',
    reviewCount: 22,
    followingCount: 8,
    followersCount: 31,
  },
  {
    id: 'u4444444-4444-4444-4444-444444444444',
    username: 'lars_cph',
    displayName: 'Lars Møller',
    email: 'lars@foodiefriends.io',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    bio: 'Smørrebrød traditionalist with an appetite for modern Nordic innovation. If there is dill and pickled herring, I am there. 🇩🇰',
    cityId: 11,
    cityName: 'Copenhagen',
    reviewCount: 17,
    followingCount: 7,
    followersCount: 24,
  },
  {
    id: 'u5555555-5555-5555-5555-555555555555',
    username: 'matias_helsinki',
    displayName: 'Matias Korhonen',
    email: 'matias@foodiefriends.io',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
    bio: 'Sauna, wild chanterelles, and creamy salmon soup lover. Exploring Helsinki’s burgeoning bistro scene. 🇫🇮',
    cityId: 16,
    cityName: 'Helsinki',
    reviewCount: 11,
    followingCount: 4,
    followersCount: 15,
  },
];

interface UserContextType {
  currentUser: User;
  switchUser: (username: string) => void;
  allDemoUsers: User[];
  followingIds: string[];
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
  wantToTryIds: string[];
  isWantToTry: (restaurantId: string) => boolean;
  toggleWantToTry: (restaurantId: string) => void;
  updateCurrentUserProfile: (bio: string, displayName: string, cityId: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('foodiefriends_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = DEMO_USERS.find((u) => u.username === parsed.username);
        if (match) return { ...match, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS[0]; // anna_oslo default
  });

  // Track who the current user follows
  const [followingIds, setFollowingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`foodiefriends_following_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default: follow everyone else in the demo list except self
    return DEMO_USERS.filter((u) => u.id !== currentUser.id).map((u) => u.id);
  });

  // Track bookmarked "Want to Try" restaurants
  const [wantToTryIds, setWantToTryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`foodiefriends_want_to_try_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['r1', 'r3', 'r7']; // default seeded bookmarks
  });

  // Re-load following & wantToTry whenever user switches
  useEffect(() => {
    const savedFollowing = localStorage.getItem(`foodiefriends_following_${currentUser.id}`);
    if (savedFollowing) {
      try {
        setFollowingIds(JSON.parse(savedFollowing));
      } catch (e) {
        setFollowingIds(DEMO_USERS.filter((u) => u.id !== currentUser.id).map((u) => u.id));
      }
    } else {
      setFollowingIds(DEMO_USERS.filter((u) => u.id !== currentUser.id).map((u) => u.id));
    }

    const savedWant = localStorage.getItem(`foodiefriends_want_to_try_${currentUser.id}`);
    if (savedWant) {
      try {
        setWantToTryIds(JSON.parse(savedWant));
      } catch (e) {
        setWantToTryIds(['r1', 'r3']);
      }
    } else {
      setWantToTryIds(['r1', 'r3']);
    }
  }, [currentUser.id]);

  const switchUser = (username: string) => {
    const found = DEMO_USERS.find((u) => u.username === username);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('foodiefriends_user', JSON.stringify(found));
    }
  };

  const isFollowing = (userId: string) => followingIds.includes(userId);

  const toggleFollow = (userId: string) => {
    setFollowingIds((prev) => {
      const next = prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId];
      localStorage.setItem(`foodiefriends_following_${currentUser.id}`, JSON.stringify(next));
      return next;
    });
  };

  const isWantToTry = (restaurantId: string) => wantToTryIds.includes(restaurantId);

  const toggleWantToTry = (restaurantId: string) => {
    setWantToTryIds((prev) => {
      const next = prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId];
      localStorage.setItem(`foodiefriends_want_to_try_${currentUser.id}`, JSON.stringify(next));
      return next;
    });
  };

  const updateCurrentUserProfile = (bio: string, displayName: string, cityId: number) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, bio, displayName, cityId };
      localStorage.setItem('foodiefriends_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        switchUser,
        allDemoUsers: DEMO_USERS,
        followingIds,
        isFollowing,
        toggleFollow,
        wantToTryIds,
        isWantToTry,
        toggleWantToTry,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
