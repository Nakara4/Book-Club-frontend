import React, { useState } from 'react';
import apiService from '../../services/api';
import { getUserDisplayName } from '../../utils/userUtils';

const FollowButton = ({ user, onFollowChange = () => {} }) => {
  const [isFollowing, setIsFollowing] = useState(user.is_following || false);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await apiService.unfollowUser(user.id);
        setIsFollowing(false);
        onFollowChange(user.id, false);
      } else {
        await apiService.followUser(user.id);
        setIsFollowing(true);
        onFollowChange(user.id, true);
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} ${getUserDisplayName(user)}:`, error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = isFollowing
    ? "bg-gray-200 hover:bg-red-100 text-gray-800 hover:text-red-600 border border-gray-300 hover:border-red-300"
    : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 hover:border-blue-600";

  const buttonText = loading
    ? (isFollowing ? 'Unfollowing...' : 'Following...')
    : (isFollowing ? 'Unfollow' : 'Follow');

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`
        px-4 py-2 rounded-lg font-medium text-sm transition duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonClasses}
      `}
    >
      {buttonText}
    </button>
  );
};

export default FollowButton;
