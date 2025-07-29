import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import UserCard from '../../components/ui/UserCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { loadFollowers, loadFollowing, selectFollowers, selectFollowing, selectFollowersPagination, selectFollowingPagination } from '../follows/followsSlice';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const PaginatedList = ({ userId, type }) => {
  const dispatch = useDispatch();
  const listEndRef = useRef();
  const isLoadingRef = useRef(false);

  const loadAction = type === 'followers' ? loadFollowers : loadFollowing;
  const selectList = type === 'followers' ? selectFollowers : selectFollowing;
  const selectPagination = type === 'followers' ? selectFollowersPagination : selectFollowingPagination;

  const list = useSelector(state => selectList(state, userId));
  const pagination = useSelector(state => selectPagination(state, userId));

  const [page, setPage] = useState(1);

  const fetchMore = useCallback(() => {
    if (!isLoadingRef.current && pagination?.next) {
      isLoadingRef.current = true;
      dispatch(loadAction({ userId, page })).then(() => {
        isLoadingRef.current = false;
      });
    }
  }, [dispatch, userId, page, loadAction, pagination]);

  const { ref: observerRef } = useIntersectionObserver({
    threshold: 1,
    onIntersect: fetchMore,
  });

  useEffect(() => {
    if (pagination?.next) {
      setPage(p => p + 1);
    }
  }, [pagination]);

  return (
    <div className="flex flex-col space-y-4">
      {list.map(user => (
        <UserCard key={user.id} user={user} showFollowButton />
      ))}
      {pagination?.next && (
        <div ref={observerRef} className="flex justify-center py-4">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

PaginatedList.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['followers', 'following']).isRequired,
};

const FollowersList = ({ userId }) => (
  <PaginatedList userId={userId} type="followers" />
);

FollowersList.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const FollowingList = ({ userId }) => (
  <PaginatedList userId={userId} type="following" />
);

FollowingList.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export { FollowersList, FollowingList };
