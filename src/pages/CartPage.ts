import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
	private static readonly PATH = '/playwright/ttacart/cart';

	readonly cartItems: Locator;
	readonly linkContinueShopping: Locator;
	readonly linkCheckout: Locator;

	constructor(page: Page) {
		super(page, 'CartPage');

		this.cartItems = page.locator('[data-test="inventory-item"]');
		this.linkContinueShopping = page.getByRole('link', { name: 'Continue Shopping' });
		this.linkCheckout = page.getByRole('link', { name: 'Checkout' });
	}

	async open(): Promise<void> {
		await this.goto(CartPage.PATH);
		await this.assertLoaded();
	}

	async assertLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(CartPage.PATH);
		await expect(this.page).toHaveTitle('TTACart - Your Cart');
		await expect(this.page.getByText('Your Cart')).toBeVisible();
		await expect(this.linkContinueShopping).toBeVisible();
		await expect(this.linkCheckout).toBeVisible();
	}

	getItem(productName: string): Locator {
		return this.cartItems.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
	}

	async removeProduct(productName: string): Promise<void> {
		await this.getItem(productName).getByRole('button', { name: 'Remove' }).click();
	}

	async getItemCount(): Promise<number> {
		return this.cartItems.count();
	}

	async continueShopping(): Promise<void> {
		await this.linkContinueShopping.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/inventory$/);
	}

	async checkout(): Promise<void> {
		await this.linkCheckout.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/checkout-step-one$/);
	}
}
