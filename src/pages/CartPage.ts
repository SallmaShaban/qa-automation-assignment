import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Handles shopping cart operations
 */
export class CartPage extends BasePage {
  // Locators
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.locator('.cart_container');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Wait for cart page to load
   */
  async waitForCartPage() {
    await this.cartContainer.waitFor({ state: 'visible' });
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.cartItems.count();
    for (let i = 0; i < count; i++) {
      const name = await this.cartItems.nth(i).locator('.inventory_item_name').textContent();
      if (name) names.push(name);
    }
    return names;
  }

  /**
   * Remove item from cart by index
   */
  async removeItemByIndex(index: number) {
    const removeButton = this.cartItems.nth(index).locator('button');
    await removeButton.click();
  }

  /**
   * Remove item from cart by name
   */
  async removeItemByName(productName: string) {
    const item = this.cartItems.filter({ has: this.page.locator(`text=${productName}`) });
    await item.locator('button').click();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Check if specific product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const count = await this.cartItems.count();
    for (let i = 0; i < count; i++) {
      const name = await this.cartItems.nth(i).locator('.inventory_item_name').textContent();
      if (name === productName) {
        return true;
      }
    }
    return false;
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
