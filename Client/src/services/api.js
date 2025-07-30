import { jwtDecode } from 'jwt-decode';
import tokenService from '../utils/tokenService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.retryCount = 3;
    this.retryDelay = 1000;
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
    const token = tokenService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);
    console.log('API Response URL:', response.url);
    
    let data;
    try {
      data = await response.json();
      console.log('API Response Data:', data);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      // Handle different types of errors
      if (response.status === 401) {
        // Token expired or invalid
        tokenService.clearAuthTokens();
        // Optionally redirect to login
      }
      throw new Error(data.error || data.message || 'An error occurred');
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
      tokenService.setTokens(data.tokens.access, data.tokens.refresh);
      tokenService.setUser(data.user);
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
      tokenService.setTokens(data.tokens.access, data.tokens.refresh);
      tokenService.setUser(data.user);
    }
    
    return data;
  }

  // Logout user
  async logout() {
    const refreshToken = tokenService.getRefreshToken();
    
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
    tokenService.clearAuthTokens();
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
    const refreshToken = tokenService.getRefreshToken();
    
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
      tokenService.setTokens(data.access);
    }
    
    return data;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = tokenService.getAccessToken();
    if (!token) {
      return false;
    }
    
    if (tokenService.isTokenExpired(token)) {
      return false;
    }
    
    return true;
  }

  // Get current user from localStorage
  getCurrentUser() {
    return tokenService.getUser();
  }

  // Book Club API methods
  
  // Get auth headers for FormData (multipart)
  getAuthHeadersForFormData() {
    const token = tokenService.getAccessToken();
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
        tokenService.clearAuthTokens();
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

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get a specific book club by ID
  async getBookClub(id) {
    const response = await fetch(`${this.baseURL}/bookclubs/${id}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
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
