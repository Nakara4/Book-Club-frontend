import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { logoutUser, logout } from '../auth/authSlice';

// Types for better documentation
const initialState = {
  byUser: {}, // { userId: { followers: [], following: [], status: 'idle' | 'loading' | 'error' } }
  current: { 
    targets: {}, // { userId: { isFollowing: boolean, loading: boolean, error: string | null } }
    followCounts: {}, // { userId: { followersCount: number, followingCount: number } }
  },
};
// Async thunks with comprehensive error handling
export const followUserThunk = createAsyncThunk(
  'follows/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/users/${userId}/follow/`);
      return { userId, response: response.data };
    } catch (error) {
      return rejectWithValue({
        userId,
        message: error.response?.data?.message || error.message || 'Failed to follow user',
        status: error.response?.status || 0,
      });
    }
  }
);

export const unfollowUserThunk = createAsyncThunk(
  'follows/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`/users/${userId}/follow/`);
      return { userId, response: response.data };
    } catch (error) {
      return rejectWithValue({
        userId,
        message: error.response?.data?.message || error.message || 'Failed to unfollow user',
        status: error.response?.status || 0,
      });
    }
  }
);

export const loadFollowers = createAsyncThunk(
  'follows/loadFollowers',
  async ({ userId, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}/followers/`, {
        params: { page, page_size: pageSize }
      });
      return { 
        userId, 
        followers: response.data.results || response.data.followers || [],
        pagination: {
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous,
          currentPage: page,
          totalPages: response.data.count ? Math.ceil(response.data.count / pageSize) : 1,
        }
      };
    } catch (error) {
      return rejectWithValue({
        userId,
        message: error.response?.data?.message || error.message || 'Failed to load followers',
        status: error.response?.status || 0,
      });
    }
  }
);

export const loadFollowing = createAsyncThunk(
  'follows/loadFollowing',
  async ({ userId, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}/following/`, {
        params: { page, page_size: pageSize }
      });
      return { 
        userId, 
        following: response.data.results || response.data.following || [],
        pagination: {
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous,
          currentPage: page,
          totalPages: response.data.count ? Math.ceil(response.data.count / pageSize) : 1,
        }
      };
    } catch (error) {
      return rejectWithValue({
        userId,
        message: error.response?.data?.message || error.message || 'Failed to load following',
        status: error.response?.status || 0,
      });
    }
  }
);

export const loadFollowStatus = createAsyncThunk(
  'follows/loadFollowStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}/follow-status/`);
      return { 
        userId, 
        isFollowing: response.data.is_following || false,
        isFollowedBy: response.data.is_followed_by || false,
        followData: response.data
      };
    } catch (error) {
      return rejectWithValue({
        userId,
        message: error.response?.data?.message || error.message || 'Failed to load follow status',
        status: error.response?.status || 0,
      });
    }
  }
);

const followsSlice = createSlice({
  name: 'follows',
  initialState,
  reducers: {
    // Clear error for specific user
    clearFollowError: (state, action) => {
      const userId = action.payload;
      if (state.current.targets[userId]) {
        state.current.targets[userId].error = null;
      }
    },
    // Reset follow state for specific user
    resetFollowState: (state, action) => {
      const userId = action.payload;
      delete state.current.targets[userId];
      delete state.byUser[userId];
    },
    // Clear all follow state
    clearAllFollowState: (state) => {
      state.byUser = {};
      state.current.targets = {};
      state.current.followCounts = {};
    },
    
    // Set follow counts from real-time updates
    setFollowCounts: (state, action) => {
      const { userId, followersCount, followingCount } = action.payload;
      if (!state.current.followCounts[userId]) {
        state.current.followCounts[userId] = {};
      }
      state.current.followCounts[userId] = { followersCount, followingCount };
    },
    
    // Update follow counts from WebSocket events
    updateFollowCounts: (state, action) => {
      const { userId, followersCount, followingCount } = action.payload;
      if (!state.current.followCounts[userId]) {
        state.current.followCounts[userId] = {};
      }
      if (followersCount !== undefined) {
        state.current.followCounts[userId].followersCount = followersCount;
      }
      if (followingCount !== undefined) {
        state.current.followCounts[userId].followingCount = followingCount;
      }
    },
    
    // Handle real-time follow update
    handleRealTimeFollowUpdate: (state, action) => {
      const { type, followerId, followedId } = action.payload;
      
      // Update follow status
      if (type === 'follow') {
        if (state.current.targets[followedId]) {
          // This might be relevant if current user is being followed
        }
      } else if (type === 'unfollow') {
        if (state.current.targets[followedId]) {
          // This might be relevant if current user is being unfollowed
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user cases with optimistic updates
      .addCase(followUserThunk.pending, (state, action) => {
        const userId = action.meta.arg;
        
        // Optimistic update: assume follow will succeed
        state.current.targets[userId] = {
          isFollowing: true,
          loading: true,
          error: null,
        };
      })
      .addCase(followUserThunk.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.current.targets[userId] = {
          isFollowing: true,
          loading: false,
          error: null,
        };
        
        // Update user data if exists
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'following';
        }
      })
      .addCase(followUserThunk.rejected, (state, action) => {
        const { userId, message } = action.payload;
        
        // Rollback optimistic update
        state.current.targets[userId] = {
          isFollowing: false,
          loading: false,
          error: message,
        };
        
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'error';
        }
      })
      
      // Unfollow user cases with optimistic updates
      .addCase(unfollowUserThunk.pending, (state, action) => {
        const userId = action.meta.arg;
        
        // Optimistic update: assume unfollow will succeed
        state.current.targets[userId] = {
          isFollowing: false,
          loading: true,
          error: null,
        };
      })
      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.current.targets[userId] = {
          isFollowing: false,
          loading: false,
          error: null,
        };
        
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'notFollowing';
        }
      })
      .addCase(unfollowUserThunk.rejected, (state, action) => {
        const { userId, message } = action.payload;
        
        // Rollback optimistic update
        state.current.targets[userId] = {
          isFollowing: true,
          loading: false,
          error: message,
        };
        
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'error';
        }
      })
      
      // Load followers cases
      .addCase(loadFollowers.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.byUser[userId]) {
          state.byUser[userId] = {
            followers: [],
            following: [],
            status: 'loading',
          };
        } else {
          state.byUser[userId].status = 'loading';
        }
      })
      .addCase(loadFollowers.fulfilled, (state, action) => {
        const { userId, followers, pagination } = action.payload;
        
        if (!state.byUser[userId]) {
          state.byUser[userId] = {
            followers: [],
            following: [],
            status: 'idle',
          };
        }
        
        state.byUser[userId].followers = followers;
        state.byUser[userId].followersPagination = pagination;
        state.byUser[userId].status = 'idle';
      })
      .addCase(loadFollowers.rejected, (state, action) => {
        const { userId } = action.payload;
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'error';
        }
      })
      
      // Load following cases
      .addCase(loadFollowing.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.byUser[userId]) {
          state.byUser[userId] = {
            followers: [],
            following: [],
            status: 'loading',
          };
        } else {
          state.byUser[userId].status = 'loading';
        }
      })
      .addCase(loadFollowing.fulfilled, (state, action) => {
        const { userId, following, pagination } = action.payload;
        
        if (!state.byUser[userId]) {
          state.byUser[userId] = {
            followers: [],
            following: [],
            status: 'idle',
          };
        }
        
        state.byUser[userId].following = following;
        state.byUser[userId].followingPagination = pagination;
        state.byUser[userId].status = 'idle';
      })
      .addCase(loadFollowing.rejected, (state, action) => {
        const { userId } = action.payload;
        if (state.byUser[userId]) {
          state.byUser[userId].status = 'error';
        }
      })
      
      // Load follow status cases
      .addCase(loadFollowStatus.pending, (state, action) => {
        const userId = action.meta.arg;
        if (!state.current.targets[userId]) {
          state.current.targets[userId] = {
            isFollowing: false,
            loading: true,
            error: null,
          };
        } else {
          state.current.targets[userId].loading = true;
          state.current.targets[userId].error = null;
        }
      })
      .addCase(loadFollowStatus.fulfilled, (state, action) => {
        const { userId, isFollowing, isFollowedBy } = action.payload;
        
        state.current.targets[userId] = {
          isFollowing,
          loading: false,
          error: null,
        };
        
        if (!state.byUser[userId]) {
          state.byUser[userId] = {
            followers: [],
            following: [],
            status: isFollowing ? 'following' : 'notFollowing',
          };
        } else {
          state.byUser[userId].status = isFollowing ? 'following' : 'notFollowing';
        }
      })
      .addCase(loadFollowStatus.rejected, (state, action) => {
        const { userId, message } = action.payload;
        
        if (state.current.targets[userId]) {
          state.current.targets[userId].loading = false;
          state.current.targets[userId].error = message;
        }
      })
      
      // Clear follows state on logout
      .addCase(logoutUser.fulfilled, (state) => {
        // Reset all follow state when user logs out
        state.byUser = {};
        state.current.targets = {};
      })
      .addCase(logoutUser.rejected, (state) => {
        // Reset all follow state even if logout fails on server
        state.byUser = {};
        state.current.targets = {};
      })
      
      // Clear follows state on synchronous logout action
      .addCase(logout, (state) => {
        // Reset all follow state when user logs out synchronously
        state.byUser = {};
        state.current.targets = {};
      });
  },
});

// Action creators
export const { 
  clearFollowError, 
  resetFollowState, 
  clearAllFollowState,
  setFollowCounts,
  updateFollowCounts,
  handleRealTimeFollowUpdate
} = followsSlice.actions;

// Selectors with proper typing
export const selectIsFollowing = (state, userId) => {
  return state.follows?.current?.targets?.[userId]?.isFollowing ?? false;
};

export const selectFollowLoading = (state, userId) => {
  return state.follows?.current?.targets?.[userId]?.loading ?? false;
};

export const selectFollowError = (state, userId) => {
  return state.follows?.current?.targets?.[userId]?.error ?? null;
};

export const selectFollowers = (state, userId) => {
  return state.follows?.byUser?.[userId]?.followers ?? [];
};

export const selectFollowing = (state, userId) => {
  return state.follows?.byUser?.[userId]?.following ?? [];
};

export const selectUserFollowStatus = (state, userId) => {
  return state.follows?.byUser?.[userId]?.status ?? 'idle';
};

export const selectFollowersPagination = (state, userId) => {
  return state.follows?.byUser?.[userId]?.followersPagination ?? null;
};

export const selectFollowingPagination = (state, userId) => {
  return state.follows?.byUser?.[userId]?.followingPagination ?? null;
};

// Selectors for follow counts (prefer real-time counts over array length)
export const selectFollowersCount = (state, userId) => {
  // Try real-time count first, fallback to array length
  const realTimeCount = state.follows?.current?.followCounts?.[userId]?.followersCount;
  if (realTimeCount !== undefined) {
    return realTimeCount;
  }
  return state.follows?.byUser?.[userId]?.followers?.length ?? 0;
};

export const selectFollowingCount = (state, userId) => {
  // Try real-time count first, fallback to array length  
  const realTimeCount = state.follows?.current?.followCounts?.[userId]?.followingCount;
  if (realTimeCount !== undefined) {
    return realTimeCount;
  }
  return state.follows?.byUser?.[userId]?.following?.length ?? 0;
};

// Complex selectors
export const selectMutualFollows = (state, userId, currentUserId) => {
  const userFollowing = state.follows?.byUser?.[userId]?.following ?? [];
  const currentUserFollowing = state.follows?.byUser?.[currentUserId]?.following ?? [];
  
  return userFollowing.filter(user => 
    currentUserFollowing.some(currentUser => currentUser.id === user.id)
  );
};

export const selectIsFollowingUser = (state, userId, targetUserId) => {
  const following = state.follows?.byUser?.[userId]?.following ?? [];
  return following.some(user => user.id === targetUserId);
};

export default followsSlice.reducer;
