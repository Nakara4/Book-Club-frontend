import React from 'react';
import Navigation from './components/common/Navigation';
import Breadcrumb from './components/common/Breadcrumb';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Breadcrumb />
      <main>
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
