import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 1-10
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  interactive = false,
  onChange,
  size = 'md',
  showBadge = true,
}) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-emerald-500 text-white';
    if (score >= 7.5) return 'bg-coral-500 text-white';
    if (score >= 6) return 'bg-amber-500 text-white';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className="flex items-center gap-1.5">
      {showBadge && (
        <span
          className={`font-bold px-2 py-0.5 rounded-md text-xs tracking-tight shadow-sm ${getScoreColor(
            rating
          )}`}
        >
          {Number(rating).toFixed(1)}/10
        </span>
      )}

      {interactive ? (
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const val = index + 1;
            const isFilled = val <= rating;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onChange && onChange(val)}
                className="p-1 hover:scale-125 transition-transform text-amber-400 focus:outline-none"
                title={`${val}/10`}
              >
                <Star
                  className={`${starSizes[size]} ${
                    isFilled ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center">
          {/* 5-star normalized visual indicator */}
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = (index + 1) * 2;
            const isFilled = rating >= starValue - 0.5;
            return (
              <Star
                key={index}
                className={`${starSizes[size]} ${
                  isFilled ? 'fill-amber-400 text-amber-500' : 'text-gray-200'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
