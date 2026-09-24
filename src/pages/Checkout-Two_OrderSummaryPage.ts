import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutTwoOrderSummaryPage extends BasePage {
	private static readonly PATH = '/playwright/ttacart/checkout-step-two';

	readonly orderItems: Locator;
	readonly itemTotal: Locator;
	readonly tax: Locator;
	readonly total: Locator;
	readonly linkCancel: Locator;
	readonly buttonFinish: Locator;

	constructor(page: Page) {
		super(page, 'CheckoutTwoOrderSummaryPage');

		this.orderItems = page.locator('.cart_item');
		this.itemTotal = page.getByText(/^Item total:/);
		this.tax = page.getByText(/^Tax:/);
		this.total = page.getByText(/^Total:/);
		this.linkCancel = page.getByRole('link', { name: 'Cancel' });
		this.buttonFinish = page.getByRole('button', { name: 'Finish' });
	}

	async open(): Promise<void> {
		await this.goto(CheckoutTwoOrderSummaryPage.PATH);
		await this.assertLoaded();
	}

	async assertLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(CheckoutTwoOrderSummaryPage.PATH);
		await expect(this.page).toHaveTitle('TTACart - Checkout: Overview');
		await expect(this.itemTotal).toBeVisible();
		await expect(this.tax).toBeVisible();
		await expect(this.total).toBeVisible();
		await expect(this.buttonFinish).toBeVisible();
	}

	async finish(): Promise<void> {
		await this.buttonFinish.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/checkout-complete$/);
	}

	async cancel(): Promise<void> {
		await this.linkCancel.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/cart$/);
	}
}
