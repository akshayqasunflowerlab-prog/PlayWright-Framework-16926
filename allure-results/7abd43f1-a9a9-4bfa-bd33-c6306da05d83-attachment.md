# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Login.spec.ts >> TTACart - Login >> TC_LOGIN_004 - Verify performance-glitch user can login successfully
- Location: src\tests\Login.spec.ts:29:10

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.inventory_list')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.inventory_list') with timeout 10000ms
  - waiting for locator('.inventory_list')

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
- text: Products
- combobox "Sort products":
  - option "Name (A to Z)" [selected]
  - option "Name (Z to A)"
  - option "Price (low to high)"
  - option "Price (high to low)"
- main:
  - article:
    - link:
      - /url: ./inventory-item.html?id=test-allthethings-tshirt-red
    - link "Test.allTheThings() T-Shirt (Red)":
      - /url: ./inventory-item.html?id=test-allthethings-tshirt-red
    - text: This classic TTA t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton. $15.99
    - button "Add to cart"
  - article:
    - link:
      - /url: ./inventory-item.html?id=tta-bike-light
    - link "TTA Bike Light":
      - /url: ./inventory-item.html?id=tta-bike-light
    - text: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included. $9.99
    - button "Add to cart"
  - article:
    - link:
      - /url: ./inventory-item.html?id=tta-bolt-tshirt
    - link "TTA Bolt T-Shirt":
      - /url: ./inventory-item.html?id=tta-bolt-tshirt
    - text: Get your testing superhero on with the TTA bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt. $15.99
    - button "Add to cart"
  - article:
    - link:
      - /url: ./inventory-item.html?id=tta-fleece-jacket
    - link "TTA Fleece Jacket":
      - /url: ./inventory-item.html?id=tta-fleece-jacket
    - text: It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office. $49.99
    - button "Add to cart"
  - article:
    - link:
      - /url: ./inventory-item.html?id=tta-junior-tester-onesie
    - link "TTA Junior Tester Onesie":
      - /url: ./inventory-item.html?id=tta-junior-tester-onesie
    - text: Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel. $7.99
    - button "Add to cart"
  - article:
    - link:
      - /url: ./inventory-item.html?id=tta-practice-backpack
    - link "TTA Practice Backpack":
      - /url: ./inventory-item.html?id=tta-practice-backpack
    - text: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection. $29.99
    - button "Add to cart"
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
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/LoginPage';
  3  | 
  4  | test.describe('TTACart - Login', () => {
  5  |     let loginPage: LoginPage;
  6  | 
  7  |     test.beforeEach(async ({ page }) => {
  8  |         loginPage = new LoginPage(page);
  9  |         await loginPage.open();
  10 |     });
  11 | 
  12 |     test('TC_LOGIN_001 - Verify valid credentials are accepted and user is redirected to the Products List page', async ({ page }) => {
  13 |         await loginPage.loginAs('standard_user', 'tta_secret');
  14 |         await expect(page).toHaveURL('./playwright/ttacart/inventory');
  15 |     });
  16 | 
  17 |     test('TC_LOGIN_002 - Verify locked-out user cannot login', async () => {
  18 |         await loginPage.loginAs('locked_out_user', 'tta_secret');
  19 |         const errorMessage = await loginPage.getErrorMessage();
  20 |         expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
  21 |     });
  22 | 
  23 |     test('TC_LOGIN_003 - Verify invalid credentials are rejected', async () => {
  24 |         await loginPage.loginAs('invalid_user', 'invalid_password');
  25 |         const errorMessage = await loginPage.getErrorMessage();
  26 |         expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  27 |     });
  28 | 
  29 |     test.only('TC_LOGIN_004 - Verify performance-glitch user can login successfully', async ({ page }) => {
  30 |         await loginPage.loginAs('performance_glitch_user', 'tta_secret');
  31 |         await expect(page).toHaveURL('./playwright/ttacart/inventory');
> 32 |         await expect(page.locator('.inventory_list')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  33 |         //await expect(page.getByRole("button", { name: "Login" })).not.toBeVisible();
  34 |     });
  35 | 
  36 | });
  37 | 
  38 | /**
  39 | 
  40 | Login - Verify valid credentials are accepted and user is redirected to the Products List page 
  41 | Login - Verify locked-out user cannot login (Epic sadface: Sorry, this user has been locked out.)
  42 | Login - Verify invalid credentials are rejected (Epic sadface: Username and password do not match any user in this service)
  43 | Login - Verify performance-glitch user can login successfully 
  44 | 
  45 | **/
```