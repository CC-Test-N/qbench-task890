import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../utils/env';

export class LoginPage extends BasePage {
  private selectors: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    
    // Define all selectors as Locators
    this.selectors = {
      emailInput: page.getByRole('textbox', { name: 'Email' }),
      passwordInput: page.getByRole('textbox', { name: 'Password' }),
      loginButton: page.getByRole('button', { name: 'Log In' }),
      dashboard: page.getByText('Dashboard'),
      logoutLink: page.locator('a[href="/logout"]'),
      userProfile: page.locator('[data-qa="user-profile"]'),
      errorMessage: page.locator('.error-message, .alert-danger')
    };
  }

  async navigate(): Promise<void> {
    await this.page.goto(ENV.BASE_URL);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.selectors.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.fillInput(this.selectors.emailInput, email);
    await this.fillInput(this.selectors.passwordInput, password);
    
    try {
      await this.selectors.loginButton.click({ timeout: 5000 });
    } catch {
      await this.selectors.passwordInput.press('Enter');
    }
    
    await this.page.waitForTimeout(3000);
    await this.waitForPageLoad();
  }

  async loginAsTestUser(): Promise<void> {
    await this.navigate();
    
    const currentUrl = this.page.url();
    if (!currentUrl.includes('login') && currentUrl !== ENV.BASE_URL) {
      return;
    }
    
    await this.login(ENV.CREDENTIALS.email, ENV.CREDENTIALS.password);
  }

  async logout(): Promise<void> {
    if (await this.selectors.logoutLink.isVisible()) {
      await this.selectors.logoutLink.click();
      await this.waitForPageLoad();
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const currentUrl = this.page.url();
      
      if (!currentUrl.includes('login') && currentUrl !== ENV.BASE_URL) {
        return true;
      }
      
      return await this.selectors.dashboard.isVisible({ timeout: 5000 }) ||
             await this.selectors.userProfile.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}