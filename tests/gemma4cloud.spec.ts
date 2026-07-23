import { test, expect, request } from '@playwright/test';

/**
 * Configuration based on provided .yaml and .md files
 * Hostname: rivereducation.org
 * MCP Endpoint: mcp.rivereducation.org/mcp
 * Admin Email: neilpandya@protonmail.com
 */

const CONFIG = {
  baseUrl: 'https://rivereducation.org',
  mcpUrl: 'https://mcp.rivereducation.org/mcp',
  adminEmail: 'andrewwitkowski007@gmail.com',
  // Note: In a real scenario, store these in .env files
  mcpToken: '4068bcfc4bb8b399dcbbb3825d546f605100a0af5159cb0f5eea352fcac6bad0',
  password: process.env.OPEN_COACH_PASSWORD || 'WildOne1!',
};

test.describe('Open Coach Infrastructure & Functional Suite', () => {

  test('1. Connectivity: Public Endpoint Accessibility', async ({ page }) => {
    await page.goto(CONFIG.baseUrl);
    // Based on snapshot, the title is "Open Coach (Open WebUI)"
    await expect(page).toHaveTitle(/Open Coach \(Open WebUI\)/);
    await expect(page.locator('text=Sign in to Open Coach')).toBeVisible();
  });

  test('2. Authentication: Valid Login Flow', async ({ page }) => {
    await page.goto(CONFIG.baseUrl);

    // Interact with the Email field
    const emailInput = page.locator('input[placeholder="Enter Your Email"]');
    await emailInput.fill(CONFIG.adminEmail);

    // Interact with the Password field
    const passwordInput = page.locator('input[placeholder="Enter Your Password"]');
    await passwordInput.fill(CONFIG.password);

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify we have moved past the auth page (e.g., presence of the chat interface or user profile)
    await expect(page).not.toHaveURL(/.*auth/);
    await expect(page.locator('text=Andrew Witkowski')).toBeVisible();
  });

  test('3. Application: External Tool Connection Modal', async ({ page }) => {
    // Pre-requisite: Logged in
    await test.step('Login', async () => {
        await page.goto(CONFIG.baseUrl);
        await page.locator('input[placeholder="Enter Your Email"]').fill(CONFIG.adminEmail);
        await page.locator('input[placeholder="Enter Your Password"]').fill(CONFIG.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
    });

    // Navigate to Settings -> Functions -> Tools (based on UI screenshots)
    // Note: Selectors may need adjustment based on actual DOM IDs
    await page.getByText('Settings').click();
    await page.getByText('Functions').click();
    await page.getByText('Tools').click();

    // Click "Add Connection"
    await page.getByText('Add Connection').click();

    // Verify modal fields are present
    await expect(page.locator('text=Type')).toBeVisible();
    await expect(page.locator('text=URL')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });

  test('4. Infrastructure: MCP Gateway Health Check (API)', async () => {
    const apiContext = await request.newContext();

    // Verification as per mcp-cloudflare-endpoint-setup.md [1]
    const response = await apiContext.post(CONFIG.mcpUrl, {
      headers: {
        'Authorization': `Bearer ${CONFIG.mcpToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'playwright-test', version: '1.0' }
        }
      }
    });

    // Expected: HTTP 200 and SSE response [1]
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
  });

  test('5. Infrastructure: NPM Access List Validation', async ({ page }) => {
    // This test verifies that the site is accessible.
    // If you have a non-allowlisted IP, this should ideally fail or trigger basic-auth.
    const response = await page.goto(CONFIG.baseUrl);
    expect(response?.status()).not.toBe(403); // Verify no Forbidden access
  });
});
