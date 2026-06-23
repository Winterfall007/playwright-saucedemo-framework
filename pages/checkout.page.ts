import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async completeCheckout(first: string, last: string, zip: string) {
    await this.page.fill('#first-name', first);
    await this.page.fill('#last-name', last);
    await this.page.fill('#postal-code', zip);
  }

  async continue() {
    await this.page.click('[data-test="continue"]');
  }

  async finish() {
    await this.page.click('[data-test="finish"]');
  }

  async returnToProducts() {
    await this.page.click('[data-test="back home"]');
  }
}