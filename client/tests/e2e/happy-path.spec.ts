import { test } from '@playwright/test';

test('happy path', async ({ page }) => {
  await page.goto('http://localhost:5173');
});
