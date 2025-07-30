import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AdminProtectedRoute from './AdminProtectedRoute';

// Mock auth slice
const mockAuthSlice = {
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    isAdmin: false,
  },
  reducers: {},
};

const createMockStore = (authState) => {
  return configureStore({
    reducer: {
      auth: (state = authState, action) => state,
    },
  });
};

// Mock components
const TestComponent = () => <div>Admin Content</div>;

describe('AdminProtectedRoute Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated users to login', () => {
    const store = createMockStore({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminProtectedRoute>
            <TestComponent />
          </AdminProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Should not show admin content for unauthenticated user
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should redirect authenticated non-admin users to 403', () => {
    const store = createMockStore({
      isAuthenticated: true,
      user: { id: 1, email: 'user@test.com', is_staff: false },
      isAdmin: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminProtectedRoute>
            <TestComponent />
          </AdminProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Should not show admin content for non-admin user
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should allow authenticated admin users to access admin content', () => {
    const store = createMockStore({
      isAuthenticated: true,
      user: { id: 1, email: 'admin@test.com', is_staff: true },
      isAdmin: true,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminProtectedRoute>
            <TestComponent />
          </AdminProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Should show admin content for admin user
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should handle custom redirect routes', () => {
    const store = createMockStore({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin/analytics']}>
          <AdminProtectedRoute redirectTo="/custom-login" adminRedirectTo="/custom-403">
            <TestComponent />
          </AdminProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Should not show admin content
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
