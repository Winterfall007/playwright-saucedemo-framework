import { Page } from '@playwright/test';

export class CartPage {

  constructor(private page: Page) {}

  async removeItemFromCart(item: string) {

    await this.page.click(`[data-test="remove-${item}"]`);
  }
  async checkout() {

    await this.page.click('[data-test="checkout"]');
  }
}