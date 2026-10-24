import React from 'react';

interface PriceRangeProps {
  price: number; // 1-4
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md';
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  price,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const labels = ['Budget ($)', 'Moderate ($$)', 'Upscale ($$$)', 'Fine Dining ($$$$)'];

  if (interactive) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((level) => {
          const isSelected = price === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange && onChange(level)}
              className={`flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-coral-500 border-coral-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-charcoal-900 hover:border-coral-300'
              }`}
            >
              <div className="text-base">{'💰'.repeat(level)}</div>
              <div className={`text-xs mt-0.5 ${isSelected ? 'text-coral-100' : 'text-gray-500'}`}>
                {labels[level - 1]}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <span
      className={`font-medium text-gray-600 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
      title={labels[price - 1] || 'Price'}
    >
      <span className="text-emerald-700 font-bold">{'$'.repeat(price)}</span>
      <span className="text-gray-300">{'$'.repeat(Math.max(0, 4 - price))}</span>
    </span>
  );
};
