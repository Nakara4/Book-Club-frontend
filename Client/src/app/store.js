import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    analytics: analyticsReducer,
    auth: authReducer,
  },
  // Enable Redux DevTools Extension
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;