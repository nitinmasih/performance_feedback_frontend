import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, userRole, requiredRole, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided, use it to check the user's role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // If requiredRole is provided, use it to check the user's role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

export default ProtectedRoute;
