import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import ShowsPage from "@/pages/shows/ShowsPage";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { useTheme } from "@/hooks/useTheme";
import { EROUTES } from "./constants/EROUTES";

// Animated Routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path={EROUTES.LOGIN} element={<LoginPage />} />
        <Route path={EROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path={EROUTES.SHOWS}
          element={
            <ProtectedRoute>
              <ShowsPage />
            </ProtectedRoute>
          }
        />

        {/* Default route - redirect to shows */}
        <Route path="/" element={<Navigate to={EROUTES.SHOWS} replace />} />

        {/* Catch all route - redirect to shows */}
        <Route path="*" element={<Navigate to={EROUTES.SHOWS} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Initialize theme to ensure it's applied on all pages
  useTheme();

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
