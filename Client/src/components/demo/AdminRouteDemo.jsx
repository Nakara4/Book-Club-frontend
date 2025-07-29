import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectIsStaff } from '../../features/auth/authSlice';

/**
 * AdminRouteDemo - A component to demonstrate and test AdminRoute functionality
 * This component will be wrapped with AdminRoute to show how access control works
 */
const AdminRouteDemo = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isStaff = useSelector(selectIsStaff);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 AdminRoute Success!
        </h1>
        <p className="text-gray-600">
          If you can see this page, it means the AdminRoute component is working correctly 
          and you have admin privileges.
        </p>
      </div>

      {/* User Information */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current User Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Authentication Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="font-medium text-gray-700">Authentication</h3>
            </div>
            <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>

          {/* Admin Status */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${isStaff ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="font-medium text-gray-700">Admin Status</h3>
            </div>
            <p className={`text-sm ${isStaff ? 'text-green-600' : 'text-red-600'}`}>
              {isStaff ? 'Admin User' : 'Regular User'}
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <h3 className="font-medium text-gray-700">User Info</h3>
            </div>
            <p className="text-sm text-gray-600">
              {user ? user.username || user.email || 'Unknown' : 'No user data'}
            </p>
          </div>
        </div>
      </div>

      {/* AdminRoute Features Demo */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AdminRoute Features</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Authentication Check</h3>
              <p className="text-sm text-gray-600">
                Automatically redirects unauthenticated users to login page with return URL
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Admin Privilege Verification</h3>
              <p className="text-sm text-gray-600">
                Checks if the authenticated user has admin/staff privileges
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">403 Access Denied UI</h3>
              <p className="text-sm text-gray-600">
                Shows a user-friendly access denied message with navigation options
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Flexible Configuration</h3>
              <p className="text-sm text-gray-600">
                Supports custom redirect paths and access denied behavior
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Basic Usage</h3>
            <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
{`<AdminRoute>
  <AdminPanel />
</AdminRoute>`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">With Custom Redirect</h3>
            <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
{`<AdminRoute redirectTo="/dashboard">
  <AdminSettings />
</AdminRoute>`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">HOC Usage</h3>
            <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
{`const ProtectedAdminComponent = withAdminAuth(MyAdminComponent);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRouteDemo;
