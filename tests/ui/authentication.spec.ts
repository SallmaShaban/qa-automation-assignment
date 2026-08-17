// spec: specs/SAUCE_DEMO_TEST_PLAN.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { CREDENTIALS, ERROR_MESSAGES } from '../../src/config/config';

test.describe('Authentication Tests', () => {
  test('TC001: Successful login using a standard user', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto('https://www.saucedemo.com');
    
    // Verify login page is displayed
    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Step 2: Enter standard_user in username field
    await usernameInput.fill('standard_user');
    await expect(usernameInput).toHaveValue('standard_user');

    // Step 3: Enter secret_sauce in password field
    await passwordInput.fill('secret_sauce');
    await expect(passwordInput).toHaveValue('secret_sauce');

    // Step 4: Click login button and verify navigation
    await loginButton.click();
    
    // Wait for navigation and verify inventory page
    await page.waitForURL(/.*inventory/);
    expect(page.url()).toContain('/inventory');
    
    // Verify products are displayed
    const productContainer = page.locator('.inventory_container');
    await expect(productContainer).toBeVisible();
    
    // Verify shopping cart is visible
    const cartLink = page.locator('a.shopping_cart_link');
    await expect(cartLink).toBeVisible();
  });

  test('TC002: Failed login using a locked-out user and verify error message', async ({ page }) => {
    // Step 1: Navigate to login page
    await page.goto('https://www.saucedemo.com');
    
    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');
    const errorMessage = page.locator('[data-test="error"]');

    // Step 2: Enter locked_out_user in username field
    await usernameInput.fill('locked_out_user');
    await expect(usernameInput).toHaveValue('locked_out_user');

    // Step 3: Enter secret_sauce in password field
    await passwordInput.fill('secret_sauce');
    await expect(passwordInput).toHaveValue('secret_sauce');

    // Step 4: Click login button
    await loginButton.click();
    
    // Wait for error message to appear
    await errorMessage.waitFor({ state: 'visible' });
    
    // Verify error message is displayed and contains locked out message
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.textContent();
    expect(errorText).toContain('Sorry, this user has been locked out');
    
    // Verify user is still on login page
    expect(page.url()).not.toContain('/inventory');
  });
});