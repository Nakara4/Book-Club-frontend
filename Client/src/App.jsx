import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/EnhancedThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Breadcrumb from './components/common/Breadcrumb';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 dark:from-neutral-900 dark:to-primary-900 transition-colors duration-200">
            <Navigation />
            <main className="flex-1">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
