# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ProductDetails.spec.ts >> TTACart - Product Details Page >> DETAILS-002 - Verify a product can be added to the cart from its detail page
- Location: src\tests\ProductDetails.spec.ts:19:9

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.shopping_cart_badge')
Expected: "1"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" locator('.shopping_cart_badge') with timeout 10000ms
  - waiting for locator('.shopping_cart_badge')

```

```yaml
- complementary:
  - button "Close menu": ×
  - link "All Items":
    - /url: ./inventory.html
  - link "About":
    - /url: https://app.thetestingacademy.com/
  - link "Logout":
    - /url: "#"
  - link "Reset App State":
    - /url: "#"
- banner:
  - button "Open menu":
    - img
  - text: TTACart
  - link "Shopping cart":
    - /url: ./cart.html
    - img
    - text: "1"
- text: Product Details
- main:
  - button "Back":
    - img
    - text: Back
  - heading "TTA Bike Light" [level=2]
  - paragraph: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
  - text: $9.99
  - button "Remove"
- contentinfo:
  - link "Twitter":
    - /url: https://twitter.com/TheTestingAcad
    - img
  - link "Facebook":
    - /url: https://facebook.com/
    - img
  - link "LinkedIn":
    - /url: https://linkedin.com/
    - img
  - text: (c) 2026 TTACart - The Testing Academy. All Rights Reserved.
  - link "Terms of Service":
    - /url: https://app.thetestingacademy.com/
  - text: "|"
  - link "Privacy Policy":
    - /url: https://app.thetestingacademy.com/
```

# Test source

```ts
  1  | import { test, expect } from '../fixtures/Test-base';
  2  | 
  3  | test.describe('TTACart - Product Details Page', () => {
  4  |     test.beforeEach(async ({ loginPage, productListPage }) => {
  5  |         await loginPage.open();
  6  |         await loginPage.loginAs('standard_user', 'tta_secret');
  7  |         await productListPage.assertLoaded();
  8  |     });
  9  | 
  10 |     test('DETAILS-001 - Verify a product detail page displays the selected product', async ({ productListPage, productDetailsPage }) => {
  11 |         await productListPage.openProduct('TTA Bike Light');
  12 |         await productDetailsPage.assertLoaded();
  13 | 
  14 |         await expect(productDetailsPage.productName).toHaveText('TTA Bike Light');
  15 |         await expect(productDetailsPage.productDescription).toContainText('Water-resistant');
  16 |         await expect(productDetailsPage.productPrice).toHaveText('$9.99');
  17 |     });
  18 | 
  19 |     test('DETAILS-002 - Verify a product can be added to the cart from its detail page', async ({ productListPage, productDetailsPage, page }) => {
  20 |         await productListPage.openProduct('TTA Bike Light');
  21 |         await productDetailsPage.addToCart();
  22 | 
> 23 |         await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
     |                                                            ^ Error: expect(locator).toHaveText(expected) failed
  24 |     });
  25 | 
  26 |     test('DETAILS-003 - Verify Back returns to the product list', async ({ productListPage, productDetailsPage }) => {
  27 |         await productListPage.openProduct('TTA Bike Light');
  28 |         await productDetailsPage.goBack();
  29 |         await productListPage.assertLoaded();
  30 |     });
  31 | });
  32 | 
```