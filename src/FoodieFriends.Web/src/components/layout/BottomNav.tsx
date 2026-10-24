import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Compass, PlusCircle, Bell, User } from 'lucide-react';
import { useUserContext } from '../../contexts/UserContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useUserContext();

  const navItems = [
    { label: 'Feed', path: '/feed', icon: UtensilsCrossed },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Review', path: '/restaurant/r3/review', icon: PlusCircle, isAction: true },
    { label: 'Alerts', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                to={item.path}
                className="flex flex-col items-center -mt-5 group"
                title="Write a Review"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-coral-500 to-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-coral-600 mt-1">Review</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${
                isActive ? 'text-coral-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
