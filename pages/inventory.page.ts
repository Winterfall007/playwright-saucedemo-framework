import { expect, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addBackpackToCart() {
    await this.page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  }

  async addItemToCart(item: string) {

  await this.page.click(
    `[data-test="add-to-cart-${item}"]`
  )}

  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }

  async goToCheckout() {
  await this.page.click('[data-test="checkout"]');
  }

  async validateLoaded() {

  await expect(
    this.page.locator('.title')
  ).toContainText('Products');
}
}