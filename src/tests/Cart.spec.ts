import { test, expect } from '../fixtures/Test-base';

test.describe('TTACart - Cart Page', () => {
    test.beforeEach(async ({ loginPage, productListPage, cartPage }) => {
        await loginPage.open();
        await loginPage.loginAs('standard_user', 'tta_secret');
        await productListPage.assertLoaded();
        await productListPage.addProductToCart('TTA Bike Light');
        await cartPage.open();
    });

    test('CART-005 - Verify a cart item can be removed', async ({ cartPage }) => {
        await expect(cartPage.getItem('TTA Bike Light')).toBeVisible();

        await cartPage.removeProduct('TTA Bike Light');

        await expect(cartPage.getItem('TTA Bike Light')).toHaveCount(0);
        await expect.poll(() => cartPage.getItemCount()).toBe(0);
    });

    test('CART-006 - Verify Continue Shopping returns to the product list', async ({ cartPage, productListPage }) => {
        await cartPage.continueShopping();
        await productListPage.assertLoaded();
    });

    test('CART-007 - Verify Checkout opens customer details', async ({ cartPage, customerDetailsPage }) => {
        await cartPage.checkout();
        await customerDetailsPage.assertLoaded();
    });
});
