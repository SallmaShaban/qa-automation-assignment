import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * InventoryPage - Handles product listing and cart operations
 */
export class InventoryPage extends BasePage {
  // Locators
  readonly inventoryContainer: Locator;
  readonly productList: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('.inventory_container');
    this.productList = page.locator('.inventory_list');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('a.shopping_cart_link');
  }

  /**
   * Wait for inventory page to load
   */
  async waitForInventoryPage() {
    await this.inventoryContainer.waitFor({ state: 'visible' });
  }

  /**
   * Get product button by product ID
   */
  getProductButton(productId: string): Locator {
    return this.page.locator(`[data-test="${productId}"]`);
  }

  /**
   * Add product to cart by product ID
   */
  async addProductToCart(productId: string) {
    const button = this.getProductButton(productId);
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  /**
   * Remove product from cart by product ID
   */
  async removeProductFromCart(productId: string) {
    const button = this.getProductButton(productId);
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  /**
   * Get cart badge count
   */
  async getCartCount(): Promise<number> {
    try {
      const badge = await this.cartBadge.textContent();
      return parseInt(badge ?? '0', 10);
    } catch {
      return 0;
    }
  }

  /**
   * Go to cart
   */
  async goToCart() {
    await this.cartLink.click();
  }

  /**
   * Sort products by option
   */
  async sortBy(option: string) {
    // Click the dropdown to open it
    await this.sortDropdown.click();
    
    // Click the option within the dropdown
    const optionElement = this.page.locator(`option[value="${option}"]`);
    await optionElement.click();
    
    // Wait for products list to update
    await this.productList.waitFor({ state: 'visible' });
  }

  /**
   * Get all product prices from current view
   */
  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Check if prices are sorted low to high
   */
  async arePricesSortedLowToHigh(): Promise<boolean> {
    const prices = await this.getProductPrices();
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] < prices[i - 1]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if product is in cart (button shows "Remove")
   */
  async isProductInCart(productId: string): Promise<boolean> {
    const button = this.getProductButton(productId);
    const text = await button.textContent();
    return text?.toLowerCase().includes('remove') ?? false;
  }
}
