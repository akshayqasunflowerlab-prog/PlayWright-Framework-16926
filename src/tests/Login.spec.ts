import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('TTACart - Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    test('TC_LOGIN_001 - Verify valid credentials are accepted', async ({ page }) => {
        await loginPage.loginAs('standard_user', 'tta_secret');
        await expect(page).toHaveURL('./playwright/ttacart/inventory');
    });

    test('TC_LOGIN_002 - Verify locked-out user cannot login', async () => {
        await loginPage.loginAs('locked_out_user', 'tta_secret');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
    });

    test('TC_LOGIN_003 - Verify invalid credentials are rejected', async () => {
        await loginPage.loginAs('invalid_user', 'invalid_password');
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    });

    test('TC_LOGIN_004 - Verify performance-glitch user can login successfully', async ({ page }) => {
        await loginPage.loginAs('performance_glitch_user', 'tta_secret');
        await expect(page).toHaveURL('./playwright/ttacart/inventory');
        await expect(page.locator("#inventory-grid")).toBeVisible();
        await expect(page.getByRole("button", { name: "Login" })).not.toBeVisible();
    });

});

/**

Login - Verify valid credentials are accepted and user is redirected to the Products List page 
Login - Verify locked-out user cannot login (Epic sadface: Sorry, this user has been locked out.)
Login - Verify invalid credentials are rejected (Epic sadface: Username and password do not match any user in this service)
Login - Verify performance-glitch user can login successfully 

**/