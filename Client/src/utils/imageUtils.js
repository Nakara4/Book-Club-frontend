/**
 * Utility functions for handling image URLs from Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api to get base URL

/**
 * Converts a Django media URL to a fully qualified URL
 * @param {string} imageUrl - The image URL from Django (could be relative or absolute)
 * @returns {string} - Fully qualified image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it starts with /media/, prepend base URL
  if (imageUrl.startsWith('/media/')) {
    return `${BASE_URL}${imageUrl}`;
  }
  
  return `${BASE_URL}/media/${imageUrl}`;
};

/**
 * Generates a placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display on placeholder
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 400, height = 300, text = 'Book Club') => {
  return `https://via.placeholder.com/${width}x${height}/e2e8f0/94a3b8?text=${encodeURIComponent(text)}`;
};

/**
 * Handle image error by setting fallback image
 * @param {Event} event - The error event
 * @param {string} fallbackText - Text for fallback image
 */
export const handleImageError = (event, fallbackText = 'Book Club') => {
  event.target.src = getPlaceholderImage(400, 300, fallbackText);
};
