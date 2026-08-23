import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ filter = 'upcoming', search = '', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/events', {
        params: { filter, search, page, limit: 9 },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load events');
    }
  }
);

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/events/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Event not found');
  }
});

export const toggleRsvp = createAsyncThunk('events/toggleRsvp', async (eventId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/events/${eventId}/rsvp`);
    return { eventId, ...data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'RSVP failed');
  }
});

export const fetchMyRsvps = createAsyncThunk('events/fetchMyRsvps', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/events/my/rsvps');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load your RSVPs');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    pagination: null,
    current: null,
    myRsvps: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleRsvp.fulfilled, (state, action) => {
        const { eventId, rsvped, rsvpCount } = action.payload;
        if (state.current?._id === eventId && state.current.rsvps) {
          state.current.rsvpCount = rsvpCount;
          state.current._rsvped = rsvped;
        }
      })
      .addCase(fetchMyRsvps.fulfilled, (state, action) => {
        state.myRsvps = action.payload;
      });
  },
});

export default eventsSlice.reducer;