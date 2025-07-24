import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookClubAPI } from '../../services/api';

const BookClubList = () => {
  const [bookClubs, setBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Young Adult'
  ];

  useEffect(() => {
    fetchBookClubs();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBookClubs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        category: selectedCategory,
        page_size: 12
      };

      const response = await bookClubAPI.getBookClubs(params);
      setBookClubs(response.results);
      setTotalPages(Math.ceil(response.count / 12));
      setError(null);
    } catch (err) {
      setError('Failed to fetch book clubs. Please try again.');
      console.error('Error fetching book clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBookClubs();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleJoinClub = async (clubId) => {
    try {
      await bookClubAPI.joinBookClub(clubId);
      fetchBookClubs(); // Refresh the list
    } catch (err) {
      console.error('Error joining book club:', err);
      alert('Failed to join book club. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Book Clubs</h1>
        <Link
          to="/bookclubs/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
        >
          Create Book Club
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search book clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm transition duration-300 ${
              selectedCategory === '' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm transition duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Book Clubs Grid */}
      {bookClubs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No book clubs found.</p>
          <Link
            to="/bookclubs/create"
            className="text-blue-500 hover:text-blue-600 underline mt-2 inline-block"
          >
            Create the first one!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
            >
              {club.image && (
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {club.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{club.member_count} members</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {club.category}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/bookclubs/${club.id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    View Details
                  </Link>
                  {!club.is_member && (
                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm transition duration-300"
                    >
                      Join
                    </button>
                  )}
                  {club.is_member && (
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Member
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookClubList;
