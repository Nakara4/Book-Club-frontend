import React from 'react'; 
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store'; 
import App from './App';
import { I18nProvider } from './contexts/i18nContext';
import ToastContainer from './components/ui/ToastContainer';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <Provider store={store}>
      <I18nProvider>
        <BrowserRouter>
          <ToastContainer />
          <App />
        </BrowserRouter>
      </I18nProvider>
    </Provider>
  </React.StrictMode>
);
