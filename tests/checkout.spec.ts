import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CheckoutPage } from '../pages/checkout.page';
import { validUser } from '../data/users';
import { LoginUser } from '../data/users';



test.beforeEach(async ({ page }) => {
page.on('response', async (response) => {

  if (response.url().includes('inventory')) {

    console.log('Inventory API detected');

    console.log(
  `RESPONSE: ${response.status()} ${response.url()}`
);
  }
  });
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await inventory.validateLoaded();
});

test('user can complete checkout flow', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addBackpackToCart();
 
  //const inventoryResponse = page.waitForResponse(response => response.url().includes('inventory'));
  //const response = await inventoryResponse;
  //expect(response.status()).toBe(200);
  await inventory.goToCart();
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
  await expect(page.locator('.inventory_item_name')).toContainText('Backpack');
  await inventory.goToCheckout();
  const checkout = new CheckoutPage(page);

  await checkout.completeCheckout(
  validUser.firstName,
  validUser.lastName,
  validUser.zip
);

  await checkout.continue();
  await checkout.finish();

  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});