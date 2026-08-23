import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/announcements', { params: { page, limit: 9 } });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load announcements');
    }
  }
);

export const fetchAnnouncementById = createAsyncThunk(
  'announcements/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/announcements/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Not found');
    }
  }
);

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState: {
    list: [],
    pagination: null,
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default announcementsSlice.reducer;