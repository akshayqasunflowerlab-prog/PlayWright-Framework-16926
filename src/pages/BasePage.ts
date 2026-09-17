import { Page } from '@playwright/test';
import UtilElementLocator from '../utils/UtilElementLocator';
import { logger } from '../utils/Logger';

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly elementLocator: UtilElementLocator;
    protected readonly scope: string;

    protected constructor(page: Page, scope: string) {
        this.page = page;
        this.scope = scope;
        this.elementLocator = new UtilElementLocator(page);

        logger.debug(`Initialized page: ${scope}`);
    }

    protected async goto(relativePath: string): Promise<void> {
        logger.info(`Navigating to: ${relativePath}`);

        await this.page.goto(relativePath);
        await this.page.waitForLoadState('domcontentloaded');

        logger.info(`Page loaded: ${relativePath}`);
    }
}