import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import FollowButton from '../common/FollowButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import UserAvatar from '../common/UserAvatar';
import { getUserDisplayName, getUserSecondaryIdentifier } from '../../utils/userUtils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(`${apiService.baseURL}/users/?${params.toString()}`, {
        method: 'GET',
        headers: apiService.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.results || data);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    await fetchUsers(searchTerm);
  };

  const handleFollowChange = (userId, isFollowing) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              is_following: isFollowing,
              followers_count: isFollowing 
                ? user.followers_count + 1 
                : user.followers_count - 1
            }
          : user
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" color="primary" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          Discover Users
        </h1>
        <p className="text-gray-600">Find and follow other book club members</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search users by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {searchLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span>Search</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Users Grid */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition duration-300">
              {/* User Avatar */}
              <div className="flex items-center mb-4">
                <UserAvatar 
                  user={user} 
                  size="lg" 
                  colorVariant="consistent"
                  className="flex-shrink-0"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {getUserDisplayName(user)}
                  </h3>
                  <p className="text-gray-500 text-sm">{getUserSecondaryIdentifier(user)}</p>
                </div>
              </div>

              {/* User Stats */}
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <div className="text-center">
                  <div className="font-semibold text-primary-600">{user.followers_count || 0}</div>
                  <div>Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-secondary-600">{user.following_count || 0}</div>
                  <div>Following</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {new Date(user.date_joined).getFullYear()}
                  </div>
                  <div>Joined</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Link
                  to={`/users/${user.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Profile
                </Link>
                <FollowButton 
                  user={user} 
                  onFollowChange={handleFollowChange}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No users found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Users;
