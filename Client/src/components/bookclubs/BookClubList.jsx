import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookClubJoin from './BookClubJoin';
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

  const handleJoinSuccess = () => {
    fetchBookClubs(); // Refresh the list
  };

  const handleJoinError = (errorMessage) => {
    console.error('Error joining book club:', errorMessage);
    setError(errorMessage);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200"></div>
          <div className="absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading book clubs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Book Clubs
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Discover and join amazing reading communities</p>
        </div>
        <Link
          to="/bookclubs/create"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium shadow-soft hover:shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base w-full md:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Create Book Club</span>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-soft p-4 md:p-8 mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-col md:flex-row gap-4">
          <input
              type="text"
              placeholder="Search book clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:flex-1 px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700 placeholder-gray-400 text-sm md:text-base"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-soft hover:shadow-md transition duration-300 font-medium flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 text-sm md:text-base">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition duration-300 ${
              selectedCategory === '' 
                ? 'bg-primary-500 text-white shadow-soft' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {bookClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-xl shadow-soft hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              {club.image && (
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                />
              )}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {club.description}
                </p>
                
                <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 mb-4 mt-auto">
                  <span>{club.member_count} members</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {club.category}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <Link
                    to={`/bookclubs/${club.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
                >
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg
                  >
                    View Details
                  </Link>
                  {!club.is_member && (
                    <BookClubJoin
                      clubId={club.id}
                      onJoinSuccess={handleJoinSuccess}
                      onJoinError={handleJoinError}
                    />
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
