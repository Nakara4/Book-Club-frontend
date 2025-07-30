import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import tokenService from '../utils/tokenService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/admin`,
    prepareHeaders: (headers) => {
      const token = tokenService.getAccessToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Stats'],
  endpoints: (builder) => ({
    // Admin Stats endpoint
    getAdminStats: builder.query({
      query: () => 'stats/',
      providesTags: ['Stats'],
    }),
    
    // User Management endpoints
    getUserList: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key]) {
            searchParams.append(key, params[key]);
          }
        });
        return `users/?${searchParams.toString()}`;
      },
      providesTags: ['User'],
    }),
    
    getUserById: builder.query({
      query: (userId) => `users/${userId}/`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    
    promoteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/promote/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        'User',
        'Stats'
      ],
    }),
    
    demoteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/demote/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        'User',
        'Stats'
      ],
    }),
    
    banUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `users/${userId}/ban/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'User',
        'Stats'
      ],
    }),
    
    unbanUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/unban/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        'User',
        'Stats'
      ],
    }),
    
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),
    
    // Book Club Management endpoints
    getBookClubsList: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key]) {
            searchParams.append(key, params[key]);
          }
        });
        return `bookclubs/?${searchParams.toString()}`;
      },
    }),
    
    deleteBookClub: builder.mutation({
      query: (clubId) => ({
        url: `bookclubs/${clubId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stats'],
    }),
    
    // System Management endpoints
    getSystemStats: builder.query({
      query: () => 'system/stats/',
      providesTags: ['Stats'],
    }),
    
    getAuditLogs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key]) {
            searchParams.append(key, params[key]);
          }
        });
        return `audit-logs/?${searchParams.toString()}`;
      },
    }),
    
    // Bulk operations
    bulkUserAction: builder.mutation({
      query: ({ userIds, action, data = {} }) => ({
        url: 'users/bulk-action/',
        method: 'POST',
        body: {
          user_ids: userIds,
          action,
          ...data
        },
      }),
      invalidatesTags: ['User', 'Stats'],
    }),
  }),
});

export const {
  // Stats hooks
  useGetAdminStatsQuery,
  useGetSystemStatsQuery,
  
  // User management hooks
  useGetUserListQuery,
  useGetUserByIdQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useDeleteUserMutation,
  useBulkUserActionMutation,
  
  // Book club management hooks
  useGetBookClubsListQuery,
  useDeleteBookClubMutation,
  
  // Audit logs
  useGetAuditLogsQuery,
} = adminApi;

