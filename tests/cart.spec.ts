import { expect } from '@playwright/test';
import { test } from '../fixtures/loggedInFixture';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';




test.describe('Shopping cart', () => {
  test('adds multiple items and shows them in the cart', async ({
    loggedInPage: page,
  }) => {
    const inventory = new InventoryPage(page);

    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.addItemToCart('sauce-labs-bike-light');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await inventory.goToCart();

    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
  });

  test('removes items from the cart and updates the badge', async ({
    loggedInPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    

    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.addItemToCart('sauce-labs-bike-light');
    await inventory.goToCart();

    await cart.removeItemFromCart('sauce-labs-backpack');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('.cart_item .inventory_item_name'))
      .toHaveText('Sauce Labs Bike Light');

    await cart.removeItemFromCart('sauce-labs-bike-light');

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('keeps cart contents after continuing shopping', async ({
    loggedInPage: page,
  }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addItemToCart('sauce-labs-backpack');
    await inventory.goToCart();

    await cart.continueShopping();

    await inventory.validateLoaded();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await inventory.goToCart();

    await expect(page.locator('.cart_item .inventory_item_name'))
      .toHaveText('Sauce Labs Backpack');
        
  });

  
});