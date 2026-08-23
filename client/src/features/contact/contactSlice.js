import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const submitContact = createAsyncThunk('contact/submit', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/contact', formData);
    return data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    isSubmitting: false,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearContactState: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.successMessage = action.payload;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;