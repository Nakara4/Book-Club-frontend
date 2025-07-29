import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Async thunks for API calls
export const fetchBooksAnalytics = createAsyncThunk(
  'analytics/fetchBooksAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/analytics/books/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch books analytics'
      );
    }
  }
);

export const fetchSummariesAnalytics = createAsyncThunk(
  'analytics/fetchSummariesAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/analytics/summaries/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch summaries analytics'
      );
    }
  }
);

export const fetchActiveClubsAnalytics = createAsyncThunk(
  'analytics/fetchActiveClubsAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/analytics/active-clubs/`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch active clubs analytics'
      );
    }
  }
);

// Fetch all analytics data
export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAllAnalytics',
  async (_, { dispatch }) => {
    const promises = [
      dispatch(fetchBooksAnalytics()),
      dispatch(fetchSummariesAnalytics()),
      dispatch(fetchActiveClubsAnalytics()),
    ];
    
    await Promise.all(promises);
  }
);

const initialState = {
  booksData: [],
  summariesData: [],
  activeClubsCount: 0,
  loading: {
    books: false,
    summaries: false,
    activeClubs: false,
    all: false,
  },
  error: {
    books: null,
    summaries: null,
    activeClubs: null,
    general: null,
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        books: null,
        summaries: null,
        activeClubs: null,
        general: null,
      };
    },
    resetAnalytics: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch all analytics
    builder
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading.all = true;
        state.error.general = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state) => {
        state.loading.all = false;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading.all = false;
        state.error.general = action.payload || 'Failed to fetch analytics data';
      });

    // Books analytics
    builder
      .addCase(fetchBooksAnalytics.pending, (state) => {
        state.loading.books = true;
        state.error.books = null;
      })
      .addCase(fetchBooksAnalytics.fulfilled, (state, action) => {
        state.loading.books = false;
        state.booksData = action.payload;
      })
      .addCase(fetchBooksAnalytics.rejected, (state, action) => {
        state.loading.books = false;
        state.error.books = action.payload;
      });

    // Summaries analytics
    builder
      .addCase(fetchSummariesAnalytics.pending, (state) => {
        state.loading.summaries = true;
        state.error.summaries = null;
      })
      .addCase(fetchSummariesAnalytics.fulfilled, (state, action) => {
        state.loading.summaries = false;
        state.summariesData = action.payload;
      })
      .addCase(fetchSummariesAnalytics.rejected, (state, action) => {
        state.loading.summaries = false;
        state.error.summaries = action.payload;
      });

    // Active clubs analytics
    builder
      .addCase(fetchActiveClubsAnalytics.pending, (state) => {
        state.loading.activeClubs = true;
        state.error.activeClubs = null;
      })
      .addCase(fetchActiveClubsAnalytics.fulfilled, (state, action) => {
        state.loading.activeClubs = false;
        state.activeClubsCount = action.payload.count || action.payload;
      })
      .addCase(fetchActiveClubsAnalytics.rejected, (state, action) => {
        state.loading.activeClubs = false;
        state.error.activeClubs = action.payload;
      });
  },
});

// Analytics event tracking thunk
export const trackEvent = createAsyncThunk(
  'analytics/trackEvent',
  async ({ eventName, eventData = {}, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analytics/events/`, {
        event_name: eventName,
        event_data: eventData,
        user_id: userId,
        timestamp: new Date().toISOString(),
      }, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to track event'
      );
    }
  }
);

// Convenience functions for follow-related analytics
export const trackFollowEvent = (targetUserId, currentUserId) => 
  trackEvent({
    eventName: 'user_follow',
    eventData: {
      target_user_id: targetUserId,
      action: 'follow',
      source: 'follow_button'
    },
    userId: currentUserId
  });

export const trackUnfollowEvent = (targetUserId, currentUserId) => 
  trackEvent({
    eventName: 'user_unfollow',
    eventData: {
      target_user_id: targetUserId,
      action: 'unfollow',
      source: 'follow_button'
    },
    userId: currentUserId
  });

export const trackFollowError = (targetUserId, currentUserId, error) => 
  trackEvent({
    eventName: 'user_follow_error',
    eventData: {
      target_user_id: targetUserId,
      action: 'follow',
      error_message: error,
      source: 'follow_button'
    },
    userId: currentUserId
  });

export const trackUnfollowError = (targetUserId, currentUserId, error) => 
  trackEvent({
    eventName: 'user_unfollow_error',
    eventData: {
      target_user_id: targetUserId,
      action: 'unfollow',
      error_message: error,
      source: 'follow_button'
    },
    userId: currentUserId
  });

export const { clearErrors, resetAnalytics } = analyticsSlice.actions;

// Selectors
export const selectBooksData = (state) => state.analytics.booksData;
export const selectSummariesData = (state) => state.analytics.summariesData;
export const selectActiveClubsCount = (state) => state.analytics.activeClubsCount;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;
export const selectIsLoading = (state) => 
  Object.values(state.analytics.loading).some(loading => loading);

export default analyticsSlice.reducer;
