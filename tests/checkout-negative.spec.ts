import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CheckoutPage } from '../pages/checkout.page';
import { invalidUsers } from '../data/users';


test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await page.waitForTimeout(500);
});

test.describe('Checkout Validation', () => {

  for (const user of invalidUsers) {
    test(`fails: ${user.name}`, async ({ page }) => {
      const inventory = new InventoryPage(page);
      const checkout = new CheckoutPage(page);

      await inventory.addBackpackToCart();
      await inventory.goToCart();
      await inventory.goToCheckout();

      await checkout.completeCheckout(
        user.data.firstName,
        user.data.lastName,
        user.data.zip
      );
      
      await checkout.continue();
      await expect(page.locator('[data-test="error"]')).toBeVisible();
    });
  }

  test('fails when all fields are missing', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addBackpackToCart();
    await inventory.goToCart();
    await inventory.goToCheckout();

    await checkout.continue();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Error');
  });

});