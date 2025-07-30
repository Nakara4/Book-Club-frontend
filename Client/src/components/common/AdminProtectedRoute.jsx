import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../../features/auth/authSlice';

/**
 * AdminProtectedRoute component that ensures only admin users can access certain routes.
 * 
 * This component uses React-Router v6 element composition pattern to wrap protected content.
 * It checks the user's authentication status and admin privileges from Redux state.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The component(s) to render if user is authorized
 * @param {string} [props.redirectTo='/login'] - Route to redirect to if user is not authenticated  
 * @param {string} [props.adminRedirectTo='/403'] - Route to redirect to if user is authenticated but not admin
 * @param {boolean} [props.requireAuth=true] - Whether to check authentication status
 * 
 * @returns {React.ReactElement} Either the children components or a Navigate component for redirection
 */
const AdminProtectedRoute = ({ 
  children, 
  redirectTo = '/login', 
  adminRedirectTo = '/403',
  requireAuth = true 
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  // First check: Authentication (if required)
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return URL state
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Second check: Admin privileges
  if (!isAdmin) {
    // Redirect to 403 page or specified admin redirect route
    return (
      <Navigate 
        to={adminRedirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // User is authenticated and is admin - render protected content
  return children;
};

export default AdminProtectedRoute;
