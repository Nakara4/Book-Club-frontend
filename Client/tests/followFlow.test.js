import { test, expect } from '@playwright/test';

// Define a basic test for following a user
// This assumes users with IDs 1 and 2 exist

test.describe('Follow/Unfollow User Flow', () => {
  test('should follow and unfollow a user', async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('/login');
    await page.fill('input[name="username"]', 'user1');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to user profile page to follow
    await page.goto('/user/2');
    const followButton = page.locator('text=Follow');
    await followButton.click();

    // Wait for follow action and verify
    await expect(followButton).toHaveText('Following');

    // Unfollow the user
    await followButton.click();
    await expect(followButton).toHaveText('Follow');
  });

  test('should not follow a user without authentication', async ({ page }) => {
    // Try to follow without logging in
    await page.goto('/user/2');
    const followButton = page.locator('text=Follow');
    await followButton.click();

    // Expect to redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should not follow a user twice', async ({ page }) => {
    // Follow a user first
    await page.goto('/login');
    await page.fill('input[name="username"]', 'user1');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.goto('/user/2');
    const followButton = page.locator('text=Follow');
    await followButton.click();
    await expect(followButton).toHaveText('Following');

    // Try to follow again, should still say 'Following'
    await followButton.click();
    await expect(followButton).toHaveText('Following');
  });
});

// Define performance test for the list of followers with 10k users

test.describe('View Lists', () => {
  test('should handle 10k followers', async ({ page }) => {
    // Generate followers in the backend for performance testing
    await page.goto('/followers');

    // Scroll and check if all followers can load
    await page.mouse.wheel(0, 99999);
    const followersCount = await page.locator('.follower-item').count();
    expect(followersCount).toBeGreaterThan(9000);
  });
});

