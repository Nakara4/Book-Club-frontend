import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import AdminDashboard from '../components/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';
import AuthRedirect from '../components/common/AuthRedirect';
import Forbidden from '../components/pages/Forbidden';
import BookClubLayout from '../components/bookclubs/BookClubLayout';
import { BookClubList, CreateBookClub, BookClubDetail } from '../components/bookclubs';
import apiService from '../services/api';

// Lazy load future components
const BookClubEdit = React.lazy(() => 
  import('../components/bookclubs/BookClubEdit').catch(() => 
    ({ default: () => <div className="p-8 text-center">Book Club Edit (Coming Soon)</div> })
  )
);

// Admin components - lazy loaded
const AdminAnalytics = React.lazy(() => 
  Promise.resolve({ default: () => <div className="p-8 text-center">Admin Analytics (Coming Soon)</div> })
);

const AdminBooks = React.lazy(() => 
  Promise.resolve({ default: () => <div className="p-8 text-center">Admin Books Management (Coming Soon)</div> })
);

const AdminUsers = React.lazy(() => 
  Promise.resolve({ default: () => <div className="p-8 text-center">Admin Users Management (Coming Soon)</div> })
);

const AdminSettings = React.lazy(() => 
  Promise.resolve({ default: () => <div className="p-8 text-center">Admin Settings (Coming Soon)</div> })
);

const BookClubMembers = React.lazy(() => 
  import('../components/bookclubs/BookClubMembers').catch(() => 
    ({ default: () => <div className="p-8 text-center">Book Club Members (Coming Soon)</div> })
  )
);

const BookClubDiscussions = React.lazy(() => 
  import('../components/bookclubs/BookClubDiscussions').catch(() => 
    ({ default: () => <div className="p-8 text-center">Book Club Discussions (Coming Soon)</div> })
  )
);

const BookClubBooks = React.lazy(() => 
  import('../components/bookclubs/BookClubBooks').catch(() => 
    ({ default: () => <div className="p-8 text-center">Reading List (Coming Soon)</div> })
  )
);

const BookClubInvite = React.lazy(() => 
  import('../components/bookclubs/BookClubInvite').catch(() => 
    ({ default: () => <div className="p-8 text-center">Invite Members (Coming Soon)</div> })
  )
);

const MyBookClubs = React.lazy(() => 
  import('../components/bookclubs/MyBookClubs').catch(() => 
    ({ default: () => <div className="p-8 text-center">My Book Clubs (Coming Soon)</div> })
  )
);

const Dashboard = React.lazy(() => 
  import('../components/pages/Dashboard').catch(() => 
    ({ default: () => <div className="p-8 text-center">Dashboard (Coming Soon)</div> })
  )
);

const Profile = React.lazy(() => 
  import('../components/pages/Profile').catch(() => 
    ({ default: () => <div className="p-8 text-center">Profile (Coming Soon)</div> })
  )
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// 404 Not Found component
const NotFound = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
    <Navigate to="/" replace />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={
          <AuthRedirect>
            <Signup />
          </AuthRedirect>
        } />
        <Route path="/login" element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        } />

        {/* Protected dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected profile route */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* 403 Forbidden route */}
        <Route path="/403" element={<Forbidden />} />

        {/* Admin routes - all protected with AdminProtectedRoute */}
        <Route path="/admin" element={<AdminProtectedRoute><Navigate to="/admin/dashboard" replace /></AdminProtectedRoute>} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/analytics" 
          element={
            <AdminProtectedRoute>
              <AdminAnalytics />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/users" 
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/settings" 
          element={
            <AdminProtectedRoute>
              <AdminSettings />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Admin books routes with wildcard matching */}
        <Route 
          path="/admin/books" 
          element={
            <AdminProtectedRoute>
              <AdminBooks />
            </AdminProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/books/*" 
          element={
            <AdminProtectedRoute>
              <AdminBooks />
            </AdminProtectedRoute>
          } 
        />

        {/* Book club routes - all protected and nested under BookClubLayout */}
        <Route 
          path="/bookclubs" 
          element={
            <ProtectedRoute>
              <BookClubLayout />
            </ProtectedRoute>
          }
        >
          {/* Main book club routes */}
          <Route index element={<BookClubList />} />
          <Route path="create" element={<CreateBookClub />} />
          <Route path="my-clubs" element={<MyBookClubs />} />
          <Route path="search" element={<BookClubList />} />
          <Route path="discover" element={<BookClubList />} />
          
          {/* Individual book club routes - nested under their own parent route */}
          <Route path=":id">
            <Route index element={<BookClubDetail />} />
            <Route path="edit" element={<BookClubEdit />} />
            <Route path="members" element={<BookClubMembers />} />
            <Route path="discussions" element={<BookClubDiscussions />} />
            <Route path="books" element={<BookClubBooks />} />
            <Route path="invite" element={<BookClubInvite />} />
          </Route>
        </Route>

        {/* Redirect old routes to new structure */}
        <Route path="/club/:id" element={<Navigate to="/bookclubs/:id" replace />} />
        <Route path="/clubs" element={<Navigate to="/bookclubs" replace />} />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
