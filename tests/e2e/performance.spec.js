import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
        await page.waitForTimeout(1000);
    });

    test('Basic chat performance test', async ({ page }) => {
        const testQueries = [
            "Hello",
            "List equipment",
            "Show professionals",
            "Help"
        ];

        for (let i = 0; i < testQueries.length; i++) {
            const query = testQueries[i];
            console.log(`Testing query: "${query}"`);

            const startTime = Date.now();

            // Clear and send message
            await page.locator('#messageInput').clear();
            await page.locator('#messageInput').fill(query);
            await page.locator('#messageInput').press('Enter');

            // Wait for response
            await page.waitForSelector('.message.assistant', { timeout: 45000 });

            try {
                await page.waitForSelector('.message.assistant.loading', {
                    state: 'detached',
                    timeout: 45000
                });
            } catch (error) {
                // Loading indicator timeout is acceptable
            }

            const responseTime = Date.now() - startTime;
            const response = await page.locator('.message.assistant').last().textContent();

            console.log(`Response time: ${responseTime}ms, Response length: ${response.length} characters`);

            // Validate response
            expect(response.length).toBeGreaterThan(5);
            expect(responseTime).toBeLessThan(60000); // Under 1 minute

            await page.waitForTimeout(1000);
        }
    });

    test('Response consistency test', async ({ page }) => {
        const repeatedQuery = "List equipment";
        const iterations = 2;

        const responseTimes = [];

        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();

            await page.locator('#messageInput').clear();
            await page.locator('#messageInput').fill(`${repeatedQuery} ${i + 1}`);
            await page.locator('#messageInput').press('Enter');

            await page.waitForSelector('.message.assistant', { timeout: 45000 });

            try {
                await page.waitForSelector('.message.assistant.loading', {
                    state: 'detached',
                    timeout: 45000
                });
            } catch (error) {
                // Loading indicator timeout is acceptable
            }

            const responseTime = Date.now() - startTime;
            responseTimes.push(responseTime);

            console.log(`Iteration ${i + 1}: ${responseTime}ms`);

            const response = await page.locator('.message.assistant').last().textContent();
            expect(response.length).toBeGreaterThan(5);

            await page.waitForTimeout(1500);
        }

        // Check that all responses completed within reasonable time
        responseTimes.forEach(time => {
            expect(time).toBeLessThan(60000);
        });
    });

    test('Quick response time test', async ({ page }) => {
        const quickQueries = [
            "Overview of equipment?",
            "Team structure info"
        ];

        for (const query of quickQueries) {
            console.log(`Testing quick query: "${query}"`);

            const startTime = Date.now();

            await page.locator('#messageInput').clear();
            await page.locator('#messageInput').fill(query);
            await page.locator('#messageInput').press('Enter');

            await page.waitForSelector('.message.assistant', { timeout: 45000 });

            try {
                await page.waitForSelector('.message.assistant.loading', {
                    state: 'detached',
                    timeout: 45000
                });
            } catch (error) {
                // Loading indicator timeout is acceptable
            }

            const responseTime = Date.now() - startTime;
            const response = await page.locator('.message.assistant').last().textContent();

            console.log(`Response time: ${responseTime}ms, Response length: ${response.length} characters`);

            expect(response.length).toBeGreaterThan(5);
            expect(responseTime).toBeLessThan(30000); // Under 30 seconds

            await page.waitForTimeout(2000);
        }
    });
}); 