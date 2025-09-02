import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrdersPage } from '../../src/pages/OrdersPage';
import { TestPage } from '../../src/pages/TestPage';
import { SamplesPage } from '../../src/pages/SamplesPage';
import testData from '../../src/data/test-data.json' assert { type: 'json' };

test.describe('Test Management', () => {
  let loginPage: LoginPage;
  let ordersPage: OrdersPage;
  let testPage: TestPage;
  let samplesPage: SamplesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    ordersPage = new OrdersPage(page);
    testPage = new TestPage(page);
    samplesPage = new SamplesPage(page);

    await loginPage.loginAsTestUser();
  });

  test('Should add test to existing sample and cleanup all', async () => {
    
    await test.step('Navigate to existing order with sample', async () => {
      await testPage.navigateToExistingOrder();
    });
    
    await test.step('Add Amino Acids test to the sample', async () => {
      await testPage.addAminoAcidsTest();
    });
    
    await test.step('Verify test was added successfully', async () => {
      await testPage.navigateToOrdersList();
      const isTestAdded = await testPage.verifyTestAdded();
      expect(isTestAdded).toBeTruthy();
    });
    
    await test.step('Cleanup all created data', async () => {
      await ordersPage.cleanupOrder();
      console.log(testData.validation.messages.cleanupComplete);
    });
  });
});