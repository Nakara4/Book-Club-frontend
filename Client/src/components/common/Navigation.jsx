import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import apiService from '../../services/api';
import ROUTES from '../../routes/routeConstants';

const Navigation = () => {
  const location = useLocation();
  const isAuthenticated = apiService.isAuthenticated();
  const currentUser = apiService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.DASHBOARD, label: 'Dashboard', authRequired: true },
    { path: ROUTES.BOOK_CLUBS, label: 'Book Clubs', authRequired: true },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BookClub
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-700 hover:text-blue-600 transition duration-300 ${
                    location.pathname === item.path
                      ? 'font-semibold text-blue-600'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Auth Links */}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {currentUser?.first_name || currentUser?.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
