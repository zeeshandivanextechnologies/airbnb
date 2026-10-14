import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';

// Redux Store Configuration with auth slice
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
