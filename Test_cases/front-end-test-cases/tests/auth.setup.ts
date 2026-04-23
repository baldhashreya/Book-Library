import { test as setup, expect } from '../src/fixtures/baseFixture';
import * as path from 'path';
import * as fs from 'fs';

const authFile = path.join(__dirname, '../auth.json');

setup('authenticate', async ({ page, loginPage }) => {
  // Load credentials
  const creds = require('../../data/login.json');
  
  // Perform login
  await loginPage.login(creds.email, creds.password);
  
  // Verify successful login
  // Wait for redirection to complete with detailed error logging
  try {
    await page.waitForURL(/.*dashboard/, { timeout: 15000 });
  } catch (e) {
    // Check if there's an error toast visible
    const errorToast = page.getByRole('alert').first();
    if (await errorToast.isVisible()) {
      const message = await errorToast.innerText();
      throw new Error(`Login failed: ${message}`);
    }
    throw e;
  }
  
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  
  // Save storage state
  // 1. Delete existing file if it exists
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
  }
  
  // 2. Save new state
  await page.context().storageState({ path: authFile });
});
