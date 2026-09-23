import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Tenant Pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import TenantRentalPage from './pages/tenant/TenantRentalPage';
import TenantApplicationsPage from './pages/tenant/TenantApplicationsPage';
import TenantPaymentsPage from './pages/tenant/TenantPaymentsPage';
import TenantMaintenancePage from './pages/tenant/TenantMaintenancePage';
import TenantReviewsPage from './pages/tenant/TenantReviewsPage';
import ProfilePage from './pages/tenant/TenantProfilePage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerPropertiesPage from './pages/owner/OwnerPropertiesPage';
import OwnerAddEditPropertyPage from './pages/owner/OwnerAddEditPropertyPage';
import OwnerRequestsPage from './pages/owner/OwnerRequestsPage';
import OwnerTenantsPage from './pages/owner/OwnerTenantsPage';
import OwnerMaintenancePage from './pages/owner/OwnerMaintenancePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Tenant Protected Routes */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="rental" element={<TenantRentalPage />} />
        <Route path="applications" element={<TenantApplicationsPage />} />
        <Route path="payments" element={<TenantPaymentsPage />} />
        <Route path="maintenance" element={<TenantMaintenancePage />} />
        <Route path="reviews" element={<TenantReviewsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Owner Protected Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="properties" element={<OwnerPropertiesPage />} />
        <Route path="properties/new" element={<OwnerAddEditPropertyPage />} />
        <Route path="properties/edit/:id" element={<OwnerAddEditPropertyPage />} />
        <Route path="requests" element={<OwnerRequestsPage />} />
        <Route path="tenants" element={<OwnerTenantsPage />} />
        <Route path="maintenance" element={<OwnerMaintenancePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="maintenance" element={<AdminMaintenancePage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all redirect to 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
