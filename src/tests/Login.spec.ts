import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('TTACart - Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    test('logs in with valid credentials @p0', async ({ page }) => {
        await loginPage.loginAs('standard_user', 'tta_secret');

        await expect(
            page.locator('[data-test="login-button"]'),
        ).toBeHidden();
    });
});