/**
 * Utility functions for consistent user display across the app
 */

/**
 * Get the display name for a user
 * Priority: Full name (first + last) > First name > Username
 * @param {Object} user - User object containing name fields
 * @returns {string} - The best available display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  
  // If both first and last name are available
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  
  // If only first name is available
  if (user.first_name) {
    return user.first_name;
  }
  
  // Fall back to username
  return user.username || 'Unknown User';
};

/**
 * Get the user's initials for avatar display
 * @param {Object} user - User object containing name fields
 * @returns {string} - Initials (max 2 characters)
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  let initials = '';
  
  // Try to get initials from first and last name
  if (user.first_name && user.last_name) {
    initials = user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase();
  } else if (user.first_name) {
    // Use first name initial twice if no last name
    initials = user.first_name.charAt(0).toUpperCase();
    if (user.first_name.length > 1) {
      initials += user.first_name.charAt(1).toUpperCase();
    }
  } else if (user.username) {
    // Fall back to username initials
    initials = user.username.charAt(0).toUpperCase();
    if (user.username.length > 1) {
      initials += user.username.charAt(1).toUpperCase();
    }
  }
  
  return initials || 'U';
};

/**
 * Get a formatted user identifier with username
 * @param {Object} user - User object containing name fields
 * @returns {string} - Display name with username in parentheses if different
 */
export const getUserFullIdentifier = (user) => {
  if (!user) return 'Unknown User';
  
  const displayName = getUserDisplayName(user);
  const username = user.username;
  
  // If display name is the same as username, just return it
  if (displayName === username) {
    return displayName;
  }
  
  // Otherwise, show display name with username
  return `${displayName} (@${username})`;
};

/**
 * Get user's secondary identifier (username or email)
 * @param {Object} user - User object
 * @returns {string} - Secondary identifier
 */
export const getUserSecondaryIdentifier = (user) => {
  if (!user) return '';
  
  if (user.username) {
    return `@${user.username}`;
  }
  
  if (user.email) {
    return user.email;
  }
  
  return '';
};

/**
 * Format user name for search/filtering
 * @param {Object} user - User object
 * @returns {string} - Searchable string with all name variations
 */
export const getUserSearchableText = (user) => {
  if (!user) return '';
  
  const parts = [];
  
  if (user.first_name) parts.push(user.first_name.toLowerCase());
  if (user.last_name) parts.push(user.last_name.toLowerCase());
  if (user.username) parts.push(user.username.toLowerCase());
  if (user.email) parts.push(user.email.toLowerCase());
  
  return parts.join(' ');
};

/**
 * Check if user has complete profile information
 * @param {Object} user - User object
 * @returns {boolean} - True if user has first and last name
 */
export const hasCompleteProfile = (user) => {
  return !!(user && user.first_name && user.last_name);
};

/**
 * Generate a consistent color for user avatar based on user ID
 * @param {number} userId - User ID
 * @returns {string} - CSS class for avatar background color
 */
export const getUserAvatarColor = (userId) => {
  if (!userId) return 'bg-gray-500';
  
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ];
  
  return colors[userId % colors.length];
};

export default {
  getUserDisplayName,
  getUserInitials,
  getUserFullIdentifier,
  getUserSecondaryIdentifier,
  getUserSearchableText,
  hasCompleteProfile,
  getUserAvatarColor
};
