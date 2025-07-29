import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { logoutUser, logout } from '../auth/authSlice';

// Initial state for notifications
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetch: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  },
};

// Async thunks for notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, pageSize = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/notifications/', {
        params: { page, page_size: pageSize }
      });
      
      return {
        notifications: response.data.results || response.data.notifications || [],
        pagination: {
          count: response.data.count || 0,
          currentPage: page,
          totalPages: response.data.count ? Math.ceil(response.data.count / pageSize) : 1,
          hasMore: !!response.data.next,
        },
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to fetch notifications',
        status: error.response?.status || 0,
      });
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await apiService.patch(`/notifications/${notificationId}/`, {
        is_read: true
      });
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue({
        notificationId,
        message: error.response?.data?.message || error.message || 'Failed to mark notification as read',
        status: error.response?.status || 0,
      });
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to mark all notifications as read',
        status: error.response?.status || 0,
      });
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await apiService.delete(`/notifications/${notificationId}/`);
      return { notificationId };
    } catch (error) {
      return rejectWithValue({
        notificationId,
        message: error.response?.data?.message || error.message || 'Failed to delete notification',
        status: error.response?.status || 0,
      });
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add a new notification (from WebSocket or other real-time source)
    addNotification: (state, action) => {
      const notification = action.payload;
      
      // Check if notification already exists
      const existingIndex = state.notifications.findIndex(n => n.id === notification.id);
      
      if (existingIndex === -1) {
        // Add to beginning of array (most recent first)
        state.notifications.unshift(notification);
        
        // Update unread count if notification is unread
        if (!notification.is_read) {
          state.unreadCount += 1;
        }
      }
    },
    
    // Update an existing notification
    updateNotification: (state, action) => {
      const { id, updates } = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === id);
      
      if (notificationIndex !== -1) {
        const oldNotification = state.notifications[notificationIndex];
        state.notifications[notificationIndex] = { ...oldNotification, ...updates };
        
        // Update unread count if read status changed
        if (oldNotification.is_read !== updates.is_read) {
          if (updates.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          } else {
            state.unreadCount += 1;
          }
        }
      }
    },
    
    // Remove a notification
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        
        // Update unread count if notification was unread
        if (!notification.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        state.notifications.splice(notificationIndex, 1);
      }
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      };
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update unread count directly (from WebSocket or polling)
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, pagination } = action.payload;
        const { currentPage } = pagination;
        
        if (currentPage === 1) {
          // Replace notifications for first page
          state.notifications = notifications;
        } else {
          // Append notifications for subsequent pages
          state.notifications = [...state.notifications, ...notifications];
        }
        
        state.pagination = pagination;
        state.unreadCount = notifications.filter(n => !n.is_read).length;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1 && !state.notifications[notificationIndex].is_read) {
          state.notifications[notificationIndex].is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          is_read: true
        }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          
          if (!notification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          
          state.notifications.splice(notificationIndex, 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload.message;
      })
      
      // Clear notifications on logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
        state.error = null;
        state.loading = false;
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
        };
      })
      .addCase(logout, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
        state.error = null;
        state.loading = false;
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
        };
      });
  },
});

// Action creators
export const {
  addNotification,
  updateNotification,
  removeNotification,
  clearAllNotifications,
  clearError,
  setUnreadCount,
} = notificationsSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications?.notifications || [];
export const selectUnreadCount = (state) => state.notifications?.unreadCount || 0;
export const selectNotificationsLoading = (state) => state.notifications?.loading || false;
export const selectNotificationsError = (state) => state.notifications?.error || null;
export const selectNotificationsPagination = (state) => state.notifications?.pagination || {};

// Get unread notifications
export const selectUnreadNotifications = (state) => {
  const notifications = selectNotifications(state);
  return notifications.filter(notification => !notification.is_read);
};

// Get notifications by type
export const selectNotificationsByType = (state, type) => {
  const notifications = selectNotifications(state);
  return notifications.filter(notification => notification.type === type);
};

// Get follow-related notifications
export const selectFollowNotifications = (state) => {
  return selectNotificationsByType(state, 'follow');
};

export default notificationsSlice.reducer;
