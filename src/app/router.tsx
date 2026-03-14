import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import { LoginPage } from '../features/auth/LoginPage';
import { LanguageSelectPage } from '../features/auth/LanguageSelectPage';

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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
    </BrowserRouter>
  );
}
