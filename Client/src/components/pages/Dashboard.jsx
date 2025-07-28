import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
          joinedDate: '2024-01-15'
        },
        stats: {
          totalBookClubs: 4,
          ownedBookClubs: 1,
          booksRead: 12,
          currentlyReading: 3
        },
        recentActivity: [
          {
            id: 1,
            type: 'discussion',
            title: 'New discussion in Modern Fiction Book Club',
            description: 'Alice Johnson started a discussion about Chapter 5',
            clubName: 'Modern Fiction Book Club',
            timestamp: '2024-07-22T10:30:00Z',
            clubId: 1
          },
          {
            id: 2,
            type: 'book_added',
            title: 'New book added to reading list',
            description: 'Gone Girl by Gillian Flynn was added to Mystery & Thriller Enthusiasts',
            clubName: 'Mystery & Thriller Enthusiasts',
            timestamp: '2024-07-21T15:45:00Z',
            clubId: 2
          },
          {
            id: 3,
            type: 'meeting',
            title: 'Upcoming meeting reminder',
            description: 'Book club meeting scheduled for tomorrow at 7:00 PM',
            clubName: 'Classic Literature Society',
            timestamp: '2024-07-20T12:15:00Z',
            clubId: 3
          },
          {
            id: 4,
            type: 'member_joined',
            title: 'New member joined',
            description: 'Sarah Wilson joined your book club',
            clubName: 'Modern Fiction Book Club',
            timestamp: '2024-07-19T09:20:00Z',
            clubId: 1
          }
        ],
        upcomingMeetings: [
          {
            id: 1,
            clubName: 'Modern Fiction Book Club',
            clubId: 1,
            date: '2024-07-28T19:00:00Z',
            location: 'Downtown Library',
            topic: 'Discussion of The Seven Husbands of Evelyn Hugo'
          },
          {
            id: 2,
            clubName: 'Mystery & Thriller Enthusiasts',
            clubId: 2,
            date: '2024-07-30T18:30:00Z',
            location: 'Online (Zoom)',
            topic: 'Gone Girl - Chapters 1-10'
          }
        ],
        currentBooks: [
          {
            id: 1,
            title: 'The Seven Husbands of Evelyn Hugo',
            author: 'Taylor Jenkins Reid',
            clubName: 'Modern Fiction Book Club',
            clubId: 1,
            progress: 65,
            dueDate: '2024-07-31'
          },
          {
            id: 2,
            title: 'Gone Girl',
            author: 'Gillian Flynn',
            clubName: 'Mystery & Thriller Enthusiasts',
            clubId: 2,
            progress: 30,
            dueDate: '2024-08-15'
          },
          {
            id: 3,
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            clubName: 'Classic Literature Society',
            clubId: 3,
            progress: 80,
            dueDate: '2024-08-05'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'discussion':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'book_added':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'meeting':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-3-5h3m-6 10v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
          </svg>
        );
      case 'member_joined':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            {dashboardData.user.avatar ? (
              <img
                src={dashboardData.user.avatar}
                alt={dashboardData.user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium text-lg">
                {getInitials(dashboardData.user.name)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {dashboardData.user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your book clubs</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Book Clubs</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalBookClubs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clubs Owned</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.ownedBookClubs}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books Read</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.booksRead}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Reading</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.currentlyReading}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Books */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Currently Reading</h2>
                <Link to="/bookclubs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.currentBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/bookclubs/${book.clubId}/books`}
                    className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                        <p className="text-xs text-blue-600 mt-1">{book.clubName}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>{book.progress}% complete</span>
                            <span>Due {formatDate(book.dueDate)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings & Recent Activity */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Meetings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.upcomingMeetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/bookclubs/${meeting.clubId}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition duration-200"
                  >
                    <h3 className="font-medium text-gray-900 text-sm">{meeting.clubName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{meeting.topic}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-3-5h3m-6 10v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
                      </svg>
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{meeting.location}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <Link
                    key={activity.id}
                    to={`/bookclubs/${activity.clubId}`}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span>{activity.clubName}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/bookclubs/create"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create Book Club</h3>
              <p className="text-sm text-gray-500">Start a new reading community</p>
            </div>
          </Link>

          <Link
            to="/bookclubs"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Discover Clubs</h3>
              <p className="text-sm text-gray-500">Find new book clubs to join</p>
            </div>
          </Link>

          <Link
            to="/bookclubs/my-clubs"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">My Book Clubs</h3>
              <p className="text-sm text-gray-500">Manage your clubs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
