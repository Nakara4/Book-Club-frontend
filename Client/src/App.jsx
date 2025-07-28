import React from 'react';
import Navigation from './components/common/Navigation';
import Breadcrumb from './components/common/Breadcrumb';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Breadcrumb />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
