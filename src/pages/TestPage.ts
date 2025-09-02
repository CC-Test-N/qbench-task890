import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestPage extends BasePage {
  private selectors: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    
    // Define all selectors as Locators
    this.selectors = {
      // Navigation
      workflowLink: page.getByText('Workflow'),
      ordersLink: page.getByText('Orders'),
      allOrdersLink: page.getByRole('link', { name: 'All' }),
      ordersNavLink: page.getByRole('link', { name: 'Orders' }),
      
      // Test selection
      aminoAcidsOption: page.locator('[id="-704891427-selectable"]').getByText('- Amino Acids'),
      selectAllButton: page.locator('.ms-all-button.btn.btn-default.waves-effect.waves-light'),
      testCheckbox: page.locator('#qbenchAssaysPanelSelectionTable > tbody:nth-child(1) > tr:nth-child(2) > th:nth-child(1) > input[type=checkbox]'),
      
      // Buttons
      assignButton: page.getByRole('button', { name: 'Assign' }),
      submitButton: page.getByRole('button', { name: 'Submit' }),
      saveTestsButton: page.getByRole('button', { name: 'Save Tests' }),
      
      // Test elements
      testCountText: page.getByText('3 tests').first(),
      testPanel: page.locator('.test-panel, .assays-panel'),
      testTable: page.locator('#qbenchAssaysPanelSelectionTable')
    };
  }

  // Dynamic selectors
  private testCountPattern(count: string): Locator {
    return this.page.getByText(count).first();
  }

  // Navigation to existing order
  async navigateToExistingOrder(): Promise<void> {
    await this.clickAndWait(this.selectors.workflowLink);
    await this.clickAndWait(this.selectors.ordersLink);
    await this.clickAndWait(this.selectors.allOrdersLink.first());
    await this.waitForPageLoad(this.testData.timeouts.medium);

    // Click on the order
    const customer = this.testData.orders.default.customer;
    const orderRow = this.findRowWithText(customer);
    await orderRow.getByRole('link').first().click();
    await this.waitForPageLoad();
  }

  // Add test to sample
  async addAminoAcidsTest(): Promise<void> {
    // Select Amino Acids test
    await this.selectors.aminoAcidsOption.click();
    
    // Select all options
    await this.clickAndWait(this.selectors.selectAllButton);
    
    // Assign test
    await this.clickAndWait(this.selectors.assignButton);
    
    // Select specific test checkbox
    await this.selectors.testCheckbox.click();
    
    // Submit and save
    await this.clickAndWait(this.selectors.submitButton);
    await this.selectors.saveTestsButton.click();
    await this.waitForPageLoad();
    
    console.log(this.testData.validation.messages.testAdded);
  }

  // Navigate back to orders for verification
  async navigateToOrdersList(): Promise<void> {
    await this.selectors.ordersNavLink.click();
    await this.waitForPageLoad();
  }

  // Verify test was added
  async verifyTestAdded(): Promise<boolean> {
    try {
      const expectedCount = this.testData.tests.aminoAcids.expectedCount;
      const testCount = this.testCountPattern(expectedCount);
      
      await testCount.waitFor({ 
        state: 'visible', 
        timeout: this.testData.timeouts.extraLong 
      });
      
      return true;
    } catch (error) {
      console.error('Test verification failed:', error);
      return false;
    }
  }

  // Helper method to check if test panel is open
  async isTestPanelOpen(): Promise<boolean> {
    try {
      return await this.selectors.testPanel.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  // Helper method to get test count
  async getTestCount(): Promise<number> {
    try {
      const countText = await this.selectors.testCountText.textContent();
      if (countText) {
        const match = countText.match(/(\d+)\s*test/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return 0;
    } catch {
      return 0;
    }
  }
}