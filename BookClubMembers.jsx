import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserCard from '../ui/UserCard';

const BookClubMembers = () => {
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMembers([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'Admin',
          joinDate: '2024-01-15',
          avatar: null,
          isActive: true
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'Member',
          joinDate: '2024-02-10',
          avatar: null,
          isActive: true
        },
        {
          id: 3,
          name: 'Carol Davis',
          email: 'carol@example.com',
          role: 'Moderator',
          joinDate: '2024-01-20',
          avatar: null,
          isActive: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Handle follow status changes
  const handleFollowChange = useCallback((isFollowing, targetUserId) => {
    console.log(`User ${targetUserId} ${isFollowing ? 'followed' : 'unfollowed'}`);
    // You can add any additional logic here, like updating local state or showing notifications
  }, []);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Book Club Members</h1>
              <p className="text-gray-600 mt-2">{members.length} members</p>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="List view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
              <Link
                to={`/bookclubs/${id}/invite`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 whitespace-nowrap"
              >
                Invite Members
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {members.map((member) => (
                <UserCard
                  key={member.id}
                  user={member}
                  showFollowButton={true}
                  showRole={true}
                  showStatus={true}
                  showEmail={true}
                  showJoinDate={true}
                  size="md"
                  layout="horizontal"
                  linkToProfile={true}
                  onFollowChange={handleFollowChange}
                  className="w-full"
                />
              ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((member) => (
                <UserCard
                  key={member.id}
                  user={member}
                  showFollowButton={true}
                  showRole={true}
                  showStatus={true}
                  showEmail={false}
                  showJoinDate={false}
                  size="sm"
                  layout="vertical"
                  linkToProfile={true}
                  onFollowChange={handleFollowChange}
                  className="h-full"
                />
              ))}
            </div>
          )}

          {members.length === 0 && (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by inviting members to your book club.
              </p>
              <div className="mt-6">
                <Link
                  to={`/bookclubs/${id}/invite`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Invite Members
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookClubMembers;