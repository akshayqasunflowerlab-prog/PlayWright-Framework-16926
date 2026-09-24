import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type ProductSort = 'az' | 'za' | 'lohi' | 'hilo';

export class ProductListPage extends BasePage {
    private static readonly PATH = '/playwright/ttacart/inventory';

    readonly buttonOpenMenu: Locator;
    readonly sidemenu: Locator;
    readonly linkAllItems: Locator;
    readonly linkAbout: Locator;
    readonly linkLogout: Locator;
    readonly resetSidebarLink: Locator;
    readonly buttonCloseMenu: Locator;
    readonly titlettacart: Locator;
    readonly titleproducts: Locator;
    readonly sortDropdown: Locator;
    readonly sortoption1: Locator;
    readonly sortoption2: Locator;
    readonly sortoption3: Locator;
    readonly sortoption4: Locator;
    readonly inventoryGrid: Locator;
    readonly linkTtaBikeLight: Locator;
    readonly inventoryItemPrice: Locator;
    readonly buttonAddToCart: Locator;
    readonly buttonRemoveFromCart: Locator;
    readonly buttonCart: Locator;


    constructor(page: Page) {
        super(page, 'ProductListPage');

        this.buttonOpenMenu = page.getByRole("button", { name: "Open menu" });
        this.sidemenu = page.locator("#sideMenu");
        this.linkAllItems = page.getByRole("link", { name: "All Items" });
        this.linkAbout = page.getByRole("link", { name: "About" });
        this.linkLogout = page.getByRole("link", { name: "Logout" });
        this.resetSidebarLink = page.locator("#reset_sidebar_link");
        this.buttonCloseMenu = page.getByRole("button", { name: "Close menu" });
        this.titlettacart = page.locator('[data-test="primary-header"]').getByText("TTACart");
        this.titleproducts = page.getByText("Products");
        this.sortDropdown = page.locator("//div[@class='sort-wrap']//select");
        this.sortoption1 = page.locator('option[value="az"]');
        this.sortoption2 = page.getByRole("option", { name: "Name (Z to A)" });
        this.sortoption3 = page.getByRole("option", { name: "Price (low to high)" });
        this.sortoption4 = page.getByRole("option", { name: "Price (high to low)" });
        this.inventoryGrid = page.locator("#inventory-grid");
        this.linkTtaBikeLight = page.getByRole("link", { name: "TTA Bike Light" });
        this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
        this.buttonAddToCart = page.getByRole("button", { name: "Add to cart" });
        this.buttonRemoveFromCart = page.getByRole("button", { name: "Remove" });
        this.buttonCart = page.getByRole("link", { name: /cart/i });

    }

    async open(): Promise<void> {
        await this.goto(ProductListPage.PATH);
        await this.assertLoaded();
    }

    async assertLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(ProductListPage.PATH);
        await expect(this.page).toHaveTitle("TTACart - Products");
        await expect(this.buttonOpenMenu).toBeVisible();
        await expect(this.titlettacart).toHaveText("TTACart");
        await expect(this.titleproducts).toHaveText("Products");
        await expect(this.sortDropdown).toHaveValue("az");
        await expect(this.inventoryGrid).toBeVisible();
        await expect.poll(async () => this.page.locator('[data-test="inventory-item"]').count(), { timeout: 5000 }).toBeGreaterThan(5);
    }

    async openMenu(): Promise<void> {
        await this.buttonOpenMenu.click();
        await expect(this.sidemenu).toBeVisible();
    }

    async closeMenu(): Promise<void> {
        await this.buttonCloseMenu.click();
        await expect(this.sidemenu).toBeHidden();
    }

    async showAllItems(): Promise<void> {
        await this.openMenu();
        await this.linkAllItems.click();
        await this.assertLoaded();
    }

    async sortBy(sort: ProductSort): Promise<void> {
        await this.sortDropdown.selectOption(sort);
    }

    getProductCard(productName: string): Locator {
        return this.page
            .locator('[data-test="inventory-item"]')
            .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    async openProduct(productName: string): Promise<void> {
        await this.getProductCard(productName).getByRole('link', { name: productName, exact: true }).click();
    }

    async addProductToCart(productName: string): Promise<void> {
        await this.getProductCard(productName).getByRole('button', { name: 'Add to cart' }).click();
    }

    async removeProductFromCart(productName: string): Promise<void> {
        await this.getProductCard(productName).getByRole('button', { name: 'Remove' }).click();
    }

    async isProductInCart(productName: string): Promise<boolean> {
        return this.getProductCard(productName).getByRole('button', { name: 'Remove' }).isVisible();
    }

    async getProductPrice(productName: string): Promise<string> {
        return this.getProductCard(productName).getByTestId('inventory-item-price').innerText();
    }

    async getProductNames(): Promise<string[]> {
        return this.inventoryGrid.getByRole('link').allTextContents();
    }
}