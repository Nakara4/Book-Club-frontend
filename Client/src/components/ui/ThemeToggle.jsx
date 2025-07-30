import React from 'react';
import { useTheme } from '../../contexts/EnhancedThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, changeTheme, isDark } = useTheme();

  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Simple toggle button */}
      <button
        onClick={() => changeTheme(isDark ? 'light' : 'dark')}
        className="relative inline-flex items-center p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg 
            className="w-5 h-5 text-amber-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg 
            className="w-5 h-5 text-neutral-600 dark:text-neutral-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" 
            />
          </svg>
        )}
      </button>

      {/* Dropdown for more options */}
      <select
        value={theme}
        onChange={handleThemeChange}
        className="text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default ThemeToggle;
