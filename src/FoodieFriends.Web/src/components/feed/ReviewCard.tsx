import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Shield, Send, Bookmark } from 'lucide-react';
import { Review } from '../../types';
import { StarRating } from '../common/StarRating';
import { PriceRange } from '../common/PriceRange';
import { NewBadge } from '../common/NewBadge';
import { PhotoCarousel } from './PhotoCarousel';
import { useUserContext } from '../../contexts/UserContext';
import { api } from '../../services/api';

interface ReviewCardProps {
  review: Review;
  onLikeToggle?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLikeToggle }) => {
  const { currentUser, isWantToTry, toggleWantToTry } = useUserContext();
  const [liked, setLiked] = useState(review.isLikedByMe);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(review.comments || []);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const bookmarked = isWantToTry(review.restaurantId);

  const handleLike = async () => {
    const res = await api.toggleLikeReview(review.id);
    setLiked(res.liked);
    setLikeCount(res.count);
    if (onLikeToggle) onLikeToggle();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const newComment = await api.addComment(review.id, commentInput.trim(), currentUser);
    if (newComment) {
      setComments((prev) => [...prev, newComment]);
      setCommentInput('');
    }
    setIsSubmittingComment(false);
  };

  // Format relative time
  const timeFormatted = new Date(review.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 hover:border-coral-100 transition-all">
      {/* Top Header: Author info & metadata */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/user/${review.user.username}`}
          className="flex items-center gap-3 group"
        >
          <img
            src={review.user.profilePhotoUrl}
            alt={review.user.displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-coral-300 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-charcoal-900 group-hover:text-coral-600 transition-colors">
                {review.user.displayName}
              </span>
              <span className="text-xs text-gray-400">@{review.user.username}</span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{timeFormatted}</span>
          </div>
        </Link>

        {/* Visibility indicator */}
        {review.visibility === 'FriendsOnly' ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <Shield className="w-3 h-3" /> Friends only
          </span>
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">Public</span>
        )}
      </div>

      {/* Restaurant Header & Star Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/restaurant/${review.restaurantId}`}
              className="text-base font-extrabold text-charcoal-900 hover:text-coral-600 transition-colors"
            >
              {review.restaurantName}
            </Link>
            {review.isRestaurantNew && <NewBadge size="sm" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {review.restaurantCuisine} • {review.restaurantCity || 'Scandinavia'}
          </p>
        </div>

        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Title & Body */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-charcoal-800 mb-1">
          "{review.title}"
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {review.body}
        </p>
      </div>

      {/* Photo Carousel */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <PhotoCarousel photos={review.photos} />
        </div>
      )}

      {/* Tags and Price level */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-50 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {review.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium bg-cream-100 text-charcoal-800 px-2 py-0.5 rounded-md border border-amber-100"
            >
              🏷️ {tag}
            </span>
          ))}
        </div>
        <PriceRange price={review.priceRange} size="sm" />
      </div>

      {/* Action Footer: Like, Comment, Bookmark Want to Try */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-gray-600">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 hover:text-coral-600 transition-colors ${
              liked ? 'text-coral-600 font-bold' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-coral-600 text-coral-600' : ''}`} />
            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </button>

          {/* Comment Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-teal-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </button>
        </div>

        {/* Want to Try Quick Bookmark */}
        <button
          type="button"
          onClick={() => toggleWantToTry(review.restaurantId)}
          className={`flex items-center gap-1 transition-colors ${
            bookmarked ? 'text-coral-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Save to Want to Try"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-coral-600' : ''}`} />
          <span className="hidden sm:inline">{bookmarked ? 'Bookmarked' : 'Want to Try'}</span>
        </button>
      </div>

      {/* Mutual Friends Comment Drawer */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-gray-100 animate-in fade-in duration-150">
          {/* Visibility Note */}
          <div className="bg-cream-100 rounded-lg p-2 text-[11px] text-gray-500 mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Comments are visible only to mutual friends and the review author.</span>
          </div>

          {/* Comment list */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto mb-3 pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-1">No comments yet. Be the first to reply!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-xs">
                  <img
                    src={c.userAvatar}
                    alt={c.displayName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-cream-100 rounded-xl px-3 py-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900">{c.displayName}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-charcoal-800 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-cream-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-coral-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim() || isSubmittingComment}
              className="px-3 py-1.5 bg-coral-500 hover:bg-coral-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
