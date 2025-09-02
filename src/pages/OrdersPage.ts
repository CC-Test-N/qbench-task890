import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  private selectors: Record<string, Locator>;
  private createdOrderNumber: string = '';

  constructor(page: Page) {
    super(page);
    
    // Define all selectors as Locators
    this.selectors = {
      // Navigation
      workflowLink: page.getByText('Workflow'),
      ordersLink: page.locator('#navigation').getByText('Orders'),
      allOrdersLink: page.getByRole('link', { name: 'All' }),
      ordersNavLink: page.getByRole('link', { name: 'Orders' }),
      
      // Buttons
      newOrderButton: page.getByRole('link', { name: '+ New Order' }),
      saveOrderButton: page.getByRole('button', { name: 'Save Order' }),
      deleteOrderButton: page.getByRole('button', { name: 'Delete Order' }),
      confirmYesButton: page.getByRole('button', { name: 'Yes' }),
      
      // Form fields
      customerSelectLink: page.getByRole('link', { name: 'Select Customer' }),
      specialFieldsLink: page.getByRole('link', { name: ' special fields' }),
      selectUserLink: page.getByRole('link', { name: 'Select User' }),
      
      // Table elements
      orderTable: page.locator('table.orders-table, table'),
      orderRows: page.locator('tr[data-order-id], .order-row, tbody tr')
    };
  }

  // Dynamic selectors
  private customerOption(customer: string): Locator {
    return this.page.getByRole('option', { name: `— ${customer}` });
  }

  private userOption(user: string): Locator {
    return this.page.getByRole('option', { name: user });
  }

  private orderLinkPattern(customer: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(`\\s+\\d+\\s+${customer}`) }).first();
  }

  // Navigation methods
  async navigateToOrdersModule(): Promise<void> {
    await this.clickAndWait(this.selectors.workflowLink);
    await this.clickAndWait(this.selectors.ordersLink);
    await this.waitForPageLoad();
  }

  async navigateToAllOrders(): Promise<void> {
    await this.navigateToOrdersModule();
    await this.clickAndWait(this.selectors.allOrdersLink.first());
    await this.waitForPageLoad();
  }

  // Order creation
  async createNewOrder(): Promise<void> {
    await this.clickAndWait(this.selectors.newOrderButton);
    await this.waitForPageLoad();

    // Fill required fields
    await this.selectCustomer();
    await this.fillSpecialFields();
    
    // Save order
    await this.clickAndWait(this.selectors.saveOrderButton);
    await this.waitForPageLoad(this.testData.timeouts.medium);
    
    // Extract order number if possible
    this.extractOrderNumber();
    
    // Return to orders list
    await this.navigateBackToOrders();
  }

  // Validation
  async validateOrderInList(): Promise<boolean> {
    await this.page.waitForTimeout(this.testData.timeouts.medium);

    try {
      const customer = this.testData.orders.default.customer;
      const orderLink = this.orderLinkPattern(customer);
      
      await orderLink.waitFor({ 
        state: 'visible', 
        timeout: this.testData.timeouts.extraLong 
      });
      
      // Extract order number for cleanup
      const linkText = await orderLink.textContent();
      if (linkText) {
        const match = linkText.match(/\s+(\d+)\s+/);
        if (match) {
          this.createdOrderNumber = match[1];
          console.log(`Found order number: ${this.createdOrderNumber}`);
        }
      }
      
      console.log(this.testData.validation.messages.orderCreated);
      return true;
    } catch (error) {
      console.error('Order validation failed:', error);
      return false;
    }
  }

  // Cleanup
  async cleanupOrder(): Promise<void> {
    try {
      await this.navigateBackToOrders();
      await this.page.waitForTimeout(this.testData.timeouts.medium);

      // Find and click order
      const customer = this.testData.orders.default.customer;
      const orderRow = this.findRowWithText(customer);
      const orderLink = orderRow.getByRole('link').first();
      await orderLink.click({ timeout: this.testData.timeouts.long });
      await this.waitForPageLoad();

      // Delete order
      await this.deleteCurrentOrder();
      
      console.log(`Order ${this.createdOrderNumber || customer} cleanup completed`);
    } catch (error) {
      console.error('Order cleanup failed:', error);
    }
  }

  // Private helper methods
  private async selectCustomer(): Promise<void> {
    await this.clickAndWait(this.selectors.customerSelectLink);
    
    const customer = this.testData.orders.default.customer;
    await this.clickAndWait(this.customerOption(customer));
  }

  private async fillSpecialFields(): Promise<void> {
    await this.clickAndWait(this.selectors.specialFieldsLink);
    await this.clickAndWait(this.selectors.selectUserLink);
    
    const projectManager = this.testData.orders.default.projectManager;
    await this.clickAndWait(this.userOption(projectManager));
  }

  private extractOrderNumber(): void {
    try {
      const url = this.page.url();
      const match = url.match(/order\/(\d+)|order_id=(\d+)/);
      if (match) {
        this.createdOrderNumber = match[1] || match[2];
        console.log(`Created order: ${this.createdOrderNumber}`);
      }
    } catch (error) {
      console.log('Could not extract order number');
    }
  }

  private async navigateBackToOrders(): Promise<void> {
    await this.clickAndWait(this.selectors.ordersNavLink);
    await this.waitForPageLoad();
  }

  private async deleteCurrentOrder(): Promise<void> {
    await this.clickAndWait(this.selectors.deleteOrderButton);
    await this.clickAndWait(this.selectors.confirmYesButton);
    await this.waitForPageLoad();
  }
}