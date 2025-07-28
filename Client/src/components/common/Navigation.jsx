import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectIsAuthenticated, selectCurrentUser, selectIsStaff, logoutUser } from '../../features/auth/authSlice';
import { useTheme } from '../../contexts/EnhancedThemeContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import ROUTES from '../../routes/routeConstants';
import apiService from '../../services/api';

const Navigation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  // Use Redux selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isStaff = useSelector(selectIsStaff);
  
  // Fallback to apiService if Redux state is not initialized
  const fallbackAuth = apiService.isAuthenticated();
  const fallbackUser = apiService.getCurrentUser();
  
  const actualAuth = isAuthenticated || fallbackAuth;
  const actualUser = currentUser || fallbackUser;
  const actualIsStaff = isStaff || fallbackUser?.is_staff;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      dispatch(logoutUser());
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.DASHBOARD, label: 'Dashboard', authRequired: true },
    { path: ROUTES.BOOK_CLUBS, label: 'Book Clubs', authRequired: true },
    { path: ROUTES.BOOK_CLUBS_MY_CLUBS, label: 'My Clubs', authRequired: true },
    { path: ROUTES.ADMIN_DASHBOARD, label: 'Admin Dashboard', authRequired: true, staffRequired: true },
  ];

  return (
    <nav className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-custom border-b border-neutral-100 dark:border-neutral-800 sticky top-0 z-50">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-900 hover:text-primary-700 transition-colors">
            BookClub
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
            {navItems.map((item) => {
              if (item.authRequired && !actualAuth) return null;
              if (item.staffRequired && !actualIsStaff) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition duration-300 ${
                    location.pathname === item.path
                      ? 'font-semibold text-primary-600 dark:text-primary-400'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <ThemeToggle className="md:ml-4" />

            {/* Auth Links */}
            {!actualAuth ? (
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition duration-300 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(actualUser?.first_name || actualUser?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">
                    {actualUser?.first_name || actualUser?.username}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {actualUser?.first_name} {actualUser?.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {actualUser?.email}
                        </p>
                      </div>
                      
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </div>
                      </Link>
                      
                      <Link
                        to={ROUTES.DASHBOARD}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
