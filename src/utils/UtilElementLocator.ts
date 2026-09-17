import { Locator, Page } from '@playwright/test';
import { logger } from './Logger';

export const DEFAULT_ACTION_TIMEOUT_MS = 15_000;

export type Flex = string | Locator;

class UtilElementLocator {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        logger.debug('Initialized UtilElementLocator');
    }

    private toLocator(target: Flex): Locator {
        const description =
            typeof target === 'string' ? target : 'existing Locator';

        logger.debug(`Resolving element: ${description}`);

        return typeof target === 'string'
            ? this.page.locator(target)
            : target;
    }

    // Mouse actions
    async click(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).click({ timeout: timeoutMs });
    }

    async doubleClick(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).dblclick({ timeout: timeoutMs });
    }

    async rightClick(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).click({ button: "right", timeout: timeoutMs });
    }

    // Pointer actions
    async hover(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).hover({ timeout: timeoutMs });
    }

    async tap(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).tap({ timeout: timeoutMs });
    }

    async dragTo(source: Flex, destination: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(source).dragTo(this.toLocator(destination), { timeout: timeoutMs });
    }

    // Input actions
    async fill(target: Flex, value: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).fill(value, { timeout: timeoutMs });
    }

    async type(target: Flex, value: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).type(value, { timeout: timeoutMs });
    }

    async clear(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.fill(target, "", timeoutMs);
    }

    async press(target: Flex, key: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).press(key, { timeout: timeoutMs });
    }

    async pressSequentially(target: Flex, value: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).pressSequentially(value, { timeout: timeoutMs });
    }

    async focus(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).focus({ timeout: timeoutMs });
    }

    async check(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).check({ timeout: timeoutMs });
    }

    async uncheck(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).uncheck({ timeout: timeoutMs });
    }

    async selectOption(
        target: Flex,
        value: string | string[],
        timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS,
    ): Promise<void> {
        await this.toLocator(target).selectOption(value, { timeout: timeoutMs });
    }

    async setInputFiles(
        target: Flex,
        files: string | string[],
        timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS,
    ): Promise<void> {
        await this.toLocator(target).setInputFiles(files, { timeout: timeoutMs });
    }

    // Text and content getters
    async getText(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<string> {
        return this.toLocator(target).innerText({ timeout: timeoutMs });
    }

    async getInnerText(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<string> {
        return this.toLocator(target).innerText({ timeout: timeoutMs });
    }

    async getAllTexts(target: Flex): Promise<string[]> {
        return this.toLocator(target).allTextContents();
    }

    async getAttr(target: Flex, attributeName: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<string | null> {
        return this.toLocator(target).getAttribute(attributeName, { timeout: timeoutMs });
    }

    async getValue(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<string> {
        return this.toLocator(target).inputValue({ timeout: timeoutMs });
    }

    // Count
    async count(target: Flex): Promise<number> {
        return this.toLocator(target).count();
    }

    // State checks
    async isVisible(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<boolean> {
        return this.toLocator(target).isVisible({ timeout: timeoutMs });
    }

    async isEnabled(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<boolean> {
        return this.toLocator(target).isEnabled({ timeout: timeoutMs });
    }

    async isChecked(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<boolean> {
        return this.toLocator(target).isChecked({ timeout: timeoutMs });
    }

    // Waits
    async waitForVisible(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).waitFor({ state: "visible", timeout: timeoutMs });
    }

    async waitForHidden(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).waitFor({ state: "hidden", timeout: timeoutMs });
    }

    async waitForPageLoad(timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.page.waitForLoadState("load", { timeout: timeoutMs });
    }

    // Selects
    async selectByText(target: Flex, text: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).selectOption({ label: text }, { timeout: timeoutMs });
    }

    async selectByValue(target: Flex, value: string, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).selectOption({ value }, { timeout: timeoutMs });
    }

    async selectByIndex(target: Flex, index: number, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).selectOption({ index }, { timeout: timeoutMs });
    }

    // Element state actions
    async scrollIntoView(target: Flex, timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        await this.toLocator(target).scrollIntoViewIfNeeded({ timeout: timeoutMs });
    }
}

export default UtilElementLocator;

