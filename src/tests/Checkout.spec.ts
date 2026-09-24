import { test, expect } from '../fixtures/Test-base';

test.describe('TTACart - Checkout', () => {
    test.beforeEach(async ({ loginPage, productListPage, cartPage }) => {
        await loginPage.open();
        await loginPage.loginAs('standard_user', 'tta_secret');
        await productListPage.assertLoaded();
        await productListPage.addProductToCart('TTA Bike Light');
        await cartPage.open();
        await cartPage.checkout();
    });

    test('CHECKOUT-001 - Verify customer details can be submitted', async ({ customerDetailsPage, orderSummaryPage }) => {
        await customerDetailsPage.enterCustomerDetails('Test', 'User', '12345');
        await customerDetailsPage.continue();
        await orderSummaryPage.assertLoaded();
    });

    test('CHECKOUT-002 - Verify order summary shows totals and finish action', async ({ customerDetailsPage, orderSummaryPage }) => {
        await customerDetailsPage.enterCustomerDetails('Test', 'User', '12345');
        await customerDetailsPage.continue();

        await expect(orderSummaryPage.itemTotal).toContainText('$9.99');
        await expect(orderSummaryPage.tax).toContainText('$0.80');
        await expect(orderSummaryPage.total).toContainText('$10.79');
        await expect(orderSummaryPage.buttonFinish).toBeEnabled();
    });

    test('CHECKOUT-003 - Verify completing checkout shows the order confirmation', async ({ customerDetailsPage, orderSummaryPage, finalOrderStatusPage }) => {
        await customerDetailsPage.enterCustomerDetails('Test', 'User', '12345');
        await customerDetailsPage.continue();
        await orderSummaryPage.finish();
        await finalOrderStatusPage.assertLoaded();

        await expect(finalOrderStatusPage.orderConfirmation).toHaveText('Thank you for your order!');
    });

    test('CHECKOUT-004 - Verify Back Home returns to the product list after checkout', async ({ customerDetailsPage, orderSummaryPage, finalOrderStatusPage, productListPage }) => {
        await customerDetailsPage.enterCustomerDetails('Test', 'User', '12345');
        await customerDetailsPage.continue();
        await orderSummaryPage.finish();
        await finalOrderStatusPage.backHome();
        await productListPage.assertLoaded();
    });
});
