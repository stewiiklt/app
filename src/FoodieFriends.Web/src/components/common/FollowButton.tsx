import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { useUserContext } from '../../contexts/UserContext';

interface FollowButtonProps {
  userId: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = '' }) => {
  const { currentUser, isFollowing, toggleFollow } = useUserContext();

  if (userId === currentUser.id) {
    return null; // Cannot follow yourself
  }

  const following = isFollowing(userId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFollow(userId);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-300'
          : 'bg-teal-700 text-white hover:bg-teal-800 shadow-sm'
      } ${className}`}
    >
      {following ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};
