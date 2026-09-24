import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
	private static readonly PATH = '/playwright/ttacart/inventory-item';

	readonly buttonBack: Locator;
	readonly productName: Locator;
	readonly productDescription: Locator;
	readonly productPrice: Locator;
	readonly buttonAddToCart: Locator;

	constructor(page: Page) {
		super(page, 'ProductDetailsPage');

		this.buttonBack = page.getByRole('button', { name: 'Back' });
		this.productName = page.getByRole('heading', { level: 2 });
		this.productDescription = page.locator('main p');
		this.productPrice = page.locator('[data-test="inventory-item-price"]');
		this.buttonAddToCart = page.getByRole('button', { name: 'Add to cart' });
	}

	async open(productId: string): Promise<void> {
		await this.goto(`${ProductDetailsPage.PATH}?id=${productId}`);
		await this.assertLoaded();
	}

	async assertLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/inventory-item\?id=.+/);
		await expect(this.page).toHaveTitle(/TTACart - .+/);
		await expect(this.productName).toBeVisible();
		await expect(this.productDescription).toBeVisible();
		await expect(this.productPrice).toBeVisible();
		await expect(this.buttonAddToCart).toBeVisible();
	}

	async addToCart(): Promise<void> {
		await this.buttonAddToCart.click();
	}

	async goBack(): Promise<void> {
		await this.buttonBack.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/inventory$/);
	}
}
