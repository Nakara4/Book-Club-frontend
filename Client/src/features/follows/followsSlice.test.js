import { configureStore } from '@reduxjs/toolkit';
import followsReducer, {
  followUserThunk,
  unfollowUserThunk,
  loadFollowers,
  loadFollowing,
  loadFollowStatus,
  clearFollowError,
  resetFollowState,
  clearAllFollowState,
  selectIsFollowing,
  selectFollowLoading,
  selectFollowError,
  selectFollowers,
  selectFollowing,
  selectUserFollowStatus,
  selectFollowersCount,
  selectFollowingCount,
  selectFollowersPagination,
  selectFollowingPagination,
  selectMutualFollows,
  selectIsFollowingUser,
} from './followsSlice';
import apiService from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockedApiService = apiService;

describe('followsSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        follows: followsReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState();
      expect(state.follows).toEqual({
        byUser: {},
        current: {
          targets: {},
        },
      });
    });
  });

  describe('synchronous actions', () => {
    beforeEach(() => {
      // Set up initial state with some data
      store.dispatch({
        type: 'follows/loadFollowStatus/fulfilled',
        payload: {
          userId: 'user1',
          isFollowing: true,
          isFollowedBy: false,
        },
      });
      store.dispatch({
        type: 'follows/loadFollowers/fulfilled',
        payload: {
          userId: 'user1',
          followers: [{ id: 'follower1', name: 'Follower 1' }],
          pagination: { count: 1, currentPage: 1, totalPages: 1 },
        },
      });
    });

    it('should clear follow error for specific user', () => {
      // First set an error
      store.dispatch({
        type: 'follows/followUser/rejected',
        payload: { userId: 'user1', message: 'Error following user' },
      });

      // Clear the error
      store.dispatch(clearFollowError('user1'));

      const state = store.getState();
      expect(state.follows.current.targets.user1.error).toBeNull();
    });

    it('should reset follow state for specific user', () => {
      store.dispatch(resetFollowState('user1'));

      const state = store.getState();
      expect(state.follows.current.targets.user1).toBeUndefined();
      expect(state.follows.byUser.user1).toBeUndefined();
    });

    it('should clear all follow state', () => {
      store.dispatch(clearAllFollowState());

      const state = store.getState();
      expect(state.follows.byUser).toEqual({});
      expect(state.follows.current.targets).toEqual({});
    });
  });

  describe('followUserThunk', () => {
    const userId = 'user123';
    const mockResponse = { data: { success: true, message: 'Followed successfully' } };

    it('should handle followUser pending state with optimistic update', () => {
      store.dispatch(followUserThunk.pending('', userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: true,
        loading: true,
        error: null,
      });
    });

    it('should handle followUser fulfilled state', async () => {
      mockedApiService.post.mockResolvedValueOnce(mockResponse);

      await store.dispatch(followUserThunk(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: true,
        loading: false,
        error: null,
      });
    });

    it('should handle followUser rejected state with rollback', async () => {
      const errorMessage = 'Failed to follow user';
      mockedApiService.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage }, status: 400 },
      });

      await store.dispatch(followUserThunk(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: false,
        loading: false,
        error: errorMessage,
      });
    });

    it('should call correct API endpoint', async () => {
      mockedApiService.post.mockResolvedValueOnce(mockResponse);

      await store.dispatch(followUserThunk(userId));

      expect(mockedApiService.post).toHaveBeenCalledWith(`/users/${userId}/follow/`);
    });
  });

  describe('unfollowUserThunk', () => {
    const userId = 'user123';
    const mockResponse = { data: { success: true, message: 'Unfollowed successfully' } };

    beforeEach(() => {
      // Set initial following state
      store.dispatch({
        type: 'follows/loadFollowStatus/fulfilled',
        payload: { userId, isFollowing: true, isFollowedBy: false },
      });
    });

    it('should handle unfollowUser pending state with optimistic update', () => {
      store.dispatch(unfollowUserThunk.pending('', userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: false,
        loading: true,
        error: null,
      });
    });

    it('should handle unfollowUser fulfilled state', async () => {
      mockedApiService.delete.mockResolvedValueOnce(mockResponse);

      await store.dispatch(unfollowUserThunk(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: false,
        loading: false,
        error: null,
      });
    });

    it('should handle unfollowUser rejected state with rollback', async () => {
      const errorMessage = 'Failed to unfollow user';
      mockedApiService.delete.mockRejectedValueOnce({
        response: { data: { message: errorMessage }, status: 400 },
      });

      await store.dispatch(unfollowUserThunk(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: true,
        loading: false,
        error: errorMessage,
      });
    });

    it('should call correct API endpoint', async () => {
      mockedApiService.delete.mockResolvedValueOnce(mockResponse);

      await store.dispatch(unfollowUserThunk(userId));

      expect(mockedApiService.delete).toHaveBeenCalledWith(`/users/${userId}/follow/`);
    });
  });

  describe('loadFollowers', () => {
    const userId = 'user123';
    const mockFollowers = [
      { id: 'follower1', name: 'John Doe', email: 'john@example.com' },
      { id: 'follower2', name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const mockResponse = {
      data: {
        results: mockFollowers,
        count: 2,
        next: null,
        previous: null,
      },
    };

    it('should handle loadFollowers pending state', () => {
      store.dispatch(loadFollowers.pending('', { userId }));

      const state = store.getState();
      expect(state.follows.byUser[userId]).toEqual({
        followers: [],
        following: [],
        status: 'loading',
      });
    });

    it('should handle loadFollowers fulfilled state', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowers({ userId, page: 1, pageSize: 20 }));

      const state = store.getState();
      expect(state.follows.byUser[userId].followers).toEqual(mockFollowers);
      expect(state.follows.byUser[userId].status).toBe('idle');
      expect(state.follows.byUser[userId].followersPagination).toEqual({
        count: 2,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
      });
    });

    it('should handle loadFollowers rejected state', async () => {
      mockedApiService.get.mockRejectedValueOnce({
        response: { data: { message: 'Failed to load followers' }, status: 500 },
      });

      await store.dispatch(loadFollowers({ userId }));

      const state = store.getState();
      expect(state.follows.byUser[userId].status).toBe('error');
    });

    it('should call correct API endpoint with params', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowers({ userId, page: 2, pageSize: 10 }));

      expect(mockedApiService.get).toHaveBeenCalledWith(`/users/${userId}/followers/`, {
        params: { page: 2, page_size: 10 },
      });
    });
  });

  describe('loadFollowing', () => {
    const userId = 'user123';
    const mockFollowing = [
      { id: 'following1', name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 'following2', name: 'Bob Wilson', email: 'bob@example.com' },
    ];
    const mockResponse = {
      data: {
        results: mockFollowing,
        count: 2,
        next: null,
        previous: null,
      },
    };

    it('should handle loadFollowing pending state', () => {
      store.dispatch(loadFollowing.pending('', { userId }));

      const state = store.getState();
      expect(state.follows.byUser[userId]).toEqual({
        followers: [],
        following: [],
        status: 'loading',
      });
    });

    it('should handle loadFollowing fulfilled state', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowing({ userId, page: 1, pageSize: 20 }));

      const state = store.getState();
      expect(state.follows.byUser[userId].following).toEqual(mockFollowing);
      expect(state.follows.byUser[userId].status).toBe('idle');
      expect(state.follows.byUser[userId].followingPagination).toEqual({
        count: 2,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
      });
    });

    it('should handle loadFollowing rejected state', async () => {
      mockedApiService.get.mockRejectedValueOnce({
        response: { data: { message: 'Failed to load following' }, status: 500 },
      });

      await store.dispatch(loadFollowing({ userId }));

      const state = store.getState();
      expect(state.follows.byUser[userId].status).toBe('error');
    });

    it('should call correct API endpoint with params', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowing({ userId, page: 3, pageSize: 15 }));

      expect(mockedApiService.get).toHaveBeenCalledWith(`/users/${userId}/following/`, {
        params: { page: 3, page_size: 15 },
      });
    });
  });

  describe('loadFollowStatus', () => {
    const userId = 'user123';
    const mockResponse = {
      data: {
        is_following: true,
        is_followed_by: false,
      },
    };

    it('should handle loadFollowStatus pending state', () => {
      store.dispatch(loadFollowStatus.pending('', userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: false,
        loading: true,
        error: null,
      });
    });

    it('should handle loadFollowStatus fulfilled state', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowStatus(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId]).toEqual({
        isFollowing: true,
        loading: false,
        error: null,
      });
      expect(state.follows.byUser[userId].status).toBe('following');
    });

    it('should handle loadFollowStatus rejected state', async () => {
      const errorMessage = 'Failed to load follow status';
      mockedApiService.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage }, status: 404 },
      });

      await store.dispatch(loadFollowStatus(userId));

      const state = store.getState();
      expect(state.follows.current.targets[userId].loading).toBe(false);
      expect(state.follows.current.targets[userId].error).toBe(errorMessage);
    });

    it('should call correct API endpoint', async () => {
      mockedApiService.get.mockResolvedValueOnce(mockResponse);

      await store.dispatch(loadFollowStatus(userId));

      expect(mockedApiService.get).toHaveBeenCalledWith(`/users/${userId}/follow-status/`);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      // Set up test state
      const testState = {
        follows: {
          byUser: {
            user1: {
              followers: [
                { id: 'follower1', name: 'John' },
                { id: 'follower2', name: 'Jane' },
              ],
              following: [
                { id: 'following1', name: 'Alice' },
                { id: 'following2', name: 'Bob' },
              ],
              status: 'idle',
              followersPagination: { count: 2, currentPage: 1, totalPages: 1 },
              followingPagination: { count: 2, currentPage: 1, totalPages: 1 },
            },
            user2: {
              followers: [{ id: 'follower3', name: 'Charlie' }],
              following: [{ id: 'following1', name: 'Alice' }], // Mutual follow with user1
              status: 'idle',
            },
          },
          current: {
            targets: {
              user1: { isFollowing: true, loading: false, error: null },
              user2: { isFollowing: false, loading: true, error: 'Some error' },
            },
          },
        },
      };

      // Replace store state
      store.replaceReducer(() => testState);
    });

    describe('selectIsFollowing', () => {
      it('should return true when user is being followed', () => {
        const state = store.getState();
        expect(selectIsFollowing(state, 'user1')).toBe(true);
      });

      it('should return false when user is not being followed', () => {
        const state = store.getState();
        expect(selectIsFollowing(state, 'user2')).toBe(false);
      });

      it('should return false for non-existent user', () => {
        const state = store.getState();
        expect(selectIsFollowing(state, 'nonexistent')).toBe(false);
      });
    });

    describe('selectFollowLoading', () => {
      it('should return loading state', () => {
        const state = store.getState();
        expect(selectFollowLoading(state, 'user1')).toBe(false);
        expect(selectFollowLoading(state, 'user2')).toBe(true);
      });

      it('should return false for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowLoading(state, 'nonexistent')).toBe(false);
      });
    });

    describe('selectFollowError', () => {
      it('should return error message', () => {
        const state = store.getState();
        expect(selectFollowError(state, 'user1')).toBeNull();
        expect(selectFollowError(state, 'user2')).toBe('Some error');
      });

      it('should return null for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowError(state, 'nonexistent')).toBeNull();
      });
    });

    describe('selectFollowers', () => {
      it('should return followers array', () => {
        const state = store.getState();
        const followers = selectFollowers(state, 'user1');
        expect(followers).toHaveLength(2);
        expect(followers[0].name).toBe('John');
      });

      it('should return empty array for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowers(state, 'nonexistent')).toEqual([]);
      });
    });

    describe('selectFollowing', () => {
      it('should return following array', () => {
        const state = store.getState();
        const following = selectFollowing(state, 'user1');
        expect(following).toHaveLength(2);
        expect(following[0].name).toBe('Alice');
      });

      it('should return empty array for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowing(state, 'nonexistent')).toEqual([]);
      });
    });

    describe('selectFollowersCount', () => {
      it('should return correct followers count', () => {
        const state = store.getState();
        expect(selectFollowersCount(state, 'user1')).toBe(2);
        expect(selectFollowersCount(state, 'user2')).toBe(1);
      });

      it('should return 0 for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowersCount(state, 'nonexistent')).toBe(0);
      });
    });

    describe('selectFollowingCount', () => {
      it('should return correct following count', () => {
        const state = store.getState();
        expect(selectFollowingCount(state, 'user1')).toBe(2);
        expect(selectFollowingCount(state, 'user2')).toBe(1);
      });

      it('should return 0 for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowingCount(state, 'nonexistent')).toBe(0);
      });
    });

    describe('selectMutualFollows', () => {
      it('should return mutual follows between users', () => {
        const state = store.getState();
        const mutuals = selectMutualFollows(state, 'user1', 'user2');
        expect(mutuals).toHaveLength(1);
        expect(mutuals[0].name).toBe('Alice');
      });

      it('should return empty array when no mutual follows', () => {
        const state = store.getState();
        const mutuals = selectMutualFollows(state, 'user1', 'nonexistent');
        expect(mutuals).toEqual([]);
      });
    });

    describe('selectIsFollowingUser', () => {
      it('should return true when user is following target user', () => {
        const state = store.getState();
        expect(selectIsFollowingUser(state, 'user1', 'following1')).toBe(true);
      });

      it('should return false when user is not following target user', () => {
        const state = store.getState();
        expect(selectIsFollowingUser(state, 'user1', 'nonexistent')).toBe(false);
      });
    });

    describe('selectUserFollowStatus', () => {
      it('should return user follow status', () => {
        const state = store.getState();
        expect(selectUserFollowStatus(state, 'user1')).toBe('idle');
      });

      it('should return idle for non-existent user', () => {
        const state = store.getState();
        expect(selectUserFollowStatus(state, 'nonexistent')).toBe('idle');
      });
    });

    describe('selectFollowersPagination', () => {
      it('should return followers pagination data', () => {
        const state = store.getState();
        const pagination = selectFollowersPagination(state, 'user1');
        expect(pagination).toEqual({ count: 2, currentPage: 1, totalPages: 1 });
      });

      it('should return null for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowersPagination(state, 'nonexistent')).toBeNull();
      });
    });

    describe('selectFollowingPagination', () => {
      it('should return following pagination data', () => {
        const state = store.getState();
        const pagination = selectFollowingPagination(state, 'user1');
        expect(pagination).toEqual({ count: 2, currentPage: 1, totalPages: 1 });
      });

      it('should return null for non-existent user', () => {
        const state = store.getState();
        expect(selectFollowingPagination(state, 'nonexistent')).toBeNull();
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockedApiService.post.mockRejectedValueOnce(networkError);

      await store.dispatch(followUserThunk('user123'));

      const state = store.getState();
      expect(state.follows.current.targets.user123.error).toBe('Network Error');
    });

    it('should handle malformed API responses', async () => {
      mockedApiService.get.mockResolvedValueOnce({ data: null });

      await store.dispatch(loadFollowers({ userId: 'user123' }));

      const state = store.getState();
      expect(state.follows.byUser.user123.followers).toEqual([]);
    });

    it('should handle concurrent follow/unfollow actions', async () => {
      const userId = 'user123';
      
      // Mock successful responses
      mockedApiService.post.mockResolvedValueOnce({ data: { success: true } });
      mockedApiService.delete.mockResolvedValueOnce({ data: { success: true } });

      // Dispatch both actions
      const followPromise = store.dispatch(followUserThunk(userId));
      const unfollowPromise = store.dispatch(unfollowUserThunk(userId));

      await Promise.all([followPromise, unfollowPromise]);

      // The last action should win
      const state = store.getState();
      expect(state.follows.current.targets[userId]).toBeDefined();
    });
  });
});
