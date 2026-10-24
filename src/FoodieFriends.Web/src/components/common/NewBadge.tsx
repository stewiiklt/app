import React from 'react';
import { Sparkles } from 'lucide-react';

interface NewBadgeProps {
  size?: 'sm' | 'md';
}

export const NewBadge: React.FC<NewBadgeProps> = ({ size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider shadow-xs ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-0.5'
      }`}
      title="Opened within the last 6 months"
    >
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5 text-emerald-600' : 'w-3 h-3 text-emerald-600'} />
      NEW
    </span>
  );
};
