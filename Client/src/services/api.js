const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.retryCount = 3;
    this.retryDelay = 1000;
    
    console.log('API Base URL configured as:', this.baseURL);
    if (!this.baseURL) {
      console.error('VITE_API_BASE_URL environment variable is not set!');
    }
  }

  // Enhanced retry mechanism
  async retryRequest(requestFn, retries = this.retryCount) {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(this.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  // Check if request should be retried
  shouldRetry(error) {
    // Retry on network errors, 5xx errors, but not on 4xx errors
    if (!error.response) return true; // Network error
    const status = error.response.status || 0;
    return status >= 500 && status < 600;
  }

  // Delay utility for retry
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    let data;
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      data = await response.json();
    } catch (jsonError) {
      // If response is not JSON, create a generic error
      if (!response.ok) {
        throw new Error(`${errorMessage} - Unable to parse response as JSON`);
      }
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      // Handle different types of errors with specific messages
      let userFriendlyMessage;
      
      switch (response.status) {
        case 400:
          userFriendlyMessage = 'Invalid request. Please check your input and try again.';
          break;
        case 401:
          // Token expired or invalid - clear all auth data
          console.log('Token expired or invalid, clearing authentication data');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          const tokenError = data.detail || data.error || data.message;
          if (tokenError && (tokenError.includes('token') || tokenError.includes('Token'))) {
            userFriendlyMessage = 'Your session has expired. Please log in again.';
          } else {
            userFriendlyMessage = 'Authentication required. Please log in to continue.';
          }
          break;
        case 403:
          userFriendlyMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          const notFoundError = data.detail || data.error || data.message;
          if (notFoundError && notFoundError.includes('BookClub')) {
            userFriendlyMessage = 'Book club not found. It may have been deleted or the link is incorrect.';
          } else {
            userFriendlyMessage = 'The requested resource was not found.';
          }
          break;
        case 429:
          userFriendlyMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          userFriendlyMessage = 'Server error. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          userFriendlyMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          // Use the specific error from the API response if available
          const specificError = data.error || data.message || data.detail || data.non_field_errors;
          userFriendlyMessage = Array.isArray(specificError) ? specificError[0] : specificError || errorMessage;
      }
      
      throw new Error(userFriendlyMessage);
    }
    
    return data;
  }

  // Register new user
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
      }),
    });

    const data = await this.handleResponse(response);
    
    // Store tokens and user data
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Login user
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const data = await this.handleResponse(response);
    
    // Store tokens and user data
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Logout user
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await fetch(`${this.baseURL}/auth/logout/`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage regardless of API call success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Get user profile
  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await this.handleResponse(response);
    
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    
    return data;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Book Club API methods
  
  // Get auth headers for FormData (multipart)
  getAuthHeadersForFormData() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Handle response for FormData requests
  async handleFormDataResponse(response) {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: 'An error occurred' };
      }
      
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
      
      const error = new Error(errorData.error || errorData.message || 'An error occurred');
      error.response = { data: errorData };
      throw error;
    }
    
    return response.json();
  }

  // Get all book clubs with filtering and pagination
  async getBookClubs(params = {}) {
    const url = new URL(`${this.baseURL}/bookclubs/`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    console.log('Fetching book clubs from:', url.toString());
    
    try {
      // First try with auth headers if we have a token
      const hasToken = !!localStorage.getItem('access_token');
      const headers = hasToken ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('Book clubs response status:', response.status, response.statusText);
      
      // If we got a 401 and we had a token, try again without auth
      if (response.status === 401 && hasToken) {
        console.log('Token invalid, retrying without authentication');
        const unauthResponse = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return this.handleResponse(unauthResponse);
      }
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Network error fetching book clubs:', error);
      throw new Error(`Failed to connect to the server. Please check if the backend is running on ${this.baseURL}`);
    }
  }

  // Get a specific book club by ID
  async getBookClub(id) {
    const url = `${this.baseURL}/bookclubs/${id}/`;
    console.log('Fetching book club from:', url);
    
    try {
      // First try with auth headers if we have a token
      const hasToken = !!localStorage.getItem('access_token');
      const headers = hasToken ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('Book club response status:', response.status, response.statusText);
      
      // If we got a 401 and we had a token, try again without auth
      if (response.status === 401 && hasToken) {
        console.log('Token invalid, retrying without authentication');
        const unauthResponse = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return this.handleResponse(unauthResponse);
      }
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Network error fetching book club:', error);
      throw new Error(`Failed to connect to the server. Please check if the backend is running on ${this.baseURL}`);
    }
  }

  // Create a new book club
  async createBookClub(formData) {
    const response = await fetch(`${this.baseURL}/bookclubs/`, {
      method: 'POST',
      headers: this.getAuthHeadersForFormData(),
      body: formData,
    });

    return this.handleFormDataResponse(response);
  }

  // Update a book club
  async updateBookClub(id, formData) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeadersForFormData(),
      body: formData,
    });

    return this.handleFormDataResponse(response);
  }

  // Delete a book club
  async deleteBookClub(id) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(errorData.error || 'Failed to delete book club');
    }

    return response.status === 204 ? { success: true } : response.json();
  }

  // Join a book club
  async joinBookClub(id) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/join/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Leave a book club
  async leaveBookClub(id) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/leave/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get book club statistics
  async getBookClubStats(id) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/stats/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Search book clubs
  async searchBookClubs(query, params = {}) {
    const url = new URL(`${this.baseURL}/bookclubs/search/`);
    url.searchParams.append('q', query);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get user's book club memberships
  async getUserMemberships() {
    const response = await fetch(`${this.baseURL}/bookclubs/my-memberships/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Invite user to book club
  async inviteToBookClub(clubId, userData) {
    const response = await fetch(`${this.baseURL}/bookclubs/${clubId}/invite/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  // Get book club discovery (featured, trending, etc.)
  async getBookClubDiscovery() {
    const response = await fetch(`${this.baseURL}/bookclubs/discovery/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }
}

// Create a specific bookClubAPI object for easier imports
export const bookClubAPI = {
  getBookClubs: (params) => apiService.getBookClubs(params),
  getBookClub: (id) => apiService.getBookClub(id),
  createBookClub: (formData) => apiService.createBookClub(formData),
  updateBookClub: (id, formData) => apiService.updateBookClub(id, formData),
  deleteBookClub: (id) => apiService.deleteBookClub(id),
  joinBookClub: (id) => apiService.joinBookClub(id),
  leaveBookClub: (id) => apiService.leaveBookClub(id),
  getBookClubStats: (id) => apiService.getBookClubStats(id),
  searchBookClubs: (query, params) => apiService.searchBookClubs(query, params),
  getUserMemberships: () => apiService.getUserMemberships(),
  inviteToBookClub: (clubId, userData) => apiService.inviteToBookClub(clubId, userData),
  getBookClubDiscovery: () => apiService.getBookClubDiscovery(),
};

const apiService = new ApiService();
export default apiService;
