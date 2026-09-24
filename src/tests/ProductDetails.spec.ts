import { test, expect } from '../fixtures/Test-base';

test.describe('TTACart - Product Details Page', () => {
    test.beforeEach(async ({ loginPage, productListPage }) => {
        await loginPage.open();
        await loginPage.loginAs('standard_user', 'tta_secret');
        await productListPage.assertLoaded();
    });

    test('DETAILS-001 - Verify a product detail page displays the selected product', async ({ productListPage, productDetailsPage }) => {
        await productListPage.openProduct('TTA Bike Light');
        await productDetailsPage.assertLoaded();

        await expect(productDetailsPage.productName).toHaveText('TTA Bike Light');
        await expect(productDetailsPage.productDescription).toContainText('Water-resistant');
        await expect(productDetailsPage.productPrice).toHaveText('$9.99');
    });

    test('DETAILS-002 - Verify a product can be added to the cart from its detail page', async ({ productListPage, productDetailsPage, page }) => {
        await productListPage.openProduct('TTA Bike Light');
        await productDetailsPage.addToCart();

        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });

    test('DETAILS-003 - Verify Back returns to the product list', async ({ productListPage, productDetailsPage }) => {
        await productListPage.openProduct('TTA Bike Light');
        await productDetailsPage.goBack();
        await productListPage.assertLoaded();
    });
});
