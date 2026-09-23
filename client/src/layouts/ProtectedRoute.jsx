import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying security credentials..." minHeight="100vh" />;
  }

  if (!isAuthenticated || !user) {
    // Redirect to login preserving destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role-based redirect fallback
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/tenant/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
