import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrdersPage } from '../../src/pages/OrdersPage';
import { TestPage } from '../../src/pages/TestPage';

// Import test data as a module
const testData = {
  orders: {
    default: {
      customer: 'Dunder Mifflin',
      projectManager: 'Melvin Caraang'
    }
  },
  timeouts: {
    short: 1000,
    medium: 2000,
    long: 5000
  }
};

test.describe('Visual Regression Tests', () => {
  let loginPage: LoginPage;
  let ordersPage: OrdersPage;
  let testPage: TestPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    ordersPage = new OrdersPage(page);
    testPage = new TestPage(page);
    
    await loginPage.loginAsTestUser();
  });

  test('Order Details Page Visual Snapshot', async ({ page }) => {
    await test.step('Navigate to order details', async () => {
      await ordersPage.navigateToAllOrders();
      
      // Find and click on an order
      const customer = testData.orders.default.customer;
      const orderRow = page.locator('tr', { has: page.getByText(customer) }).first();
      
      if (await orderRow.isVisible({ timeout: 5000 })) {
        await orderRow.getByRole('link').first().click();
        await page.waitForLoadState('networkidle');
      } else {
        // If no order exists, create one first
        await ordersPage.createNewOrder();
        await ordersPage.navigateToAllOrders();
        const newOrderRow = page.locator('tr', { has: page.getByText(customer) }).first();
        await newOrderRow.getByRole('link').first().click();
        await page.waitForLoadState('networkidle');
      }
    });

    await test.step('Capture order details visual snapshot', async () => {
      // Wait for dynamic content to load
      await page.waitForTimeout(testData.timeouts.medium);
      
      // Take screenshot with masked dynamic elements
      await expect(page).toHaveScreenshot('order-details.png', {
        fullPage: false,
        mask: [
          page.locator('.timestamp'),
          page.locator('.date'),
          page.locator('.time'),
          page.locator('[data-testid="order-number"]'),
          page.locator('.order-id')
        ],
        maxDiffPixels: 100,
        animations: 'disabled'
      });
    });
  });

  test('Sample Table Visual Snapshot', async ({ page }) => {
    await test.step('Navigate to samples list', async () => {
      await page.getByText('Workflow').click();
      await page.waitForTimeout(1000);
      await page.locator('#navigation').getByText('Samples').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(testData.timeouts.medium);
    });

    await test.step('Capture sample table visual snapshot', async () => {
      // Take screenshot of the sample table
      await expect(page).toHaveScreenshot('sample-table.png', {
        fullPage: false,
        mask: [
          page.locator('.timestamp'),
          page.locator('.date'),
          page.locator('.lab-number'),
          page.locator('[data-testid="sample-id"]')
        ],
        maxDiffPixels: 100,
        animations: 'disabled'
      });
    });
  });

  test('Test Configuration Panel Visual Snapshot', async ({ page }) => {
    await test.step('Navigate to test configuration', async () => {
      await testPage.navigateToExistingOrder();
    });

    await test.step('Open test selection panel', async () => {
      // Try to open the test panel
      const aminoAcidsOption = page
        .locator('[id="-704891427-selectable"]')
        .getByText('- Amino Acids');
      
      if (await aminoAcidsOption.isVisible({ timeout: 5000 })) {
        await aminoAcidsOption.click();
        await page.waitForTimeout(testData.timeouts.short);
      }
    });

    await test.step('Capture test panel visual snapshot', async () => {
      await expect(page).toHaveScreenshot('test-configuration-panel.png', {
        fullPage: false,
        mask: [
          page.locator('.timestamp'),
          page.locator('.test-id'),
          page.locator('[data-testid="test-number"]')
        ],
        maxDiffPixels: 100,
        animations: 'disabled'
      });
    });
  });

  test('Responsive Design Visual Check', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    await test.step('Navigate to orders list', async () => {
      await ordersPage.navigateToAllOrders();
    });

    for (const viewport of viewports) {
      await test.step(`Capture ${viewport.name} viewport`, async () => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });
        
        await page.waitForTimeout(testData.timeouts.short);
        
        await expect(page).toHaveScreenshot(`orders-list-${viewport.name}.png`, {
          fullPage: true,
          mask: [
            page.locator('.timestamp'),
            page.locator('.date'),
            page.locator('.order-number')
          ],
          maxDiffPixels: 100,
          animations: 'disabled'
        });
      });
    }
  });

  test('Full E2E Flow Visual Documentation', async ({ page }) => {
    const screenshotOptions = {
      fullPage: false,
      mask: [
        page.locator('.timestamp'),
        page.locator('.date'),
        page.locator('.dynamic-id')
      ],
      maxDiffPixels: 100,
      animations: 'disabled' as const
    };

    await test.step('1. Orders List View', async () => {
      await ordersPage.navigateToAllOrders();
      await expect(page).toHaveScreenshot('e2e-1-orders-list.png', screenshotOptions);
    });

    await test.step('2. Create New Order', async () => {
      await page.getByRole('link', { name: '+ New Order' }).click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('e2e-2-new-order-form.png', screenshotOptions);
    });

    await test.step('3. Order Details After Creation', async () => {
      // Fill and save order
      await page.getByRole('link', { name: 'Select Customer' }).click();
      await page.getByRole('option', { name: `— ${testData.orders.default.customer}` }).click();
      await page.getByRole('link', { name: ' special fields' }).click();
      await page.getByRole('link', { name: 'Select User' }).click();
      await page.getByRole('option', { name: testData.orders.default.projectManager }).click();
      await page.getByRole('button', { name: 'Save Order' }).click();
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('e2e-3-order-saved.png', screenshotOptions);
    });

    await test.step('4. Sample Creation View', async () => {
      await page.getByRole('button', { name: '+ Create New Samples' }).click();
      await page.waitForTimeout(testData.timeouts.short);
      await expect(page).toHaveScreenshot('e2e-4-sample-creation.png', screenshotOptions);
    });
  });
});