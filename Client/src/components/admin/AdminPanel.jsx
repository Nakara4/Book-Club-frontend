import React from 'react';
import { useSelector } from 'react-redux';
import { isAdmin, selectCurrentUser } from '../../features/auth/authSlice';

const AdminPanel = () => {
  const user = useSelector(selectCurrentUser);
  const isUserAdmin = useSelector(isAdmin);

  // Access control is now handled by AdminRoute wrapper

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600 mt-1">
          Welcome, <span className="font-medium">{user?.first_name || user?.username}</span>! 
          You have administrative access to the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="bg-blue-500 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-800">User Management</h3>
          </div>
          <p className="text-blue-600 text-sm mb-3">Manage user accounts and permissions</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Manage Users
          </button>
        </div>

        {/* Book Club Management */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="bg-green-500 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Book Club Management</h3>
          </div>
          <p className="text-green-600 text-sm mb-3">Oversee all book clubs and moderate content</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Manage Clubs
          </button>
        </div>

        {/* System Settings */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="bg-purple-500 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-800">System Settings</h3>
          </div>
          <p className="text-purple-600 text-sm mb-3">Configure system-wide settings and preferences</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Settings
          </button>
        </div>
      </div>

      {/* Admin Statistics */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Active Book Clubs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">456</div>
            <div className="text-sm text-gray-600">Books Read</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Pending Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
