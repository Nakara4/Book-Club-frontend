import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiService from '../../services/api';

/**
 * Component that redirects authenticated users away from auth pages (login/signup)
 * This prevents logged-in users from accessing login/signup pages
 */
const AuthRedirect = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = apiService.isAuthenticated();

  if (isAuthenticated) {
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default AuthRedirect;
