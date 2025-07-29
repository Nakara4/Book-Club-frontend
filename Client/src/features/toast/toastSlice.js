import { createSlice } from '@reduxjs/toolkit';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Initial state for toasts
const initialState = {
  toasts: [], // Array of toast objects
  nextId: 1,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    // Add a new toast
    addToast: (state, action) => {
      const { message, type = TOAST_TYPES.INFO, duration = 5000, retryAction, retryLabel = 'Retry' } = action.payload;
      
      const toast = {
        id: state.nextId++,
        message,
        type,
        duration,
        retryAction,
        retryLabel,
        timestamp: Date.now(),
      };
      
      state.toasts.push(toast);
    },
    
    // Remove a toast by ID
    removeToast: (state, action) => {
      const toastId = action.payload;
      state.toasts = state.toasts.filter(toast => toast.id !== toastId);
    },
    
    // Clear all toasts
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    
    // Add success toast (convenience action)
    addSuccessToast: (state, action) => {
      const { message, duration = 3000 } = action.payload;
      const toast = {
        id: state.nextId++,
        message,
        type: TOAST_TYPES.SUCCESS,
        duration,
        timestamp: Date.now(),
      };
      state.toasts.push(toast);
    },
    
    // Add error toast (convenience action)
    addErrorToast: (state, action) => {
      const { message, duration = 6000, retryAction, retryLabel = 'Retry' } = action.payload;
      const toast = {
        id: state.nextId++,
        message,
        type: TOAST_TYPES.ERROR,
        duration,
        retryAction,
        retryLabel,
        timestamp: Date.now(),
      };
      state.toasts.push(toast);
    },
  },
});

// Action creators
export const {
  addToast,
  removeToast,
  clearAllToasts,
  addSuccessToast,
  addErrorToast,
} = toastSlice.actions;

// Selectors
export const selectToasts = (state) => state.toast?.toasts || [];
export const selectToastById = (state, toastId) => 
  state.toast?.toasts?.find(toast => toast.id === toastId) || null;

export default toastSlice.reducer;
