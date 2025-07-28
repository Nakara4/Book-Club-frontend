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
    <nav className="bg-white shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 space-y-4 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
            BookClub
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-700 hover:text-primary-600 font-medium transition duration-300 ${
                    location.pathname === item.path
                      ? 'font-semibold text-primary-600'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Auth Links */}
            {!isAuthenticated ? (
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition duration-300 w-full md:w-auto text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-soft hover:shadow-md transition duration-300 w-full md:w-auto text-center"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <span className="text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-lg text-sm md:text-base text-center">
                  Welcome, {currentUser?.first_name || currentUser?.username}! 👋
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 font-medium transition duration-300 flex items-center space-x-1"
                >
                  <span>Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
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
