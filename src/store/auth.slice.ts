import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';

import { clearTokens, saveUser, loadUser } from '../shared/lib/auth-storage';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  nativeLanguage: string | null;
  xpTotal: number;
  currentStreak: number;
}

interface AuthState {
  user: UserProfile | null;
}

const initialState: AuthState = {
  user: loadUser<UserProfile>(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    _setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    _clearUser(state) {
      state.user = null;
    },
  },
});

export function setCredentials(payload: {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}) {
  return (dispatch: Dispatch) => {
    dispatch(authSlice.actions._setUser(payload.user));
  };
}

export function setUser(user: UserProfile) {
  return (dispatch: Dispatch) => {
    saveUser(user);
    dispatch(authSlice.actions._setUser(user));
  };
}

export function clearAuth() {
  return (dispatch: Dispatch) => {
    clearTokens();
    saveUser(null);
    dispatch(authSlice.actions._clearUser());
  };
}

export const authReducer = authSlice.reducer;
