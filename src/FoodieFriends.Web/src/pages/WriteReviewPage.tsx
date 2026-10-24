import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Camera,
  X,
  Shield,
  Globe,
  Sparkles,
  ArrowLeft,
  Check,
  Plus,
} from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';
import { useUserContext } from '../contexts/UserContext';
import { StarRating } from '../components/common/StarRating';
import { PriceRange } from '../components/common/PriceRange';

const AVAILABLE_TAGS = [
  'Great for dates',
  'Best pizza',
  'Natural Wine',
  'Michelin Star',
  'Casual hangout',
  'Family friendly',
  'Outdoor seating',
  'Cozy vibe',
  'Craft beer',
  'Quick lunch',
  'Seafood feast',
  'Special occasion',
];

export const WriteReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [rating, setRating] = useState<number>(8);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priceRange, setPriceRange] = useState<number>(2);
  const [visibility, setVisibility] = useState<'Public' | 'FriendsOnly'>('Public');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<{ url: string; caption?: string }[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visitNumber, setVisitNumber] = useState(1);

  useEffect(() => {
    async function init() {
      if (!id) return;
      const rest = await api.getRestaurantById(id);
      if (rest) {
        setRestaurant(rest);
        // Calculate visit number for this user
        const reviews = await api.getRestaurantReviews(id);
        const userVisits = reviews.filter((r) => r.userId === currentUser.id).length;
        const nextVisit = userVisits + 1;
        setVisitNumber(nextVisit);
        setTitle(nextVisit > 1 ? `Visit #${nextVisit}` : 'Great experience');
      }
    }
    init();
  }, [id, currentUser.id]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddSamplePhoto = (url: string) => {
    if (photos.length >= 5) return;
    setPhotos([...photos, { url, caption: captionInput || undefined }]);
    setPhotoUrlInput('');
    setCaptionInput('');
    setIsAddingPhoto(false);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !body.trim() || submitting) return;

    setSubmitting(true);
    await api.createReview({
      restaurantId: id,
      rating,
      title,
      body: body.trim(),
      priceRange,
      visibility,
      photos,
      tags: selectedTags,
      user: currentUser,
    });

    setSubmitting(false);
    navigate(`/restaurant/${id}`);
  };

  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Loading restaurant...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Back button */}
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-coral-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Back to {restaurant.name}</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <span className="text-xs font-bold text-coral-600 uppercase tracking-wider">
            Reviewing as @{currentUser.username}
          </span>
          <h1 className="text-2xl font-black text-charcoal-900 mt-1">
            {restaurant.name}
          </h1>
          <p className="text-xs text-gray-500">
            {restaurant.cuisineType} • {restaurant.cityName}
            {visitNumber > 1 && (
              <span className="ml-2 font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Visit #{visitNumber}
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating (1-10) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-2">
              Your Rating (1–10 Stars)
            </label>
            <div className="p-4 rounded-2xl bg-cream-100 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-3xl font-black text-charcoal-900">{rating}</span>
                <span className="text-base text-gray-500 font-bold">/10</span>
                <p className="text-xs text-gray-500">
                  {rating >= 9
                    ? 'Extraordinary! World-class.'
                    : rating >= 8
                    ? 'Delicious, highly recommended.'
                    : rating >= 7
                    ? 'Good meal, solid option.'
                    : 'Average or needs improvement.'}
                </p>
              </div>
              <StarRating
                rating={rating}
                interactive={true}
                onChange={setRating}
                size="lg"
                showBadge={false}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
              Headline / Summary
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best sourdough pizza in Oslo!"
              className="w-full bg-cream-100 border border-gray-200 focus:border-coral-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none transition-colors"
            />
            {visitNumber > 1 && (
              <p className="text-[11px] text-teal-700 mt-1 font-medium">
                Note: "(#{visitNumber})" will be automatically appended to distinguish multiple visits.
              </p>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-1">
              Review Details <span className="text-coral-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What did you order? How was the service, flavours, atmosphere, or wine pairing?"
              className="w-full bg-cream-100 border border-gray-200 focus:border-coral-500 focus:bg-white rounded-xl p-4 text-sm text-charcoal-900 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-2">
              Price Range For This Visit
            </label>
            <PriceRange price={priceRange} interactive={true} onChange={setPriceRange} />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-2">
              Tags & Vibe (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Uploader (Max 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                Photos (Up to 5)
              </label>
              <span className="text-xs text-gray-400">{photos.length}/5</span>
            </div>

            {/* Photo Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {photos.map((p, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group border">
                  <img src={p.url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => setIsAddingPhoto(!isAddingPhoto)}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-coral-400 flex flex-col items-center justify-center text-gray-500 hover:text-coral-600 bg-cream-50 transition-colors"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                </button>
              )}
            </div>

            {/* Photo picker helper modal/drawer */}
            {isAddingPhoto && (
              <div className="p-3 bg-cream-100 rounded-2xl border border-coral-200 space-y-2 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-charcoal-900">Choose Food Photo Sample:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddSamplePhoto(url)}
                      className="aspect-square rounded-lg overflow-hidden border hover:border-coral-500 transition-transform hover:scale-105"
                    >
                      <img src={url} alt="sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visibility Toggle: Public vs Friends Only */}
          <div className="p-4 rounded-2xl bg-cream-100 border border-gray-200">
            <span className="block text-xs font-bold uppercase tracking-wider text-charcoal-800 mb-2">
              Privacy & Audience
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility('Public')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  visibility === 'Public'
                    ? 'bg-white border-coral-500 text-coral-600 shadow-xs'
                    : 'bg-transparent border-gray-200 text-gray-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                <div className="text-left">
                  <div>Public</div>
                  <div className="text-[10px] text-gray-400 font-normal">Visible to everyone</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('FriendsOnly')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  visibility === 'FriendsOnly'
                    ? 'bg-white border-teal-700 text-teal-800 shadow-xs'
                    : 'bg-transparent border-gray-200 text-gray-600'
                }`}
              >
                <Shield className="w-4 h-4 text-teal-600" />
                <div className="text-left">
                  <div>Friends Only</div>
                  <div className="text-[10px] text-gray-400 font-normal">Only your followers</div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!body.trim() || submitting}
            className="w-full py-4 px-6 rounded-2xl bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white font-black text-base shadow-hover transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>{submitting ? 'Publishing Review...' : 'Publish Review'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
