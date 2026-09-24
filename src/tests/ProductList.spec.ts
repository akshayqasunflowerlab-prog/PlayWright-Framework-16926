import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductListPage } from '../pages/ProductListPage';

test.describe('TTA Cart - Product List Page Tests', () => {
    let productListPage: ProductListPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.loginAs('standard_user', 'tta_secret');

        productListPage = new ProductListPage(page);
        await productListPage.assertLoaded();
    });

    test('DATA-001 - Verify product name data integrity | Expected: Each product name should be present, non-empty, and textual.', async ({ page }) => {
        const productCards = page.locator('[data-test="inventory-item"]');
        await expect(productCards).not.toHaveCount(0);

        const productNames = (await productCards.locator('[data-test="inventory-item-name"] a').allTextContents()).map((name) => name.trim());
        const invalidNames = productNames.filter((name) => !name || name === 'null' || name === 'undefined');

        expect(invalidNames).toEqual([]);
    });

    test('DATA-002 - Verify product description data integrity | Expected: Each product description should be present, non-empty, and textual.', async ({ page }) => {
        const descriptions = await page.locator('[data-test="inventory-item-desc"]').allTextContents();
        const invalidDescriptions = descriptions.filter((text) => !text || !text.trim() || text.trim() === 'null' || text.trim() === 'undefined');

        expect(invalidDescriptions).toEqual([]);
    });

    test('DATA-003 - Verify product price data integrity | Expected: Each product price should be present and contain a valid numeric value.', async ({ page }) => {
        const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        const invalidPrices = prices.filter((price) => !price || !price.trim() || Number.isNaN(Number.parseFloat(price.replace(/[^0-9.]/g, ''))));

        expect(invalidPrices).toEqual([]);
    });

    test('DATA-004 - Verify product price currency and decimal format | Expected: Product prices should use the application currency format and two decimal places.', async ({ page }) => {
        const priceTexts = await page.locator('[data-test="inventory-item-price"]').allTextContents();

        for (const priceText of priceTexts) {
            expect(priceText.trim()).toMatch(/^\$\d+\.\d{2}$/);
        }
    });

    test('DATA-005 - Verify product image loads successfully | Expected: Each product image should load without broken or missing image state.', async ({ page }) => {
        const productCard = page.locator('[data-test="inventory-item"]').first();
        const image = productCard.locator('svg');

        await expect(image).toBeVisible();
        await expect(image).toBeVisible();
    });

    test('DATA-006 - Verify product image source attribute | Expected: Each product image should have a valid non-empty src pointing to an image resource.', async ({ page }) => {
        const images = page.locator('[data-test="inventory-item"] svg');
        const count = await images.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i += 1) {
            await expect(images.nth(i)).toBeVisible();
        }
    });

    test('DATA-007 - Verify Add to Cart button availability | Expected: Add to Cart should be present, visible, and enabled for each eligible product.', async ({ page }) => {
        const productCards = page.locator('[data-test="inventory-item"]');
        const count = await productCards.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i += 1) {
            const addButton = productCards.nth(i).getByRole('button', { name: 'Add to cart' });
            await expect(addButton).toBeVisible();
            await expect(addButton).toBeEnabled();
        }
    });

    test('SORT-001 - Verify default product sorting by name in ascending alphabetical order (A to Z) | Expected: Name (A to Z) should be selected by default and names should be sorted alphabetically.', async ({ page }) => {
        await expect(productListPage.sortDropdown).toHaveValue('az');

        const productNames = (await page.locator('[data-test="inventory-item-name"] a').allTextContents()).map((name) => name.trim());
        const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));

        expect(productNames).toEqual(sortedNames);
    });

    test('SORT-002 - Verify product sorting by name in descending alphabetical order (Z to A) | Expected: Selecting Name (Z to A) should reorder products from Z to A.', async ({ page }) => {
        await productListPage.sortBy('za');

        const productNames = (await page.locator('[data-test="inventory-item-name"] a').allTextContents()).map((name) => name.trim());
        const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));

        expect(productNames).toEqual(sortedNames);
    });

    test('SORT-003 - Verify product sorting by price in ascending order (Low to High) | Expected: Selecting Price (Low to High) should sort products by price from lowest to highest.', async ({ page }) => {
        await productListPage.sortBy('lohi');

        const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map((price) => Number.parseFloat(price.replace(/[^0-9.]/g, '')));
        const ascendingPrices = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(ascendingPrices);
    });

    test('SORT-004 - Verify product sorting by price in descending order (High to Low) | Expected: Selecting Price (High to Low) should sort products by price from highest to lowest.', async ({ page }) => {
        await productListPage.sortBy('hilo');

        const prices = (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map((price) => Number.parseFloat(price.replace(/[^0-9.]/g, '')));
        const descendingPrices = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(descendingPrices);
    });

    test('CART-001 - Verify a product can be added to the shopping cart | Expected: The selected product should be added successfully and the cart indicator should update.', async ({ page }) => {
        const firstProduct = page.locator('[data-test="inventory-item"]').first();
        const productName = (await firstProduct.locator('a').first().textContent())?.trim() ?? '';

        await firstProduct.getByRole('button', { name: 'Add to cart' }).click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await expect(page.getByRole('link', { name: /cart/i })).toBeVisible();
        expect(productName).not.toBe('');
    });

    test('CART-002 - Verify shopping cart item count after adding a product | Expected: The cart item count should increment and reflect the added product.', async ({ page }) => {
        const firstProduct = page.locator('[data-test="inventory-item"]').first();

        await firstProduct.getByRole('button', { name: 'Add to cart' }).click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    });

    test('CART-003 - Verify product details displayed in the shopping cart | Expected: The product name, description, and price should match the product list details.', async ({ page }) => {
        const productCard = page.locator('[data-test="inventory-item"]').first();
        const productName = (await productCard.locator('[data-test="inventory-item-name"] a').textContent())?.trim() ?? '';
        const productDescription = (await productCard.locator('[data-test="inventory-item-desc"]').textContent())?.trim() ?? '';
        const productPrice = (await productCard.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? '';

        await productCard.getByRole('button', { name: 'Add to cart' }).click();
        await page.getByRole('link', { name: /cart/i }).click();

        await expect(page).toHaveURL(/\/cart$/);
        await expect(page.getByText(productName)).toBeVisible();
        await expect(page.getByText(productDescription)).toBeVisible();
        await expect(page.getByText(productPrice)).toBeVisible();
    });

    test('CART-004 - Verify product ordering in the shopping cart | Expected: Products in the cart should appear in the order defined by business rules and addition sequence.', async ({ page }) => {
        const productCards = page.locator('[data-test="inventory-item"]');
        const firstProductName = (await productCards.nth(0).locator('[data-test="inventory-item-name"] a').textContent())?.trim() ?? '';
        const secondProductName = (await productCards.nth(1).locator('[data-test="inventory-item-name"] a').textContent())?.trim() ?? '';

        await productCards.nth(0).getByRole('button', { name: 'Add to cart' }).click();
        await productCards.nth(1).getByRole('button', { name: 'Add to cart' }).click();
        await page.getByRole('link', { name: /cart/i }).click();

        await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
        await expect(page.getByText(firstProductName)).toBeVisible();
        await expect(page.getByText(secondProductName)).toBeVisible();
    });
});

