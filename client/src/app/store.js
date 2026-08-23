import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import galleryReducer from '../features/gallery/gallerySlice';
import contactReducer from '../features/contact/contactSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    announcements: announcementsReducer,
    gallery: galleryReducer,
    contact: contactReducer,
  },
});