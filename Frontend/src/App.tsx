// Main App component with routing and animations
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/Dashboard';
import { AnalyzeProduct } from './components/pages/AnalyzeProduct';
import { AnalysisResult } from './components/pages/AnalysisResult';
import { History } from './components/pages/History';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';
import { Wishlist } from './components/pages/Wishlist';
import { Comparison } from './components/pages/Comparison';
import { Help } from './components/pages/Help';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <PageWrapper><AnalyzeProduct /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <PageWrapper><AnalysisResult /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper><History /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <PageWrapper><Wishlist /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <PageWrapper><Comparison /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <PageWrapper><Help /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <ComparisonProvider>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </ComparisonProvider>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

