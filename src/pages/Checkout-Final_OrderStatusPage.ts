import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutFinalOrderStatusPage extends BasePage {
	private static readonly PATH = '/playwright/ttacart/checkout-complete';

	readonly orderConfirmation: Locator;
	readonly orderStatusMessage: Locator;
	readonly linkBackHome: Locator;

	constructor(page: Page) {
		super(page, 'CheckoutFinalOrderStatusPage');

		this.orderConfirmation = page.getByRole('heading', { name: 'Thank you for your order!' });
		this.orderStatusMessage = page.getByText(/Your order has been dispatched/);
		this.linkBackHome = page.getByRole('link', { name: 'Back Home' });
	}

	async open(): Promise<void> {
		await this.goto(CheckoutFinalOrderStatusPage.PATH);
		await this.assertLoaded();
	}

	async assertLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(CheckoutFinalOrderStatusPage.PATH);
		await expect(this.page).toHaveTitle('TTACart - Checkout: Complete!');
		await expect(this.orderConfirmation).toBeVisible();
		await expect(this.orderStatusMessage).toBeVisible();
		await expect(this.linkBackHome).toBeVisible();
	}

	async backHome(): Promise<void> {
		await this.linkBackHome.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/inventory$/);
	}
}
