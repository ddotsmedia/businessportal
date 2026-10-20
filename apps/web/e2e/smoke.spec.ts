import { test, expect } from '@playwright/test';

test('health check returns 200', async ({ request }) => {
  const response = await request.get('http://localhost:3100/api/health');
  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data).toHaveProperty('status', 'ok');
  expect(data).toHaveProperty('db', 'ok');
});

test('home page renders the title', async ({ page }) => {
  await page.goto('http://localhost:3100');
  const heading = page.locator('h1');
  await expect(heading).toContainText('Ddotsmedia Business Portal');
});
