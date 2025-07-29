import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCurrentUser, 
  selectIsAuthenticated, 
  selectIsStaff, 
  isAdmin 
} from '../../features/auth/authSlice';

/**
 * Demo component showing how to use the authentication selectors
 * including the new isAdmin helper selector
 */
const AuthDemo = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isStaff = useSelector(selectIsStaff);
  const userIsAdmin = useSelector(isAdmin);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Demo</h2>
        <p className="text-gray-600">Please log in to see authentication state information.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication State Demo</h2>
      
      <div className="space-y-4">
        {/* User Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">User Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">ID:</span> {user?.id}</p>
            <p><span className="font-medium">Username:</span> {user?.username}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Full Name:</span> {user?.first_name} {user?.last_name}</p>
            <p><span className="font-medium">Joined:</span> {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">Authentication Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                Authenticated: {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isStaff ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                Staff Status (selectIsStaff): {isStaff ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${userIsAdmin ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                Admin Status (isAdmin): {userIsAdmin ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Permission-based UI Examples */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Permission-based UI Examples</h3>
          
          <div className="space-y-3">
            {/* Always visible for authenticated users */}
            <div className="bg-white border rounded p-3">
              <p className="text-sm font-medium text-gray-700">✅ Regular User Content</p>
              <p className="text-xs text-gray-500">This is visible to all authenticated users</p>
            </div>

            {/* Only visible for staff */}
            {isStaff && (
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <p className="text-sm font-medium text-orange-700">🔧 Staff Content</p>
                <p className="text-xs text-orange-600">This is only visible to staff members (using selectIsStaff)</p>
              </div>
            )}

            {/* Only visible for admins */}
            {userIsAdmin && (
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-sm font-medium text-purple-700">👑 Admin Content</p>
                <p className="text-xs text-purple-600">This is only visible to administrators (using isAdmin helper)</p>
              </div>
            )}

            {/* Conditional rendering example */}
            <div className="bg-white border rounded p-3">
              <p className="text-sm font-medium text-gray-700">🎯 Dynamic Content</p>
              <p className="text-xs text-gray-500">
                {userIsAdmin 
                  ? "You have full administrative access!" 
                  : isStaff 
                  ? "You have staff-level access." 
                  : "You have regular user access."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Examples</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-100 p-2 rounded font-mono">
              <p className="text-green-600">// Import selectors</p>
              <p>import &#123; isAdmin, selectIsStaff &#125; from '../features/auth/authSlice';</p>
            </div>
            <div className="bg-gray-100 p-2 rounded font-mono">
              <p className="text-green-600">// Use in component</p>
              <p>const userIsAdmin = useSelector(isAdmin);</p>
              <p>const isStaff = useSelector(selectIsStaff);</p>
            </div>
            <div className="bg-gray-100 p-2 rounded font-mono">
              <p className="text-green-600">// Conditional rendering</p>
              <p>&#123;userIsAdmin && &lt;AdminPanel /&gt;&#125;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDemo;
