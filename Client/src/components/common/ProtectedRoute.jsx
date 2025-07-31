import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiService from '../../services/api';
import { useSelector } from 'react-redux';
import { selectDecodedToken, selectIsAuthenticated } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const apiIsAuthenticated = apiService.isAuthenticated();
  const reduxIsAuthenticated = useSelector(selectIsAuthenticated);
  const decodedToken = useSelector(selectDecodedToken);
  const authHook = useAuth();

  // Additional audit data
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userData = localStorage.getItem('user');
  const currentTime = Date.now();
  
  let tokenExpirationInfo = null;
  if (decodedToken) {
    tokenExpirationInfo = {
      exp: decodedToken.exp,
      expTimestamp: decodedToken.exp * 1000,
      currentTime: currentTime,
      isExpired: decodedToken.exp * 1000 <= currentTime,
      timeUntilExpiry: decodedToken.exp * 1000 - currentTime,
      formattedExpiry: new Date(decodedToken.exp * 1000).toISOString()
    };
  }

  console.log('--- ProtectedRoute Auth Audit ---');
  console.log('1. API Service Check:');
  console.log('   apiService.isAuthenticated():', apiIsAuthenticated);
  console.log('2. Redux State:');
  console.log('   Redux isAuthenticated:', reduxIsAuthenticated);
  console.log('   Decoded Token:', decodedToken);
  console.log('3. useAuth Hook:');
  console.log('   useAuth result:', authHook);
  console.log('4. LocalStorage Values:');
  console.log('   access_token exists:', !!accessToken);
  console.log('   refresh_token exists:', !!refreshToken);
  console.log('   user data exists:', !!userData);
  console.log('5. Token Expiration Analysis:');
  console.log('   Token expiration info:', tokenExpirationInfo);
  console.log('6. Decision Point:');
  console.log('   Will redirect to login:', !apiIsAuthenticated);
  console.log('---------------------------------');

if (!apiIsAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
