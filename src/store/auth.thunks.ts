import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../api/client';
import type { UserProfile } from './auth.slice';

export const fetchMe = createAsyncThunk<UserProfile>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<UserProfile>('/users/me');
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
