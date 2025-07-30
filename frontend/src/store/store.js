import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './features/booksSlice';
import authReducer from './features/authSlice';
import notificationReducer from './features/notificationSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    notification: notificationReducer,
  },
});
