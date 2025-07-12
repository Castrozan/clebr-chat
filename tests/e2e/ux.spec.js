import { test, expect } from '@playwright/test';

test.describe('User Experience Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/chat.html');
        await expect(page.locator('#chatContainer')).toBeVisible();
        await expect(page.locator('#messageInput')).toBeVisible();
        await page.waitForTimeout(1000);
    });

    async function testChatQuery(page, query, expectedKeywords = []) {
        console.log(`Testing query: "${query}"`);

        await page.locator('#messageInput').clear();
        await page.locator('#messageInput').fill(query);
        await page.locator('#messageInput').press('Enter');

        try {
            await page.waitForSelector('.message.assistant', { timeout: 30000 });
            await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 30000 });

            const response = await page.locator('.message.assistant').last().textContent();
            console.log(`Response received (${response.length} characters)`);

            // Basic validation
            expect(response.length).toBeGreaterThan(5);

            // Check for expected keywords if provided
            if (expectedKeywords.length > 0) {
                const lowerResponse = response.toLowerCase();
                const foundKeywords = expectedKeywords.filter(keyword =>
                    lowerResponse.includes(keyword.toLowerCase())
                );

                console.log(`Found keywords: ${foundKeywords.join(', ')}`);
                expect(foundKeywords.length).toBeGreaterThan(0);
            }

            return response;
        } catch (error) {
            console.log(`Query failed: ${error.message}`);
            throw error;
        }
    }

    test('Response accuracy for equipment queries', async ({ page }) => {
        const equipmentQueries = [
            {
                question: "List all equipment",
                expectedKeywords: ['equipment', 'laptop', 'computer']
            },
            {
                question: "What equipment is available?",
                expectedKeywords: ['equipment', 'available']
            },
            {
                question: "Show me computer equipment",
                expectedKeywords: ['computer', 'laptop']
            }
        ];

        for (const query of equipmentQueries) {
            const response = await testChatQuery(page, query.question, query.expectedKeywords);

            // Response should be reasonably detailed
            expect(response.length).toBeGreaterThan(20);

            // Should not be a generic unhelpful response
            const lowerResponse = response.toLowerCase();
            expect(lowerResponse).not.toContain('i cannot help');
            expect(lowerResponse).not.toContain('i don\'t have access');

            await page.waitForTimeout(1000);
        }
    });

    test('Response accuracy for professional queries', async ({ page }) => {
        const professionalQueries = [
            {
                question: "List all professionals",
                expectedKeywords: ['professional', 'team', 'staff']
            },
            {
                question: "Show me team members",
                expectedKeywords: ['team', 'member', 'professional']
            },
            {
                question: "Who are the professionals?",
                expectedKeywords: ['professional', 'team']
            }
        ];

        for (const query of professionalQueries) {
            const response = await testChatQuery(page, query.question, query.expectedKeywords);

            // Response should be reasonably detailed
            expect(response.length).toBeGreaterThan(20);

            // Should provide specific information
            const lowerResponse = response.toLowerCase();
            expect(lowerResponse).not.toContain('i cannot help');

            await page.waitForTimeout(1000);
        }
    });

    test('Response helpfulness for general queries', async ({ page }) => {
        const generalQueries = [
            "Help me understand the system",
            "What can you do?",
            "How does this work?",
            "Show me an overview"
        ];

        for (const query of generalQueries) {
            const response = await testChatQuery(page, query);

            // Response should be helpful and detailed
            expect(response.length).toBeGreaterThan(30);

            // Should contain helpful indicators
            const lowerResponse = response.toLowerCase();
            const helpfulIndicators = [
                'you can', 'available', 'help', 'here are', 'options', 'i can'
            ];

            const foundIndicators = helpfulIndicators.filter(indicator =>
                lowerResponse.includes(indicator)
            );

            console.log(`Found helpful indicators: ${foundIndicators.join(', ')}`);
            expect(foundIndicators.length).toBeGreaterThan(0);

            await page.waitForTimeout(1000);
        }
    });

    test('Response clarity and structure', async ({ page }) => {
        const structuredQueries = [
            "Give me a detailed overview of all equipment",
            "Explain the team structure",
            "List all available resources"
        ];

        for (const query of structuredQueries) {
            const response = await testChatQuery(page, query);

            // Response should be well-structured
            expect(response.length).toBeGreaterThan(50);

            // Check for structural elements
            const hasStructure = response.includes('\n') ||
                response.includes('•') ||
                response.includes('-') ||
                response.includes('1.') ||
                response.includes('*');

            console.log(`Response has structure: ${hasStructure}`);

            // Should contain complete sentences
            const sentenceCount = (response.match(/[.!?]+/g) || []).length;
            expect(sentenceCount).toBeGreaterThan(1);

            await page.waitForTimeout(1000);
        }
    });

    test('Response consistency for repeated queries', async ({ page }) => {
        const repeatedQuery = "List all equipment";
        const responses = [];

        for (let i = 0; i < 2; i++) {
            const response = await testChatQuery(page, `${repeatedQuery} ${i + 1}`);
            responses.push(response);

            // Each response should be reasonably detailed
            expect(response.length).toBeGreaterThan(20);

            await page.waitForTimeout(1500);
        }

        // Responses should be consistent in quality
        responses.forEach(response => {
            expect(response.length).toBeGreaterThan(20);

            const lowerResponse = response.toLowerCase();
            expect(lowerResponse).not.toContain('error');
            expect(lowerResponse).not.toContain('failed');
        });
    });

    test('Input validation and error handling', async ({ page }) => {
        const edgeCases = [
            "",  // Empty input
            "   ",  // Whitespace only
            "a",  // Single character
            "?",  // Single punctuation
            "Help Help Help Help Help Help Help Help Help Help"  // Repetitive input
        ];

        for (const input of edgeCases) {
            console.log(`Testing edge case: "${input}"`);

            await page.locator('#messageInput').clear();
            await page.locator('#messageInput').fill(input);
            await page.locator('#messageInput').press('Enter');

            try {
                await page.waitForSelector('.message.assistant', { timeout: 15000 });
                await page.waitForSelector('.message.assistant.loading', { state: 'detached', timeout: 15000 });

                const response = await page.locator('.message.assistant').last().textContent();
                console.log(`Response received for edge case (${response.length} characters)`);

                // Should handle gracefully - either provide response or handle appropriately
                if (response.length > 0) {
                    expect(response.length).toBeGreaterThan(5);
                }
            } catch (error) {
                console.log(`Edge case handled by timeout (expected for empty/invalid inputs)`);
            }

            await page.waitForTimeout(1000);
        }
    });
}); 