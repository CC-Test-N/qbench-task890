import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { SamplesPage } from '../../src/pages/SamplesPage';
import { OrdersPage } from '../../src/pages/OrdersPage';

test.describe('Sample Management', () => {
  let loginPage: LoginPage;
  let samplesPage: SamplesPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    samplesPage = new SamplesPage(page);
    ordersPage = new OrdersPage(page);
    await loginPage.loginAsTestUser();
  });

  test('Should create a new sample and validate it appears in the list', async ({ page }) => {

    await test.step('Create a new Sample with test data', async () => {
      await ordersPage.navigateToAllOrders();
      await samplesPage.createNewSample();
    });

    await test.step('Validate that the Sample appears in the list after saving', async () => {
      const sampleExists = await samplesPage.validateSampleInList();
      expect(sampleExists).toBeTruthy();
    });

    // NO CLEANUP - Sample will be used by test.spec.ts
  });
});