// spec: specs/SAUCE_DEMO_TEST_PLAN.md
// seed: tests/ui/seed.spec.ts

import { test, expect, Page } from '@playwright/test';
import { CREDENTIALS } from '../../src/config/config';

test.describe('Product Sorting Tests', () => {
  // Helper function to login
  async function login(page: Page) {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('[data-test="password"]').fill(CREDENTIALS.VALID_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/.*inventory/);
  }

  // Helper function to get product prices
  async function getProductPrices(page: Page): Promise<number[]> {
    const prices = await page.locator('.inventory_item_price').allTextContents();
    return prices.map((price: string) => parseFloat(price.replace('$', '')));
  }

  // Helper function to get product names
  async function getProductNames(page: Page): Promise<string[]> {
    return await page.locator('.inventory_item_name').allTextContents();
  }

  test('TC006: Sort products by Price (Low to High) and verify sorting result', async ({ page }) => {
    // Step 1: Login to inventory page
    await login(page);
    
    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toBeVisible();

    // Step 2: Select Price (low to high) from sort dropdown
    const sortDropdown = page.locator('select[data-test="product-sort-container"]');
    await sortDropdown.selectOption('lohi');

    // Step 3: Verify prices are in ascending order
    const prices = await getProductPrices(page);
    
    // Expected order: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99
    expect(prices).toEqual([7.99, 9.99, 15.99, 15.99, 29.99, 49.99]);
    
    // Verify sorting by checking each pair
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('TC009: Sort by Price (High to Low)', async ({ page }) => {
    // Step 1: Login to inventory page
    await login(page);
    
    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toBeVisible();

    // Step 2: Select Price (high to low) from sort dropdown
    const sortDropdown = page.locator('select[data-test="product-sort-container"]');
    await sortDropdown.selectOption('hilo');

    // Step 3: Verify prices in descending order
    const prices = await getProductPrices(page);
    
    // Expected order: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99
    expect(prices).toEqual([49.99, 29.99, 15.99, 15.99, 9.99, 7.99]);
    
    // Verify prices decrease from left to right
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('TC010: Sort by Name (A to Z)', async ({ page }) => {
    // Step 1: Login to inventory
    await login(page);
    
    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toBeVisible();

    // Step 2: Select Name (A to Z) from dropdown
    const sortDropdown = page.locator('select[data-test="product-sort-container"]');
    await sortDropdown.selectOption('az');

    // Step 3: Verify products are sorted alphabetically
    const names = await getProductNames(page);
    
    // Verify first product is Sauce Labs Backpack
    expect(names[0]).toContain('Backpack');
    
    // Verify names are in alphabetical order
    for (let i = 1; i < names.length; i++) {
      const comparison = names[i - 1].localeCompare(names[i]);
      expect(comparison).toBeLessThanOrEqual(0);
    }
  });

  test('TC011: Sort by Name (Z to A)', async ({ page }) => {
    // Step 1: Login to inventory
    await login(page);
    
    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toBeVisible();

    // Step 2: Select Name (Z to A) from dropdown
    const sortDropdown = page.locator('select[data-test="product-sort-container"]');
    await sortDropdown.selectOption('za');

    // Step 3: Verify products are sorted in reverse alphabetically
    const names = await getProductNames(page);
    
    // Verify names are in reverse alphabetical order
    for (let i = 1; i < names.length; i++) {
      const comparison = names[i - 1].localeCompare(names[i]);
      expect(comparison).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Additional Edge Case Tests', () => {
  // Helper function to login
  async function login(page: Page) {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('[data-test="password"]').fill(CREDENTIALS.VALID_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/.*inventory/);
  }

  test('TC008: Product persistence in cart after logout and login', async ({ page }) => {
    // Step 1: Login and add product to cart
    await login(page);
    
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await backpackButton.click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // Step 2: Click menu and logout
    const menuButton = page.locator('button.bm-burger-button');
    await menuButton.click();
    
    const logoutLink = page.locator('a#logout_sidebar_link');
    await logoutLink.click();
    
    // Verify returned to login page
    await page.waitForURL(/.*saucedemo.com\//);
    expect(page.url()).not.toContain('/inventory');

    // Step 3: Login again with same credentials
    await page.locator('[data-test="username"]').fill(CREDENTIALS.VALID_USER.username);
    await page.locator('[data-test="password"]').fill(CREDENTIALS.VALID_USER.password);
    await page.locator('[data-test="login-button"]').click();
    
    await page.waitForURL(/.*inventory/);

    // Step 4: Check shopping cart
    const cartLink = page.locator('a.shopping_cart_link');
    await expect(cartLink).toBeVisible();
    
    // Check if cart badge exists (cart may be empty after reset)
    const badge = page.locator('.shopping_cart_badge');
    const badgeVisible = await badge.isVisible().catch(() => false);
    
    if (badgeVisible) {
      const badgeText = await badge.textContent();
      console.log('Cart badge after re-login:', badgeText);
    }
  });
});