import { test, expect } from '@playwright/test';

test.describe('Follow/Unfollow Functionality', () => {
  let authenticatedPage;
  let unauthenticatedPage;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated user context
    const context = await browser.newContext();
    authenticatedPage = await context.newPage();
    
    // Login with test user
    await authenticatedPage.goto('/login');
    await authenticatedPage.fill('[data-testid="username-input"]', 'testuser1');
    await authenticatedPage.fill('[data-testid="password-input"]', 'testpassword');
    await authenticatedPage.click('[data-testid="login-button"]');
    await authenticatedPage.waitForURL('/dashboard');
  });

  test.beforeEach(async ({ browser }) => {
    // Create fresh unauthenticated context for each test
    const context = await browser.newContext();
    unauthenticatedPage = await context.newPage();
  });

  test('should successfully follow a user when authenticated', async () => {
    // Navigate to another user's profile
    await authenticatedPage.goto('/profile/testuser2');
    
    // Find and click follow button
    const followButton = authenticatedPage.locator('[data-testid="follow-button"]');
    await expect(followButton).toBeVisible();
    await expect(followButton).toHaveText(/Follow/i);
    
    await followButton.click();
    
    // Verify button state changes
    await expect(followButton).toHaveText(/Following/i);
    await expect(followButton).toHaveClass(/bg-green-600/);
    
    // Verify toast notification appears
    const toast = authenticatedPage.locator('[data-testid="toast-message"]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Successfully followed');
  });

  test('should successfully unfollow a user when authenticated', async () => {
    // First follow the user
    await authenticatedPage.goto('/profile/testuser2');
    const followButton = authenticatedPage.locator('[data-testid="follow-button"]');
    
    // If not already following, follow first
    const isFollowing = await followButton.textContent();
    if (!isFollowing.includes('Following')) {
      await followButton.click();
      await expect(followButton).toHaveText(/Following/i);
    }
    
    // Now unfollow
    await followButton.click();
    
    // Verify button state changes back
    await expect(followButton).toHaveText(/Follow/i);
    await expect(followButton).toHaveClass(/bg-blue-600/);
    
    // Verify toast notification appears
    const toast = authenticatedPage.locator('[data-testid="toast-message"]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Successfully unfollowed');
  });

  test('should redirect to login when trying to follow without authentication', async () => {
    // Try to access a user profile without authentication
    await unauthenticatedPage.goto('/profile/testuser2');
    
    // Should redirect to login page
    await expect(unauthenticatedPage).toHaveURL(/.*\/login/);
    
    // Verify redirect message exists
    const redirectMessage = unauthenticatedPage.locator('[data-testid="auth-required-message"]');
    await expect(redirectMessage).toContainText('Please log in to continue');
  });

  test('should not allow following the same user twice', async () => {
    // Navigate to user profile and follow
    await authenticatedPage.goto('/profile/testuser2');
    const followButton = authenticatedPage.locator('[data-testid="follow-button"]');
    
    // Ensure we start in unfollowed state
    if ((await followButton.textContent()).includes('Following')) {
      await followButton.click();
      await expect(followButton).toHaveText(/Follow/i);
    }
    
    // Follow the user
    await followButton.click();
    await expect(followButton).toHaveText(/Following/i);
    
    // Try to follow again - button should toggle to unfollow instead
    await followButton.click();
    await expect(followButton).toHaveText(/Follow/i);
    
    // Verify no duplicate follow relationship was created
    // This would be verified by checking the backend API response
    const response = await authenticatedPage.request.get('/api/users/testuser2/follow-status/');
    const followStatus = await response.json();
    expect(followStatus.is_following).toBe(false);
  });

  test('should not allow unfollowing relationships user does not own', async () => {
    // This test would require API mocking or specific backend setup
    // For now, we'll test that the UI doesn't show unfollow options for others' relationships
    
    await authenticatedPage.goto('/profile/testuser2/followers');
    
    // Check that follow buttons for other users' relationships don't show unfollow
    const otherUserCards = authenticatedPage.locator('[data-testid="user-card"]').nth(0);
    const followButton = otherUserCards.locator('[data-testid="follow-button"]');
    
    // Should only see Follow/Following button, not unfriend/remove follower
    await expect(followButton).toHaveText(/(Follow|Following)/i);
    
    // Should not see any "Remove" or "Unfollow for them" options
    const removeButton = otherUserCards.locator('[data-testid="remove-follower-button"]');
    await expect(removeButton).not.toBeVisible();
  });

  test('should handle network errors gracefully', async () => {
    await authenticatedPage.goto('/profile/testuser2');
    
    // Intercept and fail the follow request
    await authenticatedPage.route('/api/users/*/follow/', route => {
      route.abort('failed');
    });
    
    const followButton = authenticatedPage.locator('[data-testid="follow-button"]');
    await followButton.click();
    
    // Should show error toast
    const errorToast = authenticatedPage.locator('[data-testid="toast-error"]');
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toContainText('Failed to follow user');
    
    // Button should return to original state
    await expect(followButton).toHaveText(/Follow/i);
  });

  test('should show loading state during follow/unfollow operations', async () => {
    await authenticatedPage.goto('/profile/testuser2');
    
    // Slow down the API response to test loading state
    await authenticatedPage.route('/api/users/*/follow/', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    const followButton = authenticatedPage.locator('[data-testid="follow-button"]');
    await followButton.click();
    
    // Should show loading spinner
    const loadingSpinner = followButton.locator('[data-testid="loading-spinner"]');
    await expect(loadingSpinner).toBeVisible();
    
    // Button should be disabled during loading
    await expect(followButton).toBeDisabled();
    
    // Wait for operation to complete
    await expect(loadingSpinner).not.toBeVisible({ timeout: 10000 });
    await expect(followButton).toBeEnabled();
  });
});

test.describe('Cross-Device Viewport Testing', () => {
  const devices = [
    { name: 'Mobile', viewport: { width: 375, height: 667 } },
    { name: 'Tablet', viewport: { width: 768, height: 1024 } },
    { name: 'Desktop', viewport: { width: 1920, height: 1080 } }
  ];

  devices.forEach(device => {
    test(`should display follow button correctly on ${device.name}`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: device.viewport
      });
      const page = await context.newPage();
      
      // Login first
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'testuser1');
      await page.fill('[data-testid="password-input"]', 'testpassword');
      await page.click('[data-testid="login-button"]');
      
      // Navigate to user profile
      await page.goto('/profile/testuser2');
      
      const followButton = page.locator('[data-testid="follow-button"]');
      await expect(followButton).toBeVisible();
      
      // Test button is clickable and properly sized
      const boundingBox = await followButton.boundingBox();
      expect(boundingBox.width).toBeGreaterThan(60); // Minimum tap target size
      expect(boundingBox.height).toBeGreaterThan(44);
      
      // Test button text is appropriate for screen size
      const buttonText = await followButton.textContent();
      if (device.viewport.width < 640) { // Mobile
        // Should show icon or short text
        expect(buttonText.length).toBeLessThan(10);
      } else {
        // Should show full text
        expect(buttonText).toMatch(/(Follow|Following)/i);
      }
      
      await context.close();
    });
  });

  test('should handle responsive follow lists across devices', async ({ browser }) => {
    for (const device of devices) {
      const context = await browser.newContext({
        viewport: device.viewport
      });
      const page = await context.newPage();
      
      // Login and navigate to followers list
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'testuser1');
      await page.fill('[data-testid="password-input"]', 'testpassword');
      await page.click('[data-testid="login-button"]');
      
      await page.goto('/profile/testuser1/followers');
      
      // Check list layout adapts to screen size
      const followersList = page.locator('[data-testid="followers-list"]');
      await expect(followersList).toBeVisible();
      
      const userCards = page.locator('[data-testid="user-card"]');
      const firstCard = userCards.first();
      
      if (device.viewport.width < 768) { // Mobile/small tablet
        // Cards should stack vertically
        await expect(firstCard).toHaveCSS('width', /100%|auto/);
      } else {
        // Cards might be in grid layout
        const cardCount = await userCards.count();
        if (cardCount > 1) {
          const secondCard = userCards.nth(1);
          const firstCardBox = await firstCard.boundingBox();
          const secondCardBox = await secondCard.boundingBox();
          
          // Check if cards are side by side (desktop) or stacked (mobile)
          if (device.viewport.width >= 1024) {
            expect(Math.abs(firstCardBox.y - secondCardBox.y)).toBeLessThan(50);
          }
        }
      }
      
      await context.close();
    }
  });
});

test.describe('Performance Testing', () => {
  test('should handle large follower lists (10k+ users) efficiently', async ({ page }) => {
    // Setup performance monitoring
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', 'testuser1');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to a profile with many followers
    const startTime = Date.now();
    await page.goto('/profile/popular-user/followers');
    
    // Wait for initial load
    await page.waitForSelector('[data-testid="followers-list"]');
    const initialLoadTime = Date.now() - startTime;
    
    // Initial load should be fast (under 3 seconds)
    expect(initialLoadTime).toBeLessThan(3000);
    
    // Test infinite scroll performance
    let totalUsers = await page.locator('[data-testid="user-card"]').count();
    let scrollCount = 0;
    
    while (scrollCount < 20 && totalUsers < 1000) { // Load at least 1000 users
      const scrollStartTime = Date.now();
      
      // Scroll to trigger more loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Wait for new content to load
      await page.waitForFunction(
        (prevCount) => document.querySelectorAll('[data-testid="user-card"]').length > prevCount,
        totalUsers,
        { timeout: 5000 }
      );
      
      const scrollEndTime = Date.now();
      const scrollLoadTime = scrollEndTime - scrollStartTime;
      
      // Each scroll load should be fast (under 2 seconds)
      expect(scrollLoadTime).toBeLessThan(2000);
      
      totalUsers = await page.locator('[data-testid="user-card"]').count();
      scrollCount++;
    }
    
    console.log(`Loaded ${totalUsers} users in ${scrollCount} scroll operations`);
    expect(totalUsers).toBeGreaterThan(500); // Should have loaded substantial number
  });

  test('should maintain responsive UI during heavy list operations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', 'testuser1');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/profile/popular-user/followers');
    
    // Test that UI remains responsive during loading
    await page.waitForSelector('[data-testid="followers-list"]');
    
    // Rapidly scroll and interact to test responsiveness
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      
      // Try to click a follow button during scrolling
      const followButtons = page.locator('[data-testid="follow-button"]');
      const buttonCount = await followButtons.count();
      
      if (buttonCount > 0) {
        const randomButton = followButtons.nth(Math.floor(Math.random() * Math.min(buttonCount, 5)));
        
        // Button should be clickable within reasonable time
        await expect(randomButton).toBeEnabled({ timeout: 1000 });
        
        // Click and verify response is quick
        const clickStartTime = Date.now();
        await randomButton.click();
        
        // Should see loading state quickly
        await expect(randomButton.locator('[data-testid="loading-spinner"]')).toBeVisible({ timeout: 500 });
        
        const responseTime = Date.now() - clickStartTime;
        expect(responseTime).toBeLessThan(1000); // UI response should be immediate
      }
      
      await page.waitForTimeout(100); // Small delay between operations
    }
  });

  test('should handle concurrent follow/unfollow operations', async ({ browser }) => {
    // Create multiple browser contexts to simulate concurrent users
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(contexts.map(context => context.newPage()));
    
    // Login all users
    for (let i = 0; i < pages.length; i++) {
      await pages[i].goto('/login');
      await pages[i].fill('[data-testid="username-input"]', `testuser${i + 1}`);
      await pages[i].fill('[data-testid="password-input"]', 'testpassword');
      await pages[i].click('[data-testid="login-button"]');
    }
    
    // All users navigate to the same target profile
    const targetUser = 'popular-user';
    await Promise.all(pages.map(page => page.goto(`/profile/${targetUser}`)));
    
    // All users attempt to follow simultaneously
    const followPromises = pages.map(async (page, index) => {
      const followButton = page.locator('[data-testid="follow-button"]');
      await followButton.click();
      
      // Wait for operation to complete
      await expect(followButton).toHaveText(/Following/i, { timeout: 5000 });
      return `User ${index + 1} followed successfully`;
    });
    
    // All operations should complete successfully
    const results = await Promise.all(followPromises);
    expect(results).toHaveLength(3);
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });
});

test.describe('Security Tests', () => {
  test('should prevent CSRF attacks on follow endpoints', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', 'testuser1');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    
    // Intercept follow request to verify CSRF token
    let csrfTokenPresent = false;
    await page.route('/api/users/*/follow/', route => {
      const headers = route.request().headers();
      csrfTokenPresent = !!(headers['x-csrftoken'] || headers['csrf-token']);
      route.continue();
    });
    
    await page.goto('/profile/testuser2');
    const followButton = page.locator('[data-testid="follow-button"]');
    await followButton.click();
    
    expect(csrfTokenPresent).toBe(true);
  });

  test('should validate user permissions before follow operations', async ({ page }) => {
    // Test with insufficient permissions or invalid tokens
    await page.goto('/profile/testuser2');
    
    // Mock an invalid token response
    await page.route('/api/users/*/follow/', route => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ detail: 'Authentication credentials were not provided.' })
      });
    });
    
    // Should redirect to login on auth failure
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should rate limit follow/unfollow operations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username-input"]', 'testuser1');
    await page.fill('[data-testid="password-input"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/profile/testuser2');
    
    // Rapidly click follow/unfollow multiple times
    const followButton = page.locator('[data-testid="follow-button"]');
    
    for (let i = 0; i < 10; i++) {
      await followButton.click();
      await page.waitForTimeout(50); // Very rapid clicking
    }
    
    // Should eventually show rate limiting error or disable button
    const errorToast = page.locator('[data-testid="toast-error"]');
    const isDisabled = await followButton.isDisabled();
    
    // Either should show error or button should be disabled
    expect(isDisabled || await errorToast.isVisible()).toBe(true);
  });
});
