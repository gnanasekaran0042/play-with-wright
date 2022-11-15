import { test as baseTest } from '@playwright/test';
export { expect } from '@playwright/test';
import path from "path";
import fs from "fs";

export const test = baseTest.extend({
    storageState: async ({ browser }, use, testInfo) => {
        // Override storage state, use worker index to look up logged-in info and generate it lazily.
        const fileName = path.join(testInfo.project.outputDir, 'storageState.json');
        if (!fs.existsSync(fileName)) {
            // Make sure we are not using any other storage state.
            const page = await browser.newPage({ storageState: undefined });
            await page.goto('https://test.stateofedu.com/wp-admin');
            // Create a unique username for each worker.
            await page.getByLabel('Username or Email Address').fill('1kq1o');
            await page.getByLabel('Password').fill('$WQF0S@w8$');
            await page.getByRole('button', { name: 'Log In' }).click();
            await page.context().storageState({ path: fileName });
            await page.close();
        }
        await use(fileName);
    },
});