import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

import { useAppSelector, useAppDispatch } from '../store';
import { clearAuth } from '../store/auth.slice';
import { fetchMe } from '../api/auth';
import {
  isAuthenticated as checkAuth,
  getRefreshToken,
  isTokenExpired,
} from '../shared/lib/auth-storage';
import { LoginPage } from '../features/auth/LoginPage';
import { LanguageSelectPage } from '../features/auth/LanguageSelectPage';
import { ExercisesPage } from '../features/exercises/ExercisesPage';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (refreshToken && isTokenExpired(refreshToken)) {
      dispatch(clearAuth());
      return;
    }
    if (!user && checkAuth()) {
      dispatch(fetchMe());
    }
  }, [location.pathname, user, dispatch]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!checkAuth()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LanguageGuard({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  if (user && !user.nativeLanguage) return <Navigate to="/language-select" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<div>About Us (placeholder)</div>} />
              <Route path="/partners" element={<div>For Partners (placeholder)</div>} />
              <Route path="/contacts" element={<div>Contacts (placeholder)</div>} />
              {/*{ Private routes }*/}
              <Route
                path="/exercises"
                element={
                  <PrivateRoute>
                    <LanguageGuard>
                      <ExercisesPage />
                    </LanguageGuard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/dictionary/my"
                element={
                  <PrivateRoute>
                    <LanguageGuard>
                      <div>My Dictionary (placeholder)</div>
                    </LanguageGuard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/dictionary/collections"
                element={
                  <PrivateRoute>
                    <LanguageGuard>
                      <div>Collections (placeholder)</div>
                    </LanguageGuard>
                  </PrivateRoute>
                }
              />
              <Route
                path="/language-select"
                element={
                  <PrivateRoute>
                    <LanguageSelectPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <LanguageGuard>
                      <div>Home (placeholder)</div>
                    </LanguageGuard>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </AuthGuard>
    </BrowserRouter>
  );
}
