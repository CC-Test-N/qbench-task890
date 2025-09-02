import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrdersPage } from '../../src/pages/OrdersPage';

test.describe('Order Management', () => {
  let loginPage: LoginPage;
  let ordersPage: OrdersPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    ordersPage = new OrdersPage(page);
    await loginPage.loginAsTestUser();
  });

  test('Should create a new order and validate it appears in the list', async ({ page }) => {

    await test.step('Navigate to the Orders module', async () => {
      await ordersPage.navigateToOrdersModule();
    });

    await test.step('Create a new Order with dummy data', async () => {
      await ordersPage.createNewOrder();
    });

    await test.step('Validate that the Order appears in the list after saving', async () => {
      const orderExists = await ordersPage.validateOrderInList();
      expect(orderExists).toBeTruthy();
    });
    
    // NO CLEANUP - Order will be used by sample.spec.ts
  });
});