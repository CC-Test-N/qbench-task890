import { Page, Locator } from '@playwright/test';
import testData from '../data/test-data.json' assert { type: 'json' };

export abstract class BasePage {
  protected page: Page;
  protected testData = testData;
  
  constructor(page: Page) {
    this.page = page;
  }

  // Common helper methods for all pages
  protected async clickAndWait(element: Locator, waitAfter?: number): Promise<void> {
    const wait = waitAfter || this.testData.timeouts.short;
    await element.click();
    await this.page.waitForTimeout(wait);
  }

  protected async waitForPageLoad(additionalWait?: number): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    if (additionalWait) {
      await this.page.waitForTimeout(additionalWait);
    }
  }

  protected async fillInput(element: Locator, value: string): Promise<void> {
    await element.click();
    await element.fill(value);
  }

  protected findRowWithText(text: string): Locator {
    return this.page.locator('tr', { has: this.page.getByText(text) }).first();
  }

  protected generateUniqueId(prefix: string): string {
    return `${prefix}-${Date.now()}`;
  }

  // Visual assertion helper
  async captureSnapshot(name: string, options?: any): Promise<void> {
    await this.page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage: options?.fullPage || false,
      ...options
    });
  }

  async compareSnapshot(name: string, options?: any): Promise<void> {
    await this.page.screenshot({
      path: `tests/screenshots/${name}-actual.png`,
      fullPage: options?.fullPage || false,
      ...options
    });
  }
}