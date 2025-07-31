import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyBookClubs = () => {
  const [bookClubs, setBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, owned, member

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookClubs([
        {
          id: 1,
          name: 'Modern Fiction Book Club',
          description: 'Exploring contemporary literary fiction from around the world.',
          category: 'fiction',
          memberCount: 15,
          currentBook: 'The Seven Husbands of Evelyn Hugo',
          currentAuthor: 'Taylor Jenkins Reid',
          role: 'admin',
          isPrivate: false,
          lastActivity: '2024-07-22T10:30:00Z',
          nextMeeting: '2024-07-28T19:00:00Z',
          meetingLocation: 'Downtown Library',
          avatar: null,
          status: 'active',
          joinedDate: '2024-01-15'
        },
        {
          id: 2,
          name: 'Mystery & Thriller Enthusiasts',
          description: 'Dive deep into the world of mysteries, thrillers, and crime novels.',
          category: 'mystery',
          memberCount: 22,
          currentBook: 'Gone Girl',
          currentAuthor: 'Gillian Flynn',
          role: 'member',
          isPrivate: false,
          lastActivity: '2024-07-21T15:45:00Z',
          nextMeeting: '2024-07-30T18:30:00Z',
          meetingLocation: 'Online (Zoom)',
          avatar: null,
          status: 'active',
          joinedDate: '2024-03-10'
        },
        {
          id: 3,
          name: 'Classic Literature Society',
          description: 'Reading and discussing timeless classics from various eras.',
          category: 'classics',
          memberCount: 8,
          currentBook: 'Pride and Prejudice',
          currentAuthor: 'Jane Austen',
          role: 'moderator',
          isPrivate: true,
          lastActivity: '2024-07-20T12:15:00Z',
          nextMeeting: null,
          meetingLocation: null,
          avatar: null,
          status: 'active',
          joinedDate: '2024-02-05'
        },
        {
          id: 4,
          name: 'Sci-Fi Adventures',
          description: 'Exploring the frontiers of science fiction literature.',
          category: 'sci-fi',
          memberCount: 12,
          currentBook: 'Dune',
          currentAuthor: 'Frank Herbert',
          role: 'member',
          isPrivate: false,
          lastActivity: '2024-06-15T14:20:00Z',
          nextMeeting: null,
          meetingLocation: null,
          avatar: null,
          status: 'inactive',
          joinedDate: '2024-05-20'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBookClubs = bookClubs.filter(club => {
    if (filter === 'all') return true;
    if (filter === 'owned') return club.role === 'admin';
    if (filter === 'member') return club.role === 'member' || club.role === 'moderator';
    return true;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderator';
      case 'member':
        return 'Member';
      default:
        return 'Unknown';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'fiction':
        return 'bg-blue-100 text-blue-800';
      case 'mystery':
        return 'bg-purple-100 text-purple-800';
      case 'classics':
        return 'bg-amber-100 text-amber-800';
      case 'sci-fi':
        return 'bg-green-100 text-green-800';
      case 'romance':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Book Clubs</h1>
            <Link
              to="/bookclubs/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Create New Club
            </Link>
          </div>
          <p className="text-gray-600 mt-2">{filteredBookClubs.length} book clubs</p>
        </div>

        {/* Filter Tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Clubs ({bookClubs.length})
            </button>
            <button
              onClick={() => setFilter('owned')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'owned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Owned ({bookClubs.filter(club => club.role === 'admin').length})
            </button>
            <button
              onClick={() => setFilter('member')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'member'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Member ({bookClubs.filter(club => club.role === 'member' || club.role === 'moderator').length})
            </button>
          </div>
        </div>

        {/* Book Clubs List */}
        <div className="p-6">
          {filteredBookClubs.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No book clubs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? "You haven't joined any book clubs yet."
                  : filter === 'owned'
                  ? "You don't own any book clubs yet."
                  : "You're not a member of any book clubs yet."}
              </p>
              <div className="mt-6">
                <Link
                  to="/bookclubs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Book Club
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookClubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/bookclubs/${club.id}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      {club.avatar ? (
                        <img
                          src={club.avatar}
                          alt={club.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium text-sm">
                          {getInitials(club.name)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {club.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(club.category)}`}
                            >
                              {club.category}
                            </span>
                            {club.isPrivate && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Private
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(club.role)}`}
                        >
                          {getRoleLabel(club.role)}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {club.description}
                      </p>

                      {club.currentBook && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Currently reading:</span> {club.currentBook}
                          </p>
                          <p className="text-sm text-gray-500">by {club.currentAuthor}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{club.memberCount} members</span>
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              club.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                            title={club.status === 'active' ? 'Active' : 'Inactive'}
                          ></span>
                        </div>
                        <span>Last activity {formatLastActivity(club.lastActivity)}</span>
                      </div>

                      {club.nextMeeting && (
                        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Next meeting:</span> {formatDate(club.nextMeeting)}
                          </p>
                          {club.meetingLocation && (
                            <p className="text-xs text-blue-600 mt-1">
                              📍 {club.meetingLocation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookClubs;
