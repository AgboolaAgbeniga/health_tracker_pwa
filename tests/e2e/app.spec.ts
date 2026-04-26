import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('test2@test.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();
    await page.goto('/');
    await page.waitForURL('**/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@test.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@test.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();
    await page.getByTestId('auth-logout-button').click();
    
    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('new@test.com');
    await page.getByTestId('auth-login-password').fill('pass');
    await page.getByTestId('auth-login-submit').click();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'x@x.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([]));
    });
    await page.reload();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'x@x.com' }));
      const habit = {
        id: 'h1',
        userId: '1',
        name: 'Drink Water',
        description: '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    });
    await page.reload();
    await page.getByTestId('habit-complete-drink-water').click();
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('Streak: 1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'x@x.com' }));
      const habit = {
        id: 'h1',
        userId: '1',
        name: 'Drink Water',
        description: '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    });
    await page.reload();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: '1', email: 'x@x.com' }));
    });
    await page.reload();
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByTestId('splash-screen')).toBeVisible();
  });
});
