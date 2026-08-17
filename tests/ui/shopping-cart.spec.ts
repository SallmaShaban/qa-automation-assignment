// spec: specs/SAUCE_DEMO_TEST_PLAN.md
// seed: tests/ui/seed.spec.ts

import { test, expect, Page } from '@playwright/test';
import { CREDENTIALS, PRODUCTS } from '../../src/config/config';

test.describe('Shopping Cart Tests', () => {
  // Helper function to login
  async function login(page: Page) {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('[data-test="password"]').fill(CREDENTIALS.VALID_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/.*inventory/);
  }

  test('TC003: Add two specific products to the cart', async ({ page }) => {
    // Step 1: Log in with valid credentials
    await login(page);
    
    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toBeVisible();

    // Step 2: Click 'Add to Cart' for Sauce Labs Backpack
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await backpackButton.click();
    
    // Verify button changes to Remove and cart badge shows 1
    await expect(backpackButton).toContainText('Remove');
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // Step 3: Click 'Add to Cart' for Sauce Labs Bike Light
    const bikeLightButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await bikeLightButton.click();
    
    // Verify button changes to Remove and cart badge shows 2
    await expect(bikeLightButton).toContainText('Remove');
    await expect(cartBadge).toHaveText('2');

    // Step 4: Verify cart contains 2 items
    const cartLink = page.locator('a.shopping_cart_link');
    await expect(cartLink).toBeVisible();
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toHaveText('2');
  });

  test('TC004: Remove one product and verify cart contents', async ({ page }) => {
    // Step 1: Login and add both products to cart
    await login(page);
    
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    const bikeLightButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    await backpackButton.click();
    await bikeLightButton.click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');

    // Step 2: Navigate to cart page
    const cartLink = page.locator('a.shopping_cart_link');
    await cartLink.click();
    
    await page.waitForURL(/.*cart/);
    
    const cartContainer = page.locator('.cart_container');
    await expect(cartContainer).toBeVisible();
    
    // Verify both items are in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    // Step 3: Click Remove for Backpack
    const removeButtons = page.locator('.cart_item button');
    const firstRemoveButton = removeButtons.first();
    
    await firstRemoveButton.click();
    
    // Verify Backpack is removed and cart count decreases to 1
    await expect(cartItems).toHaveCount(1);

    // Step 4: Verify Bike Light remains at $9.99
    const itemNames = page.locator('.inventory_item_name');
    const bikeLightName = await itemNames.first().textContent();
    expect(bikeLightName).toContain('Sauce Labs Bike Light');
    
    const prices = page.locator('.inventory_item_price');
    const priceText = await prices.first().textContent();
    expect(priceText).toContain('$9.99');
  });
});