import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOneCustomerDetailsPage extends BasePage {
	private static readonly PATH = '/playwright/ttacart/checkout-step-one';

	readonly textboxFirstName: Locator;
	readonly textboxLastName: Locator;
	readonly textboxPostalCode: Locator;
	readonly linkCancel: Locator;
	readonly buttonContinue: Locator;

	constructor(page: Page) {
		super(page, 'CheckoutOneCustomerDetailsPage');

		this.textboxFirstName = page.getByRole('textbox', { name: 'First Name' });
		this.textboxLastName = page.getByRole('textbox', { name: 'Last Name' });
		this.textboxPostalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
		this.linkCancel = page.getByRole('link', { name: 'Cancel' });
		this.buttonContinue = page.getByRole('button', { name: 'Continue' });
	}

	async open(): Promise<void> {
		await this.goto(CheckoutOneCustomerDetailsPage.PATH);
		await this.assertLoaded();
	}

	async assertLoaded(): Promise<void> {
		await expect(this.page).toHaveURL(CheckoutOneCustomerDetailsPage.PATH);
		await expect(this.page).toHaveTitle('TTACart - Checkout: Your Information');
		await expect(this.textboxFirstName).toBeVisible();
		await expect(this.textboxLastName).toBeVisible();
		await expect(this.textboxPostalCode).toBeVisible();
	}

	async enterCustomerDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
		await this.textboxFirstName.fill(firstName);
		await this.textboxLastName.fill(lastName);
		await this.textboxPostalCode.fill(postalCode);
	}

	async continue(): Promise<void> {
		await this.buttonContinue.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/checkout-step-two$/);
	}

	async cancel(): Promise<void> {
		await this.linkCancel.click();
		await expect(this.page).toHaveURL(/\/playwright\/ttacart\/cart$/);
	}
}
