// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page component to render
 * @param {string|string[]} props.roles - Allowed role(s) for this route (optional)
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // User not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user's role is allowed
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const userRole = user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Role not allowed → redirect to dashboard (or a "forbidden" page)
      return <Navigate to="/forbidden" replace />;  // ✅ now points to a real page
    }
  }

  // User is authenticated and has required role → render the page
  return children;
};

export default ProtectedRoute;