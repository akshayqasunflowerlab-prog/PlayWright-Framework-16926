import { test as base } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { ProductListPage } from '../pages/ProductListPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutOneCustomerDetailsPage } from '../pages/Checkout-One_CustomerDetailsPage';
import { CheckoutTwoOrderSummaryPage } from '../pages/Checkout-Two_OrderSummaryPage';
import { CheckoutFinalOrderStatusPage } from '../pages/Checkout-Final_OrderStatusPage';

export type PageObjects = {
    loginPage: LoginPage;
    productListPage: ProductListPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
    customerDetailsPage: CheckoutOneCustomerDetailsPage;
    orderSummaryPage: CheckoutTwoOrderSummaryPage;
    finalOrderStatusPage: CheckoutFinalOrderStatusPage;
};

export const test = base.extend<PageObjects>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productListPage: async ({ page }, use) => {
        await use(new ProductListPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    customerDetailsPage: async ({ page }, use) => {
        await use(new CheckoutOneCustomerDetailsPage(page));
    },
    orderSummaryPage: async ({ page }, use) => {
        await use(new CheckoutTwoOrderSummaryPage(page));
    },
    finalOrderStatusPage: async ({ page }, use) => {
        await use(new CheckoutFinalOrderStatusPage(page));
    },
});

export { expect } from '@playwright/test';
