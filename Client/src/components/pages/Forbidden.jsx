import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Forbidden (403) page component
 * Displayed when a user is authenticated but lacks the required permissions to access a resource
 */
const Forbidden = () => {
  const location = useLocation();
  const fromPath = location.state?.from?.pathname;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Forbidden</h2>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this resource.
            {fromPath && (
              <span className="block mt-2 text-sm text-gray-500">
                Attempted to access: {fromPath}
              </span>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go to Dashboard
          </Link>
          
          <div className="text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            If you believe you should have access to this resource, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
