import { Page } from '@playwright/test';

/**
 * BasePage class that all pages inherit from
 * Contains common methods and properties
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}-${Date.now()}.png` });
  }
}
