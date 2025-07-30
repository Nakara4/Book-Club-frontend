import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookClubAPI } from '../../services/api';

const BookClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookClub, setBookClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookClubDetails();
  }, [id]);

  const fetchBookClubDetails = async () => {
    try {
      setLoading(true);
      const response = await bookClubAPI.getBookClub(id);
      setBookClub(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch book club details. Please try again.');
      console.error('Error fetching book club:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    try {
      setActionLoading(true);
      await bookClubAPI.joinBookClub(id);
      await fetchBookClubDetails(); // Refresh the data
    } catch (err) {
      console.error('Error joining book club:', err);
      alert('Failed to join book club. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (window.confirm('Are you sure you want to leave this book club?')) {
      try {
        setActionLoading(true);
        await bookClubAPI.leaveBookClub(id);
        await fetchBookClubDetails(); // Refresh the data
      } catch (err) {
        console.error('Error leaving book club:', err);
        alert(`Failed to leave book club: ${err.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteClub = async () => {
    const confirmMessage = `Are you sure you want to delete "${bookClub.name}"?\n\nThis will permanently delete:\n• The book club and all its data\n• All discussions and posts\n• All member relationships\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setActionLoading(true);
        await bookClubAPI.deleteBookClub(id);
        
        // Show success message
        alert(`"${bookClub.name}" has been successfully deleted.`);
        
        // Navigate back to book clubs list
        navigate('/bookclubs');
      } catch (err) {
        console.error('Error deleting book club:', err);
        alert(`Failed to delete book club: ${err.message}`);
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          to="/bookclubs"
          className="mt-4 inline-block text-blue-500 hover:text-blue-600 underline"
        >
          Back to Book Clubs
        </Link>
      </div>
    );
  }

  if (!bookClub) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Book club not found.</p>
          <Link
            to="/bookclubs"
            className="mt-4 inline-block text-blue-500 hover:text-blue-600 underline"
          >
            Back to Book Clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <Link
          to="/bookclubs"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back to Book Clubs
        </Link>
        
        {bookClub.is_creator && (
          <div className="flex space-x-2">
            <Link
              to={`/bookclubs/${id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteClub}
              disabled={actionLoading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Book Club Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {bookClub.image && (
              <img
                src={bookClub.image}
                alt={bookClub.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {bookClub.name}
                  </h1>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {bookClub.category}
                  </span>
                </div>
                {bookClub.is_private && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Private
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {bookClub.description}
              </p>

              {/* Book Club Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {bookClub.member_count}
                  </div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bookClub.meeting_frequency}
                  </div>
                  <div className="text-sm text-gray-500">Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {bookClub.books_read_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Books Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Date(bookClub.created_at).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-500">Founded</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {!bookClub.is_member && !bookClub.is_creator && (
                  <button
                    onClick={handleJoinClub}
                    disabled={actionLoading}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Joining...' : 'Join Book Club'}
                  </button>
                )}
                
                {bookClub.is_member && !bookClub.is_creator && (
                  <button
                    onClick={handleLeaveClub}
                    disabled={actionLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Leaving...' : 'Leave Book Club'}
                  </button>
                )}

                {bookClub.is_creator && (
                  <span className="bg-blue-100 text-blue-800 px-6 py-2 rounded-lg font-medium">
                    You created this club
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Book Club Details
            </h2>
            
            <div className="space-y-4">
              {bookClub.location && (
                <div>
                  <h3 className="font-medium text-gray-700">Location</h3>
                  <p className="text-gray-600">{bookClub.location}</p>
                </div>
              )}

              {bookClub.reading_schedule && (
                <div>
                  <h3 className="font-medium text-gray-700">Reading Schedule</h3>
                  <p className="text-gray-600">{bookClub.reading_schedule}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-700">Meeting Frequency</h3>
                <p className="text-gray-600 capitalize">{bookClub.meeting_frequency}</p>
              </div>

              {bookClub.max_members && (
                <div>
                  <h3 className="font-medium text-gray-700">Maximum Members</h3>
                  <p className="text-gray-600">{bookClub.max_members}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-700">Created</h3>
                <p className="text-gray-600">
                  {new Date(bookClub.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Creator Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Created by
            </h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {bookClub.creator_name ? bookClub.creator_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {bookClub.creator_name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">Club Creator</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {(bookClub.is_member || bookClub.is_creator) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to={`/bookclubs/${id}/discussions`}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition duration-300"
                >
                  View Discussions
                </Link>
                <Link
                  to={`/bookclubs/${id}/books`}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition duration-300"
                >
                  Reading List
                </Link>
                <Link
                  to={`/bookclubs/${id}/members`}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition duration-300"
                >
                  View Members
                </Link>
                {bookClub.is_creator && (
                  <Link
                    to={`/bookclubs/${id}/invite`}
                    className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition duration-300"
                  >
                    Invite Members
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookClubDetail;
