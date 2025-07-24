import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  // Enable Redux DevTools Extension
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;