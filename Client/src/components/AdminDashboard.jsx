import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import {
  fetchAllAnalytics,
  selectBooksData,
  selectSummariesData,
  selectActiveClubsCount,
  selectIsLoading,
  selectAnalyticsError,
} from '../features/analytics/analyticsSlice';
import {
  selectIsAuthenticated,
  selectIsStaff
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
  const [tab, setTab] = React.useState('bookClubs');
  const clubSummary = useSelector(state => state.analytics.activeClubsCount);
  const userSummary = 100;  // Placeholder for user summary data

  const tabs = [
    { name: 'Book Clubs', id: 'bookClubs' },
    { name: 'Users', id: 'users' },
    { name: 'Future Resources', id: 'futureResources' }
  ];
  const dispatch = useAppDispatch();
  const booksData = useSelector(selectBooksData);
  const summariesData = useSelector(selectSummariesData);
  const activeClubsCount = useSelector(selectActiveClubsCount);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAnalyticsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isStaff = useSelector(selectIsStaff);

  useEffect(() => {
    if (isAuthenticated && isStaff) {
      dispatch(fetchAllAnalytics());
    }
  }, [dispatch, isAuthenticated, isStaff]);

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

  // Access control is now handled by AdminRoute wrapper

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error.general || error.books || error.summaries || error.activeClubs) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error.general || error.books || error.summaries || error.activeClubs} />
        <button 
          onClick={() => dispatch(fetchAllAnalytics())}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const bookClubData = booksData.map(club => ({
    clubName: club.name,
    bookCount: club.book_count,
  }));

  const summariesDataTable = summariesData.map(summary => (
    <tr key={summary.book_title}>
      <td className="border px-4 py-2">{summary.book_title}</td>
      <td className="border px-4 py-2">{summary.review_count}</td>
    </tr>
  ));

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
      <div className="tabs mb-4">
        {tabs.map(tabItem => (
          <button
            key={tabItem.id}
            className={`tab-link ${tabItem.id === tab ? 'active' : ''}`}
            onClick={() => setTab(tabItem.id)}
          >
            {tabItem.name}
          </button>
        ))}
      </div>

      {tab === 'bookClubs' && (
        <div className="tab-content">
          <h2 className="text-xl font-semibold mb-2">Book Clubs Summary: {clubSummary}</h2>
          {/* Book Clubs content here */}
        </div>
      )}

      {tab === 'users' && (
        <div className="tab-content">
          <h2 className="text-xl font-semibold mb-2">Users Summary: {userSummary}</h2>
          {/* Users content here */}
        </div>
      )}

      {tab === 'futureResources' && (
        <div className="tab-content">
          <h2 className="text-xl font-semibold mb-2">Future Resources</h2>
          {/* Future resources content here */}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

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

