// spec: specs/SAUCE_DEMO_TEST_PLAN.md

import { test, expect, Page } from '@playwright/test';
import { CREDENTIALS } from '../../src/config/config';

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
    const backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(backpackAddButton).toBeVisible();
    await backpackAddButton.click();
    
    // Verify button changes to Remove and cart badge shows 1
    const backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(backpackRemoveButton).toBeVisible();
    await expect(backpackRemoveButton).toHaveText('Remove');
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // Step 3: Click 'Add to Cart' for Sauce Labs Bike Light
    const bikeLightAddButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await expect(bikeLightAddButton).toBeVisible();
    await bikeLightAddButton.click();
    
    // Verify button changes to Remove and cart badge shows 2
    const bikeLightRemoveButton = page.locator('[data-test="remove-sauce-labs-bike-light"]');
    await expect(bikeLightRemoveButton).toBeVisible();
    await expect(bikeLightRemoveButton).toHaveText('Remove');
    await expect(cartBadge).toHaveText('2');

    // Step 4: Verify cart contains 2 items
    const cartLink = page.locator('a.shopping_cart_link');
    await expect(cartLink).toBeVisible();
    await expect(cartBadge).toHaveText('2');
  });

  test('TC004: Remove one product and verify cart contents', async ({ page }) => {
    // Step 1: Login and add both products to cart
    await login(page);
    
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');

    // Step 2: Navigate to cart page
    const cartLink = page.locator('a.shopping_cart_link');
    await cartLink.click();
    
    await page.waitForURL(/.*cart/);
    
    const cartContainer = page.locator('.cart_container');
    await expect(cartContainer).toBeVisible();
    await expect(page.locator('.title')).toHaveText('Your Cart');
    
    // Verify both items are in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    // Step 3: Click Remove for Backpack
    const backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(backpackRemoveButton).toBeVisible();
    await backpackRemoveButton.click();
    
    // Verify Backpack is removed and cart count decreases to 1
    await expect(cartItems).toHaveCount(1);
    await expect(cartBadge).toHaveText('1');

    // Step 4: Verify Bike Light remains at $9.99
    const itemNames = page.locator('.inventory_item_name');
    await expect(itemNames.first()).toContainText('Sauce Labs Bike Light');
    
    const prices = page.locator('.inventory_item_price');
    await expect(prices.first()).toContainText('$9.99');
  });
});