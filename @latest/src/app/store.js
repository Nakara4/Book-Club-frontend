import { configureStore } from '@reduxjs/toolkit';


const tempReducer = (state = {}) => state;

const store = configureStore({
  reducer: {
    _temp: tempReducer 
  }
});

export default store;