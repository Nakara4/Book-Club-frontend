import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookClubBooks = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    readingStartDate: '',
    readingEndDate: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBooks([
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '9780743273565',
          description: 'A classic American novel set in the summer of 1922.',
          status: 'currently-reading',
          readingStartDate: '2024-07-01',
          readingEndDate: '2024-07-31',
          cover: null,
          addedBy: 'Alice Johnson',
          addedDate: '2024-06-15',
          votes: 12,
          averageRating: 4.2,
          totalRatings: 8
        },
        {
          id: 2,
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          isbn: '9780061120084',
          description: 'A gripping tale of racial injustice and childhood innocence.',
          status: 'completed',
          readingStartDate: '2024-05-01',
          readingEndDate: '2024-05-31',
          cover: null,
          addedBy: 'Bob Smith',
          addedDate: '2024-04-20',
          votes: 15,
          averageRating: 4.7,
          totalRatings: 10
        },
        {
          id: 3,
          title: '1984',
          author: 'George Orwell',
          isbn: '9780451524935',
          description: 'A dystopian social science fiction novel about totalitarian control.',
          status: 'upcoming',
          readingStartDate: '2024-08-01',
          readingEndDate: '2024-08-31',
          cover: null,
          addedBy: 'Carol Davis',
          addedDate: '2024-07-10',
          votes: 9,
          averageRating: null,
          totalRatings: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'currently-reading':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'currently-reading':
        return 'Currently Reading';
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'on-hold':
        return 'On Hold';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  const handleSubmitBook = (e) => {
    e.preventDefault();
    // TODO: Implement actual API call
    const book = {
      id: books.length + 1,
      ...newBook,
      status: 'upcoming',
      cover: null,
      addedBy: 'Current User', // This would come from auth context
      addedDate: new Date().toISOString().split('T')[0],
      votes: 0,
      averageRating: null,
      totalRatings: 0
    };
    
    setBooks([...books, book]);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      description: '',
      readingStartDate: '',
      readingEndDate: ''
    });
    setShowAddBook(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Reading List</h1>
            <button
              onClick={() => setShowAddBook(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Book
            </button>
          </div>
          <p className="text-gray-600 mt-2">{books.length} books in reading list</p>
        </div>

        {/* Add Book Form */}
        {showAddBook && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Book</h2>
            <form onSubmit={handleSubmitBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author name"
                  required
                />
              </div>

              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  id="isbn"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ISBN number"
                />
              </div>

              <div></div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the book"
                />
              </div>

              <div>
                <label htmlFor="readingStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Start Date
                </label>
                <input
                  type="date"
                  id="readingStartDate"
                  value={newBook.readingStartDate}
                  onChange={(e) => setNewBook({...newBook, readingStartDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="readingEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading End Date
                </label>
                <input
                  type="date"
                  id="readingEndDate"
                  value={newBook.readingEndDate}
                  onChange={(e) => setNewBook({...newBook, readingEndDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBook(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-24 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {book.title}
                        </h3>
                        <p className="text-gray-600">by {book.author}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}
                      >
                        {getStatusLabel(book.status)}
                      </span>
                    </div>

                    {book.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {book.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-500">
                      {book.readingStartDate && (
                        <div className="flex items-center space-x-4">
                          <span>📅 {formatDate(book.readingStartDate)}</span>
                          {book.readingEndDate && (
                            <span>→ {formatDate(book.readingEndDate)}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span>Added by {book.addedBy}</span>
                          <span>👍 {book.votes}</span>
                        </div>
                        
                        {book.averageRating && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(book.averageRating)}
                            </div>
                            <span className="text-xs">
                              {book.averageRating.toFixed(1)} ({book.totalRatings})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No books in reading list</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start building your reading list by adding the first book.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddBook(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookClubBooks;
