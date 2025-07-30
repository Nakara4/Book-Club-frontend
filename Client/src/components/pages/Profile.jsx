import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        bio: 'Passionate reader and book club enthusiast. Love exploring different genres and connecting with fellow book lovers.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com',
        joinedDate: '2024-01-15',
        favoriteGenres: ['Fiction', 'Mystery', 'Science Fiction', 'Biography'],
        readingGoal: {
          yearly: 24,
          current: 12
        },
        stats: {
          totalBooks: 47,
          bookClubsJoined: 4,
          bookClubsOwned: 1,
          discussionsStarted: 23,
          booksReviewed: 31
        },
        recentActivity: [
          {
            id: 1,
            type: 'book_finished',
            title: 'Finished reading "The Seven Husbands of Evelyn Hugo"',
            date: '2024-07-22',
            rating: 5
          },
          {
            id: 2,
            type: 'discussion_started',
            title: 'Started discussion about character development',
            clubName: 'Modern Fiction Book Club',
            date: '2024-07-20'
          },
          {
            id: 3,
            type: 'club_joined',
            title: 'Joined "Mystery & Thriller Enthusiasts"',
            date: '2024-07-18'
          }
        ],
        preferences: {
          emailNotifications: true,
          discussionNotifications: true,
          meetingReminders: true,
          bookRecommendations: false,
          privacyLevel: 'public'
        }
      };
      setProfileData(userData);
      setFormData({
        name: userData.name,
        bio: userData.bio,
        location: userData.location,
        website: userData.website,
        favoriteGenres: userData.favoriteGenres,
        readingGoal: userData.readingGoal.yearly
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => {
      const genres = prev.favoriteGenres || [];
      const updatedGenres = genres.includes(genre)
        ? genres.filter(g => g !== genre)
        : [...genres, genre];
      return { ...prev, favoriteGenres: updatedGenres };
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Implement actual API call
    setProfileData(prev => ({
      ...prev,
      ...formData,
      readingGoal: { ...prev.readingGoal, yearly: formData.readingGoal }
    }));
    setEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setFormData({
      name: profileData.name,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      favoriteGenres: profileData.favoriteGenres,
      readingGoal: profileData.readingGoal.yearly
    });
    setEditing(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Poetry', 
    'Drama', 'Thriller', 'Horror', 'Philosophy'
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'book_finished':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'discussion_started':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'club_joined':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium text-2xl">
                {getInitials(profileData.name)}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.email}</p>
                {profileData.location && (
                  <p className="text-sm text-gray-500 mt-1">📍 {profileData.location}</p>
                )}
                {profileData.website && (
                  <a 
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    🌐 {profileData.website}
                  </a>
                )}
              </div>
              
              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <p className="text-gray-700 mt-3">{profileData.bio}</p>
            
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <span>Joined {formatDate(profileData.joinedDate)}</span>
              <span>📚 {profileData.stats.totalBooks} books read</span>
              <span>👥 {profileData.stats.bookClubsJoined} clubs joined</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="readingGoal" className="block text-sm font-medium text-gray-700 mb-1">
                      Yearly Reading Goal
                    </label>
                    <input
                      type="number"
                      id="readingGoal"
                      name="readingGoal"
                      value={formData.readingGoal}
                      onChange={handleInputChange}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Favorite Genres
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableGenres.map((genre) => (
                        <label key={genre} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.favoriteGenres?.includes(genre) || false}
                            onChange={() => handleGenreChange(genre)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Reading Goal</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {profileData.readingGoal.current} of {profileData.readingGoal.yearly} books
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round((profileData.readingGoal.current / profileData.readingGoal.yearly) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((profileData.readingGoal.current / profileData.readingGoal.yearly) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.favoriteGenres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {profileData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {activity.clubName && (
                        <p className="text-xs text-blue-600 mt-1">{activity.clubName}</p>
                      )}
                      {activity.rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < activity.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Reading Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Total Books Read</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.stats.totalBooks}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Book Clubs Joined</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.stats.bookClubsJoined}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Book Clubs Owned</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.stats.bookClubsOwned}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Discussions Started</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.stats.discussionsStarted}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">Books Reviewed</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{profileData.stats.booksReviewed}</p>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive general email notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.emailNotifications}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Discussion Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified when someone replies to your discussions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.discussionNotifications}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Meeting Reminders</h4>
                    <p className="text-sm text-gray-500">Receive reminders about upcoming book club meetings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.meetingReminders}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Book Recommendations</h4>
                    <p className="text-sm text-gray-500">Get personalized book recommendations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.bookRecommendations}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Privacy Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={profileData.preferences.privacyLevel}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="friends">Friends Only - Only book club members can see your profile</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
