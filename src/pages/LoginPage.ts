import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/Logger';

export class LoginPage extends BasePage {
    private static readonly PATH = '/playwright/ttacart/index.html';

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorBox: Locator;
    private readonly loginCredentialsHint: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');

        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorBox = page.locator('[data-test="error"]');
        this.loginCredentialsHint = page.locator('[data-test="login-credentials"]');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }

    async loginAs(username: string, password: string): Promise<void> {
        logger.info(`Logging in as: ${username}`);

        await this.elementLocator.fill(this.usernameInput, username);
        await this.elementLocator.fill(this.passwordInput, password);
        await this.elementLocator.click(this.loginButton);
    }

    async getErrorMessage(): Promise<string> {
        return this.elementLocator.getText(this.errorBox);
    }

    async getLoginCredentialsHint(): Promise<string> {
        return this.elementLocator.getText(this.loginCredentialsHint);
    }
}