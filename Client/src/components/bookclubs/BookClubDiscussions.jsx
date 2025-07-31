import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookClubDiscussions = () => {
  const { id } = useParams();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDiscussions([
        {
          id: 1,
          title: 'What did you think of Chapter 5?',
          content: 'I found the character development in this chapter really compelling...',
          author: 'Alice Johnson',
          authorAvatar: null,
          createdAt: '2024-07-20T10:30:00Z',
          category: 'book-discussion',
          replies: 12,
          lastActivity: '2024-07-22T15:45:00Z',
          isPinned: true
        },
        {
          id: 2,
          title: 'Next month\'s book selection',
          content: 'Here are the three options we voted on. Please cast your vote by Friday!',
          author: 'Bob Smith',
          authorAvatar: null,
          createdAt: '2024-07-19T14:20:00Z',
          category: 'announcements',
          replies: 8,
          lastActivity: '2024-07-21T11:30:00Z',
          isPinned: false
        },
        {
          id: 3,
          title: 'Meeting location for next week',
          content: 'Should we meet at the usual coffee shop or try somewhere new?',
          author: 'Carol Davis',
          authorAvatar: null,
          createdAt: '2024-07-18T09:15:00Z',
          category: 'general',
          replies: 5,
          lastActivity: '2024-07-20T16:20:00Z',
          isPinned: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'book-discussion':
        return 'bg-blue-100 text-blue-800';
      case 'announcements':
        return 'bg-red-100 text-red-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      case 'events':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'book-discussion':
        return 'Book Discussion';
      case 'announcements':
        return 'Announcements';
      case 'general':
        return 'General';
      case 'events':
        return 'Events';
      default:
        return 'General';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSubmitDiscussion = (e) => {
    e.preventDefault();
    // TODO: Implement actual API call
    const discussion = {
      id: discussions.length + 1,
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: 'Current User', // This would come from auth context
      authorAvatar: null,
      createdAt: new Date().toISOString(),
      category: newDiscussion.category,
      replies: 0,
      lastActivity: new Date().toISOString(),
      isPinned: false
    };
    
    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '', category: 'general' });
    setShowNewDiscussion(false);
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              New Discussion
            </button>
          </div>
          <p className="text-gray-600 mt-2">{discussions.length} discussions</p>
        </div>

        {/* New Discussion Form */}
        {showNewDiscussion && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Start a New Discussion</h2>
            <form onSubmit={handleSubmitDiscussion} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What would you like to discuss?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newDiscussion.category}
                  onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="book-discussion">Book Discussion</option>
                  <option value="announcements">Announcements</option>
                  <option value="events">Events</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Post Discussion
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewDiscussion(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions List */}
        <div className="p-6">
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-start space-x-4">
                  {discussion.isPinned && (
                    <div className="text-yellow-500" title="Pinned">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {discussion.authorAvatar ? (
                      <img
                        src={discussion.authorAvatar}
                        alt={discussion.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {getInitials(discussion.author)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-800 truncate">
                        {discussion.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(discussion.category)}`}
                      >
                        {getCategoryLabel(discussion.category)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {discussion.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>by {discussion.author}</span>
                        <span>{formatDate(discussion.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{discussion.replies} replies</span>
                        </span>
                        <span>Last activity {formatDate(discussion.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {discussions.length === 0 && (
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start the conversation by creating the first discussion.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowNewDiscussion(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  New Discussion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookClubDiscussions;
