// spec: specs/SAUCE_DEMO_TEST_PLAN.md
// seed: tests/ui/seed.spec.ts

import { test, expect, Page } from '@playwright/test';
import { CREDENTIALS } from '../../src/config/config';

test.describe('Checkout Flow Tests', () => {
  // Helper function to login
  async function login(page: Page) {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('[data-test="password"]').fill(CREDENTIALS.VALID_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/.*inventory/);
  }

  // Helper function to add products to cart
  async function addProductsToCart(page: Page) {
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    const bikeLightButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    await backpackButton.click();
    await bikeLightButton.click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
  }

  test('TC005: Complete the checkout flow and verify confirmation page', async ({ page }) => {
    // Step 1: Login and add Backpack and Bike Light to cart
    await login(page);
    await addProductsToCart(page);

    // Step 2: Navigate to cart page
    const cartLink = page.locator('a.shopping_cart_link');
    await cartLink.click();
    
    await page.waitForURL(/.*cart/);
    const cartContainer = page.locator('.cart_container');
    await expect(cartContainer).toBeVisible();

    // Step 3: Click Checkout button
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Verify Checkout Step 1 is displayed
    await page.waitForURL(/.*checkout-step-one/);
    
    // Wait for checkout form to be visible
    const checkoutForm = page.locator('[data-test="checkout-steps-one"]');
    await expect(checkoutForm).toBeVisible();

    // Step 4: Fill checkout information
    const firstNameInput = page.locator('[data-test="firstName"]');
    const lastNameInput = page.locator('[data-test="lastName"]');
    const postalCodeInput = page.locator('[data-test="postalCode"]');
    
    await expect(firstNameInput).toBeVisible();
    await firstNameInput.fill('John');
    await expect(firstNameInput).toHaveValue('John');
    
    await lastNameInput.fill('Doe');
    await expect(lastNameInput).toHaveValue('Doe');
    
    await postalCodeInput.fill('12345');
    await expect(postalCodeInput).toHaveValue('12345');

    // Step 5: Click Continue button
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Verify Checkout Step 2 is displayed
    await page.waitForURL(/.*checkout-step-two/);
    const checkoutStepTwo = page.locator('[data-test="checkout-steps-two"]');
    await expect(checkoutStepTwo).toBeVisible();
    
    // Verify items are displayed in summary
    const summaryItems = page.locator('.cart_item');
    await expect(summaryItems).toHaveCount(2);
    
    // Verify first item contains Backpack
    const firstItemName = summaryItems.first().locator('.inventory_item_name');
    await expect(firstItemName).toContainText('Sauce Labs Backpack');

    // Step 6: Click Finish button
    const finishButton = page.locator('[data-test="finish"]');
    await finishButton.click();
    
    // Verify Order Confirmation page
    await page.waitForURL(/.*checkout-complete/);
    const confirmationContainer = page.locator('.checkout_complete_container');
    await expect(confirmationContainer).toBeVisible();
    
    // Verify thank you message
    const thankYouMsg = page.locator('.complete-header');
    await expect(thankYouMsg).toBeVisible();
    const msgText = await thankYouMsg.textContent();
    expect(msgText).toBeTruthy();
    expect(msgText).toContain('Thank you');
  });

  test('TC007: Validate error when leaving checkout fields blank', async ({ page }) => {
    // Step 1: Login and add a product to cart
    await login(page);
    
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await backpackButton.click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // Step 2: Navigate to cart and click Checkout
    const cartLink = page.locator('a.shopping_cart_link');
    await cartLink.click();
    
    await page.waitForURL(/.*cart/);
    
    const checkoutButton = page.locator('[data-test="checkout"]');
    await checkoutButton.click();
    
    // Verify Checkout Step 1 is displayed
    await page.waitForURL(/.*checkout-step-one/);
    const checkoutForm = page.locator('[data-test="checkout-steps-one"]');
    await expect(checkoutForm).toBeVisible();

    // Step 3: Leave all fields blank and click Continue
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();
    
    // Wait for error message to appear
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    
    // Step 4: Verify error message is displayed
    const errorText = await errorMessage.textContent();
    expect(errorText).toBeTruthy();
    expect(errorText?.toLowerCase()).toContain('required');
    
    // Verify user is still on checkout step one
    expect(page.url()).toContain('checkout-step-one');
  });
});