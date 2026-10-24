import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import { UserProvider } from './contexts/UserContext';
import { Layout } from './components/layout/Layout';

// Pages
import { EntryPage } from './pages/EntryPage';
import { FeedPage } from './pages/FeedPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { WriteReviewPage } from './pages/WriteReviewPage';
import { RankingsPage } from './pages/RankingsPage';
import { WantToTryPage } from './pages/WantToTryPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SearchPage } from './pages/SearchPage';
import { MyProfilePage } from './pages/MyProfilePage';

export const App: React.FC = () => {
  return (
    <LocationProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Full-screen Location Entry Page */}
            <Route path="/" element={<EntryPage />} />

            {/* Main Application with App Bar & Navigation */}
            <Route element={<Layout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/restaurant/:id/review" element={<WriteReviewPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/want-to-try" element={<WantToTryPage />} />
              <Route path="/user/:username" element={<UserProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<MyProfilePage />} />
            </Route>

            {/* Catch-all redirect to feed */}
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </LocationProvider>
  );
};

export default App;
