import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/Logger';

export class LoginPage extends BasePage {
    private static readonly PATH = '/playwright/ttacart/';

    private readonly textboxUsername: Locator;
    private readonly textboxPassword: Locator;
    private readonly buttonLogin: Locator;
    private readonly alert: Locator;
    private readonly loginCredentialsHint: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');

        this.textboxUsername = page.getByRole("textbox", { name: "Username" });
        this.textboxPassword = page.getByRole("textbox", { name: "Password" });
        this.buttonLogin = page.getByRole("button", { name: "Login" });
        this.alert = page.getByRole("alert");
        this.loginCredentialsHint = page.locator('[data-test="login-credentials"]');

    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
        await this.assertLoaded();
    }

    async assertLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(LoginPage.PATH);
        await expect(this.page).toHaveTitle("TTACart - Login");
    }

    async loginAs(username: string, password: string): Promise<void> {
        logger.info(`Logging in as: ${username}`);

        await this.elementLocator.fill(this.textboxUsername, username);
        await this.elementLocator.fill(this.textboxPassword, password);
        await this.elementLocator.click(this.buttonLogin);
    }

    async getErrorMessage(): Promise<string> {
        return this.elementLocator.getText(this.alert);
    }

    async getLoginCredentialsHint(): Promise<string> {
        return this.elementLocator.getText(this.loginCredentialsHint);
    }
}