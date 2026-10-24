import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { LocationModal } from '../location/LocationModal';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-200">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
      <LocationModal />
    </div>
  );
};
