import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../services/adminApi';
import {
  selectIsAuthenticated,
  selectIsAdmin
} from '../features/auth/authSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  
  const {
    data: adminStats,
    error,
    isLoading,
    refetch
  } = useGetAdminStatsQuery(undefined, {
    skip: !isAuthenticated || !isAdmin
  });

  // Mock data for development/testing when API is not available
  const mockData = {
    booksData: [
      { book_club_id: 1, name: 'Modern Fiction Book Club', book_count: 12 },
      { book_club_id: 2, name: 'Mystery & Thriller Enthusiasts', book_count: 8 },
      { book_club_id: 3, name: 'Classic Literature Society', book_count: 15 },
      { book_club_id: 4, name: 'Science Fiction Explorers', book_count: 6 },
      { book_club_id: 5, name: 'Young Adult Adventures', book_count: 10 }
    ],
    summariesData: [
      { book_id: 1, book_title: 'To Kill a Mockingbird', review_count: 25 },
      { book_id: 2, book_title: '1984', review_count: 18 },
      { book_id: 3, book_title: 'Pride and Prejudice', review_count: 22 },
      { book_id: 4, book_title: 'The Great Gatsby', review_count: 16 },
      { book_id: 5, book_title: 'Dune', review_count: 14 }
    ],
    activeClubsCount: 5
  };

  // Use mock data if there's an error or no data
  const displayData = adminStats || (error ? mockData : null);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-lg">Loading analytics data...</span>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  // Access control checks
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong className="font-bold">Authentication Required: </strong>
          <span className="block sm:inline">Please log in to view this page.</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Access Denied: </strong>
          <span className="block sm:inline">Access restricted to admin users only.</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Use mock data if there's an error or for development
  const effectiveData = adminStats || mockData;
  const { booksData, summariesData, activeClubsCount } = effectiveData;

  const bookClubData = booksData?.map(club => ({
    clubName: club.name || club.book_club_name,
    bookCount: club.book_count,
  })) || [];

  // Show error but continue with mock data
  const showError = error && !adminStats;

  const summariesDataTable = summariesData?.map(summary => (
    <tr key={summary.book_title}>
      <td className="border px-4 py-2">{summary.book_title}</td>
      <td className="border px-4 py-2">{summary.review_count}</td>
    </tr>
  )) || [];

  const barChartData = {
    labels: bookClubData.map(club => club.clubName),
    datasets: [
      {
        label: 'Books Read per Club',
        data: bookClubData.map(club => club.bookCount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Show error notification if API failed but continue with mock data */}
      {showError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">API Warning: </strong>
          <span className="block sm:inline">
            {error.data?.detail || 'API not available'}. Showing mock data for demonstration.
          </span>
          <button 
            onClick={() => refetch()}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Retry API
          </button>
        </div>
      )}
      
      {/* Show data source indicator */}
      {!adminStats && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Demo Mode: </strong>
          <span className="block sm:inline">Displaying mock analytics data for testing purposes.</span>
        </div>
      )}

      {/* Books per Club Table */}
      <h2 className="text-xl font-semibold mb-2">Books per Club</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Club Name</th>
            <th className="border px-4 py-2">Book Count</th>
          </tr>
        </thead>
        <tbody>
          {bookClubData.map(club => (
            <tr key={club.clubName}>
              <td className="border px-4 py-2">{club.clubName}</td>
              <td className="border px-4 py-2">{club.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summaries per Book Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Summaries per Book</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Book Title</th>
            <th className="border px-4 py-2">Review Count</th>
          </tr>
        </thead>
        <tbody>
          {summariesDataTable}
        </tbody>
      </table>

      {/* Active Book Clubs */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Active Book Clubs: {activeClubsCount}</h2>

      {/* Books Read per Club Chart */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Books Read per Club</h2>
      <Bar data={barChartData} options={{ responsive: true }} />
    </div>
  );
};

export default AdminDashboard;

