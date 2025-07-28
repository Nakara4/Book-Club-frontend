import React, { useState } from 'react';
import { bookClubAPI } from '../../services/api';

const BookClubJoin = ({ clubId, onJoinSuccess, onJoinError, className }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await bookClubAPI.joinBookClub(clubId);
      onJoinSuccess?.();
    } catch (error) {
      onJoinError?.(error.message || 'Failed to join book club');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={isJoining}
      className={`
        ${className || 'bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-soft hover:shadow-md'}
        transition duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {isJoining ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Joining...</span>
        </>
      ) : (
        'Join'
      )}
    </button>
  );
};

export default BookClubJoin;
