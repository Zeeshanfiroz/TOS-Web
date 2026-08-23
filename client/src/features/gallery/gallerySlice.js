import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchGallery = createAsyncThunk(
  'gallery/fetchAll',
  async ({ eventRef = '', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/gallery', {
        params: { eventRef: eventRef || undefined, page, limit: 24 },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load gallery');
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    images: [],
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;