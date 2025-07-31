import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import authReducer from '../features/auth/authSlice';
import { adminApi } from '../services/adminApi';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    analytics: analyticsReducer,
    auth: authReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),

  devTools: process.env.NODE_ENV !== 'production',
});

export default store;