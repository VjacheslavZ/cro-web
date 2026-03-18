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

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function loadAuthState(): AuthState {
  const empty: AuthState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
  };

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as AuthState;
      if (state.refreshToken && isTokenExpired(state.refreshToken)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return empty;
      }
      return state;
    }
  } catch {
    // ignore corrupted storage
  }
  return empty;
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
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
});

export const { setCredentials, setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
