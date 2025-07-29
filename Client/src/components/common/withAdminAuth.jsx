import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsStaff } from '../../features/auth/authSlice';

/**
 * withAdminAuth Higher-Order Component (HOC)
 * 
 * A HOC that wraps components to ensure only authenticated admin users can access them.
 * This is an alternative to the AdminRoute component that can be used to create 
 * admin-protected component versions.
 * 
 * @param {React.Component} WrappedComponent - The component to protect
 * @param {Object} [options] - Configuration options
 * @param {string} [options.redirectTo] - Optional redirect path for non-admin users
 * @param {boolean} [options.showAccessDenied=true] - Whether to show access denied or redirect
 * 
 * @returns {React.Component} - The protected component
 * 
 * @example
 * // Usage as HOC
 * const ProtectedComponent = withAdminAuth(MyAdminComponent);
 * 
 * // Usage with options
 * const ProtectedComponent = withAdminAuth(MyAdminComponent, {
 *   redirectTo: "/dashboard",
 *   showAccessDenied: false
 * });
 * 
 * // Usage as decorator (if using decorators)
 * @withAdminAuth
 * class MyAdminComponent extends React.Component { ... }
 */
const withAdminAuth = (WrappedComponent, options = {}) => {
  const { 
    redirectTo = null, 
    showAccessDenied = true 
  } = options;

  const AdminProtectedComponent = (props) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isStaff = useSelector(selectIsStaff);

    // First check: User must be authenticated
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Second check: User must have admin privileges
    if (!isStaff) {
      // If redirectTo is specified, redirect there
      if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
      }

      // Otherwise, show access denied message (default behavior)
      if (showAccessDenied) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                {/* 403 Icon */}
                <div className="mx-auto h-24 w-24 text-red-500 mb-4">
                  <svg 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                
                {/* Error Message */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-red-800 mb-2">
                    Access Denied
                  </h2>
                  <p className="text-red-600 mb-4">
                    You do not have administrative privileges to access this page.
                  </p>
                  <p className="text-sm text-red-500">
                    If you believe this is an error, please contact your system administrator.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg 
                      className="mr-2 h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                      />
                    </svg>
                    Go Back
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg 
                      className="mr-2 h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                      />
                    </svg>
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // If showAccessDenied is false and no redirectTo, just return null
      return null;
    }

    // User is authenticated and has admin privileges - render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AdminProtectedComponent.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminProtectedComponent;
};

export default withAdminAuth;
