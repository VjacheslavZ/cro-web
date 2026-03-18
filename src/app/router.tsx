import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { useAppSelector } from '../store';
import { LoginPage } from '../features/auth/LoginPage';
import { LanguageSelectPage } from '../features/auth/LanguageSelectPage';
import { ExercisesPage } from '../features/exercises/ExercisesPage';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
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
    </BrowserRouter>
  );
}
