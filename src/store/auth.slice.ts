import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'auth';

interface UserProfile {
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
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

function loadAuthState(): AuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AuthState;
    }
  } catch {
    // ignore corrupted storage
  }
  return {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
  };
}

function saveAuthState(state: AuthState) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: UserProfile;
        accessToken: string;
        refreshToken: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      saveAuthState(state as AuthState);
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      saveAuthState(state as AuthState);
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      saveAuthState(state as AuthState);
    },
  },
});

export const { setCredentials, setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
