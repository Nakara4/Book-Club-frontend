import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiService from '../services/api';

// Helper to generate a mock JWT token
const generateToken = (payload, expiresIn) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  let finalPayload = { ...payload };
  
  if (expiresIn !== undefined) {
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    finalPayload.exp = expiration;
  }
  
  // Base64Url encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(finalPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // For testing, signature can be a dummy value
  const signature = 'dummy-signature';
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

describe('apiService.isAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
  });

  it('should return false if no access_token is found', () => {
    expect(apiService.isAuthenticated()).toBe(false);
  });

  it('should return true for a valid and non-expired token', () => {
    const validToken = generateToken({ sub: 'user123' }, 3600); // Expires in 1 hour
    localStorage.setItem('access_token', validToken);
    expect(apiService.isAuthenticated()).toBe(true);
  });

  it('should return false for an expired token and remove it from localStorage', () => {
    const expiredToken = generateToken({ sub: 'user123' }, -3600); // Expired 1 hour ago
    localStorage.setItem('access_token', expiredToken);
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should return false for a malformed token and remove it from localStorage', () => {
    const malformedToken = 'this-is-not-a-valid-token';
    localStorage.setItem('access_token', malformedToken);
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('should handle tokens with no expiration claim', () => {
    // A token without an `exp` claim is valid until it's removed
    const noExpToken = generateToken({ sub: 'user123' }, undefined);
    localStorage.setItem('access_token', noExpToken);
    expect(apiService.isAuthenticated()).toBe(true);
  });
  
  it('should clean up all localStorage data when token is expired', () => {
    const expiredToken = generateToken({ sub: 'user123' }, -3600);
    localStorage.setItem('access_token', expiredToken);
    localStorage.setItem('refresh_token', 'some-refresh-token');
    localStorage.setItem('user', JSON.stringify({ id: 123, name: 'Test User' }));
    
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
  
  it('should clean up all localStorage data when token is malformed', () => {
    const malformedToken = 'invalid.jwt.token';
    localStorage.setItem('access_token', malformedToken);
    localStorage.setItem('refresh_token', 'some-refresh-token');
    localStorage.setItem('user', JSON.stringify({ id: 123, name: 'Test User' }));
    
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
  
  it('should handle empty string token', () => {
    localStorage.setItem('access_token', '');
    expect(apiService.isAuthenticated()).toBe(false);
  });
  
  it('should handle null token', () => {
    localStorage.setItem('access_token', 'null');
    expect(apiService.isAuthenticated()).toBe(false);
  });
  
  it('should handle token with only header part', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const malformedToken = `${encodedHeader}`;
    
    localStorage.setItem('access_token', malformedToken);
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });
  
  it('should handle token with invalid JSON in payload', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const invalidPayload = btoa('invalid-json{').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signature = 'dummy-signature';
    const malformedToken = `${encodedHeader}.${invalidPayload}.${signature}`;
    
    localStorage.setItem('access_token', malformedToken);
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });
  
  it('should handle token that expires exactly at current time', () => {
    const expiringNowToken = generateToken({ sub: 'user123' }, 0); // Expires exactly now
    localStorage.setItem('access_token', expiringNowToken);
    expect(apiService.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('access_token')).toBeNull();
  });
  
  it('should return true for token expiring in the future (edge case: 1 second)', () => {
    const validToken = generateToken({ sub: 'user123' }, 1); // Expires in 1 second
    localStorage.setItem('access_token', validToken);
    expect(apiService.isAuthenticated()).toBe(true);
  });

  // Optional: Add tests for issuer and audience validation if you implement them
  // it('should return false if issuer is invalid', () => {
  //   process.env.VITE_JWT_ISSUER = 'expected-issuer';
  //   const token = generateToken({ sub: 'user123', iss: 'wrong-issuer' }, 3600);
  //   localStorage.setItem('access_token', token);
  //   expect(apiService.isAuthenticated()).toBe(false);
  // });

  // it('should return false if audience is invalid', () => {
  //   process.env.VITE_JWT_AUDIENCE = 'expected-audience';
  //   const token = generateToken({ sub: 'user123', aud: 'wrong-audience' }, 3600);
  //   localStorage.setItem('access_token', token);
  //   expect(apiService.isAuthenticated()).toBe(false);
  // });
});
