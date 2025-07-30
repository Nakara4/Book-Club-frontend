import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import apiService from '../../services/api';
import tokenService from '../../utils/tokenService';

const getInitialAuthState = () => {
  const token = tokenService.getAccessToken();
  const user = tokenService.getUser();
  
  if (token && user && !tokenService.isTokenExpired(token)) {
    try {
      const decodedToken = jwtDecode(token);
      return {
        user,
        token,
        decodedToken,
        isAuthenticated: true,
        isAdmin: decodedToken.is_staff || false,
        isStaff: decodedToken.is_staff || false, // Keep for backwards compatibility
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      // Clear invalid tokens
      tokenService.clearAuthTokens();
    }
  }
  
  return {
    user: null,
    token: null,
    decodedToken: null,
    isAuthenticated: false,
    isAdmin: false,
    isStaff: false,
  };
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      return {};
    } catch (error) {
      // Even if logout fails on server, we should clear local state
      return {};
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiService.refreshToken(refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  ...getInitialAuthState(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, tokens } = action.payload;
      const token = tokens?.access || action.payload.token;
      
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          state.user = user;
          state.token = token;
          state.decodedToken = decodedToken;
          state.isAuthenticated = true;
          state.isAdmin = decodedToken.is_staff || false;
          state.isStaff = decodedToken.is_staff || false; // Keep for backwards compatibility
          
          // Store in localStorage using tokenService
          tokenService.setTokens(token, tokens?.refresh);
          tokenService.setUser(user);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.decodedToken = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isStaff = false;
      
      // Clear localStorage using tokenService
      tokenService.clearAuthTokens();
    },
    updateToken: (state, action) => {
      const { token } = action.payload;
      
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          state.token = token;
          state.decodedToken = decodedToken;
          state.isAdmin = decodedToken.is_staff || false;
          state.isStaff = decodedToken.is_staff || false; // Keep for backwards compatibility
          
          tokenService.setTokens(token);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { user, tokens } = action.payload;
        const token = tokens?.access || action.payload.token;
        
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            state.user = user;
            state.token = token;
            state.decodedToken = decodedToken;
            state.isAuthenticated = true;
            state.isAdmin = decodedToken.is_staff || false;
            state.isStaff = decodedToken.is_staff || false; // Keep for backwards compatibility
            
            tokenService.setTokens(token, tokens?.refresh);
            tokenService.setUser(user);
          } catch (error) {
            console.error('Error decoding token:', error);
            state.error = 'Invalid token received';
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.decodedToken = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isStaff = false;
        state.error = null;
        
        tokenService.clearAuthTokens();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Still clear local state even if server logout fails
        state.user = null;
        state.token = null;
        state.decodedToken = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isStaff = false;
        
        tokenService.clearAuthTokens();
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { tokens } = action.payload;
        const token = tokens?.access;
        
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            state.token = token;
            state.decodedToken = decodedToken;
            state.isAdmin = decodedToken.is_staff || false;
            state.isStaff = decodedToken.is_staff || false; // Keep for backwards compatibility
            
            tokenService.setTokens(token, tokens?.refresh);
          } catch (error) {
            console.error('Error decoding refreshed token:', error);
          }
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, logout user
        state.user = null;
        state.token = null;
        state.decodedToken = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.isStaff = false;
        
        tokenService.clearAuthTokens();
      });
  },
});

export const { setCredentials, logout, updateToken, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectDecodedToken = (state) => state.auth.decodedToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectIsStaff = (state) => state.auth.isStaff; // Keep for backwards compatibility

export default authSlice.reducer;
