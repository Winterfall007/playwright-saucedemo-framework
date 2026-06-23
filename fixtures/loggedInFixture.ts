import { test as base, Page } from '@playwright/test';

import { LoginPage } from '../pages/login.page';

type MyFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({

  loggedInPage: async ({ page }, use) => {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

    await use(page);
  },
});