import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  // Check system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('bookclub-theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? systemPreference : theme;
    
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    document.documentElement.classList.add(effectiveTheme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme, systemPreference]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('bookclub-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  const value = {
    theme,
    systemPreference,
    effectiveTheme: theme === 'system' ? systemPreference : theme,
    changeTheme,
    toggleTheme,
    isDark: (theme === 'system' ? systemPreference : theme) === 'dark',
    isLight: (theme === 'system' ? systemPreference : theme) === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
