import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import authReducer from '../features/auth/authSlice';
import followsReducer from '../features/follows/followsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import toastReducer from '../features/toast/toastSlice';

// Configure store with proper middleware
const store = configureStore({
  reducer: {
    counter: counterReducer,
    analytics: analyticsReducer,
    auth: authReducer,
    follows: followsReducer,
    notifications: notificationsReducer,
    toast: toastReducer,
    // RTK Query APIs would be added here: e.g., api: apiSlice.reducer,
  },
  // Middleware setup with thunk and RTK-Query support
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Enable thunk middleware (default) - required for async thunks
      thunk: true,
      // Serializable check options
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    // RTK Query middleware would be added here:
    // .concat(apiSlice.middleware)
    ,
  // Enable Redux DevTools Extension
  devTools: process.env.NODE_ENV !== 'production',
});

// Export store types for TypeScript support
export const getState = store.getState;
export const dispatch = store.dispatch;

// Type exports (useful if migrating to TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
