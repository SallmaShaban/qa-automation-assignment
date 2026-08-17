import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Handles login functionality
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginContainer = page.locator('.login_container');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/');
    await this.loginContainer.waitFor({ state: 'visible' });
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Wait for navigation or error message
    await this.page.waitForURL(/\/(inventory|.*)/);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return (await this.errorMessage.isVisible()) ?? false;
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent() ?? '';
  }

  /**
   * Check if login page is visible
   */
  async isLoginPageVisible(): Promise<boolean> {
    return (await this.loginContainer.isVisible()) ?? false;
  }
}
