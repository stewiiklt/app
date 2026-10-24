import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewPhoto } from '../../types';

interface PhotoCarouselProps {
  photos: ReviewPhoto[];
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-900 group aspect-4/3 sm:aspect-16/10">
      <img
        src={currentPhoto.url}
        alt={currentPhoto.caption || 'Food review photo'}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-102"
        loading="lazy"
      />

      {/* Caption overlay */}
      {currentPhoto.caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
          <p className="font-medium truncate">{currentPhoto.caption}</p>
        </div>
      )}

      {/* Prev / Next buttons */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full backdrop-blur-xs text-[11px] text-white font-medium">
            {currentIndex + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
};
