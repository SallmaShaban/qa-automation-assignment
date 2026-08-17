import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage - Handles checkout flow
 */
export class CheckoutPage extends BasePage {
  // Locators for Checkout Step One
  readonly checkoutStepOne: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Locators for Checkout Step Two
  readonly checkoutStepTwo: Locator;
  readonly finishButton: Locator;

  // Locators for Order Confirmation
  readonly confirmationContainer: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Checkout Step One
    this.checkoutStepOne = page.locator('.checkout_info');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Checkout Step Two
    this.checkoutStepTwo = page.locator('.checkout_summary_container');
    this.finishButton = page.locator('[data-test="finish"]');

    // Order Confirmation
    this.confirmationContainer = page.locator('.checkout_complete_container');
    this.confirmationMessage = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Wait for checkout step one
   */
  async waitForCheckoutStepOne() {
    await this.checkoutStepOne.waitFor({ state: 'visible' });
  }

  /**
   * Fill in checkout information
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Continue to step two
   */
  async continueToStepTwo() {
    await this.continueButton.click();
  }

  /**
   * Wait for checkout step two
   */
  async waitForCheckoutStepTwo() {
    await this.checkoutStepTwo.waitFor({ state: 'visible' });
  }

  /**
   * Finish checkout
   */
  async finishCheckout() {
    await this.finishButton.click();
  }

  /**
   * Wait for order confirmation
   */
  async waitForOrderConfirmation() {
    await this.confirmationContainer.waitFor({ state: 'visible' });
  }

  /**
   * Get confirmation message
   */
  async getConfirmationMessage(): Promise<string> {
    await this.confirmationMessage.waitFor({ state: 'visible' });
    return await this.confirmationMessage.textContent() ?? '';
  }

  /**
   * Check if order is confirmed
   */
  async isOrderConfirmed(): Promise<boolean> {
    try {
      await this.confirmationContainer.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Go back home
   */
  async backHome() {
    await this.backHomeButton.click();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return (await this.errorMessage.isVisible()) ?? false;
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() ?? '';
  }
}
