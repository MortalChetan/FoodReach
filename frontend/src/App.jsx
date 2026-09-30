import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DonationDetailPage from './pages/DonationDetailPage';
import CreateDonationPage from './pages/CreateDonationPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import NgoDashboardPage from './pages/NgoDashboardPage';
import VolunteerDashboardPage from './pages/VolunteerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role) && role !== 'ROLE_ADMIN') {
    return <Navigate to="/explore" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/donations/:id" element={<DonationDetailPage />} />

          {/* Donor Routes */}
          <Route
            path="/donate/new"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DONOR', 'ROLE_ADMIN']}>
                <CreateDonationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_DONOR', 'ROLE_ADMIN']}>
                <DonorDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* NGO Routes */}
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_NGO', 'ROLE_ADMIN']}>
                <NgoDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Volunteer Routes */}
          <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_VOLUNTEER', 'ROLE_ADMIN']}>
                <VolunteerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
